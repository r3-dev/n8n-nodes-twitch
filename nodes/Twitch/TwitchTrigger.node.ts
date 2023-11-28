import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from "n8n-workflow";

import { twitchApiRequest } from "./GenericFunctions";

export class TwitchTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Twitch Trigger",
		name: "twitchTrigger",
		icon: "file:twitch.svg",
		group: ["trigger"],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: "Handle Twitch events via webhooks",
		defaults: {
			name: "Twitch Trigger",
			color: "#5A3E85",
		},
		inputs: [],
		outputs: ["main"],
		credentials: [
			{
				name: "twitchApi",
				required: true,
				testedBy: "testTwitchAuth",
			},
		],
		webhooks: [
			{
				name: "default",
				httpMethod: "POST",
				responseMode: "onReceived",
				path: "webhook",
			},
		],
		properties: [
			{
				displayName: "Event",
				name: "event",
				type: "options",
				required: true,
				default: "stream.online",
				options: [
					{
						name: "Channel Follow",
						value: "channel.follow",
					},
					{
						name: "Channel Raid",
						value: "channel.raid",
					},
					{
						name: "Channel Update",
						value: "channel.update",
					},
					{
						name: "Stream Offline",
						value: "stream.offline",
					},
					{
						name: "Stream Online",
						value: "stream.online",
					},
				],
			},
			{
				displayName: "Channel",
				name: "channel_name",
				type: "string",
				required: true,
				default: "",
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData("node");
				const webhookUrl = this.getNodeWebhookUrl("default");
				const event = this.getNodeParameter("event") as string;
				const { data: webhooks } = await twitchApiRequest.call(
					this,
					"GET",
					"/eventsub/subscriptions"
				);
				console.log(webhooks);
				for (const webhook of webhooks) {
					if (
						webhook.transport.callback === webhookUrl &&
						webhook.type === event
					) {
						webhookData.webhookId = webhook.id;
						return true;
					}
				}
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl("default");
				const webhookData = this.getWorkflowStaticData("node");
				const event = this.getNodeParameter("event");
				const channel = this.getNodeParameter("channel_name") as string;
				const userData = await twitchApiRequest.call(
					this,
					"GET",
					"/users",
					{},
					{ login: channel }
				);

				console.log(userData);

				if (userData.data.length === 0 || !userData.data[0].id) {
					throw new Error("Channel not found");
				}

				const body = {
					type: event,
					version: "1",
					condition: {
						broadcaster_user_id: userData.data[0].id,
					},
					transport: {
						method: "webhook",
						callback: webhookUrl,
						secret: "n8ncreatedSecret",
					},
				};
				const webhook = await twitchApiRequest.call(
					this,
					"POST",
					"/eventsub/subscriptions",
					body
				);
				console.log(webhook);

				webhookData.webhookId = webhook.data[0].id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData("node");
				console.log("delete webhook", webhookData.webhookId);
				try {
					await twitchApiRequest.call(
						this,
						"DELETE",
						"/eventsub/subscriptions",
						{},
						{ id: webhookData.webhookId }
					);
				} catch (error) {
					return false;
				}
				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const res = this.getResponseObject();
		const req = this.getRequestObject();
		console.log("webhook data");
		console.dir(bodyData);

		// Check if we're getting twitch challenge request to validate the webhook that has been created.
		if (bodyData["challenge"]) {
			res.status(200).send(bodyData["challenge"]).end();
			return {
				noWebhookResponse: true,
			};
		}

		return {
			workflowData: [this.helpers.returnJsonArray(req.body)],
		};
	}
}
