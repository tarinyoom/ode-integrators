import testData from "./testData.json";

const BACKEND_ENDPOINT = "https://yhztmrh2ot3j5bsnzmo42zq2ja0apemx.lambda-url.us-west-1.on.aws/";
const ONLINE = true;

export async function calculate(req: IVPRequest): Promise<IVPResponse> {

	console.log(`sending: ${JSON.stringify(req)}`);

	if (ONLINE) {
		return fetch(BACKEND_ENDPOINT, {
			body: JSON.stringify(req),
			headers: {
				"Access-Control-Request-Headers": "*"
				},
			method: "post",
		}).then(async (response) => {
			return (await response.json()).data;
		});	
	} else {
		return testData;
	}
}
