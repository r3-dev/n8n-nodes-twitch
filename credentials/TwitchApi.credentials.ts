import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	NodePropertyTypes,
} from "n8n-workflow";

export class TwitchApi implements ICredentialType {
	name = "twitchApi";
	displayName = "Twitch API";
	default = "https://id.twitch.tv/oauth2/token";
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
	authenticate: IAuthenticateGeneric = {
		type: "generic",
		properties: {
			// Can be body, header, or qs
			headers: {
				"Content-Type": "application/json",
			},
			qs: {
				client_id: "={{$credentials.clientId}}",
				client_secret: "={{$credentials.clientSecret}}",
				grant_type: "client_credentials",
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: "https://id.twitch.tv",
			url: "/oauth2/token",
			method: "POST",
		},
	};
}
