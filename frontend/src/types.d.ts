type Point = {
	x: number,
	y: number
}

type IVP = {
	gradient: string,
	initialCondition: Point,
	timeStep: number,
	numSteps: number,
}
