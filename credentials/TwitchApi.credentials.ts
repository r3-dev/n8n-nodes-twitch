import {
	ICredentialType,
	INodeProperties,
	NodePropertyTypes,
} from "n8n-workflow";

export class TwitchApi implements ICredentialType {
	name = "twitchApi";
	displayName = "Twitch API";
	properties: INodeProperties[] = [
		{
			displayName: "Client ID",
			name: "clientId",
			type: "string" as NodePropertyTypes,
			default: "",
		},
		{
			displayName: "Client Secret",
			name: "clientSecret",
			type: "string" as NodePropertyTypes,
			default: "",
			typeOptions: {
				password: true,
			},
		},
	];
}
