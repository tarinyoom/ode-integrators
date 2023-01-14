import testData from "./testData.json";

const BACKEND_ENDPOINT = "https://yhztmrh2ot3j5bsnzmo42zq2ja0apemx.lambda-url.us-west-1.on.aws/";
const ONLINE = true;

export async function solveAll(problems: IVP[], field: string): Promise<IVPSolution[]> {

	return Promise.all(problems.map(async ivp => {

		const response : IntegratorResponse = await integrate({
			x0: ivp.x0,
			v0: ivp.v0,
			h: ivp.h,
			n: ivp.n,
			field: field,
			method: ivp.method
		});

		return {
			id: ivp.id,
			trajectory: response.trajectory,
			h: ivp.h,
			n: ivp.n,
			field: field,
			method: ivp.method,
			color: ivp.color
		};
	}));
}

async function integrate(req: IntegratorRequest): Promise<IntegratorResponse> {

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
