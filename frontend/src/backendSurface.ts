import testData from "./testData.json";

const BACKEND_ENDPOINT = "https://yhztmrh2ot3j5bsnzmo42zq2ja0apemx.lambda-url.us-west-1.on.aws/";
const ONLINE = true;

export async function calculateAll(ps: PointState[], h: number, n: number): Promise<IVPResult[]> {
	const requests: IVPRequest[] = ps.map(
			(p: PointState) => {
				return {
					init: p,
					h: h,
					n: n
				};
			});
	
	return Promise.all(requests.map(calculate));
}

export async function calculate(req: IVPRequest): Promise<IVPResult> {

	console.log(`sending: ${JSON.stringify(req)}`);

	if (ONLINE) {
		return fetch(BACKEND_ENDPOINT, {
			body: JSON.stringify(req),
			headers: {
				"Access-Control-Request-Headers": "*"
				},
			method: "post",
		}).then(async (response) => {
			return await response.json();
		});	
	} else {
		return testData;
	}
}
