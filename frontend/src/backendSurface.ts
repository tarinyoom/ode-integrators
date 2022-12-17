
export async function calculate(req: IVPRequest): Promise<IVPResponse> {
	return [
		{x: 0, y: 0.5},
		{x: -1, y: 1.3},
		{x: -2, y: 1.2},
		{x: -2.2, y: 0.5},
		{x: 0, y:-2},
		{x: 2.2, y: 0.5},
		{x: 2, y: 1.3},
		{x: 1, y: 1.2},
		{x:0, y: 0.5}
	]
}
