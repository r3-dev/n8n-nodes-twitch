import { IDataObject, IAllExecuteFunctions } from "n8n-workflow";
import { OptionsWithUri } from "request-promise-native";

export async function twitchApiRequest(
	this: IAllExecuteFunctions,
	method: string,
	resource: string,
	body: any = {},
	query: IDataObject = {},
	uri?: string,
	option: IDataObject = {}
): Promise<any> {
	const endpoint = "https://api.twitch.tv/helix";
	const options: OptionsWithUri = {
		headers: {
			"Content-Type": "application/json",
		},
		method,
		body,
		qs: query,
		uri: uri || `${endpoint}${resource}`,
		json: true,
	};
	if (!Object.keys(body).length) {
		delete options.body;
	}
	if (!Object.keys(query).length) {
		delete options.qs;
	}

	try {
		return await this.helpers.requestWithAuthentication.call(
			this,
			"twitchApi",
			options
		);
	} catch (errorObject: any) {
		if (errorObject.error) {
			const errorMessage = errorObject.error.message;
			throw new Error(
				`Twitch API error response [${errorObject.error.status}]: ${errorMessage}`
			);
		}
		throw errorObject;
	}
}
