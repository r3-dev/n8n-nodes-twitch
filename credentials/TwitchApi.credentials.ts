import {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
	NodePropertyTypes,
} from "n8n-workflow";

interface IAccessToken {
	access_token: string;
	expires_in: number;
	token_type: string;
}

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

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions
	): Promise<IHttpRequestOptions> {
		const client_id = credentials.clientId as string;
		const client_secret = credentials.clientSecret as string;

		const params: URLSearchParams = new URLSearchParams({
			client_id: client_id,
			client_secret: client_secret,
			grant_type: "client_credentials",
		});

		const optionsForAppToken: RequestInit = {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method: "POST",
			body: params,
		};

		const appTokenResponse = await fetch(
			"https://id.twitch.tv/oauth2/token",
			optionsForAppToken
		);

		if (!appTokenResponse.ok) {
			throw new Error(
				`Twitch API App Token error response [${appTokenResponse.status}]: ${
					appTokenResponse.statusText
				} : ${await appTokenResponse.text()}`
			);
		}

		const json = (await appTokenResponse.json()) as IAccessToken;
		const access_token = json.access_token;

		requestOptions.headers = {
			...requestOptions.headers,
			"Content-Type": "application/json",
			"Client-Id": credentials.clientId,
			Authorization: "Bearer " + access_token,
		};

		return requestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			baseURL: "https://id.twitch.tv",
			url: "/oauth2/validate",
			method: "GET",
		},
	};
}
