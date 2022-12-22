type Point = {
	x: number,
	y: number
}

type IVPRequest = {
	//gradient: MathNode,
	//initialCondition: Point,
	timeStep: number,
	numSteps: number,
}

type IVPResponse = Point[]
