type Point = number[];
type Method = "Forward Euler" | "Backward Euler" | "RK4";

type IVP = {
	id: string,
	x0: Point,
	v0: Point,
	h: number,
	n: number,
	method: string,
	color: string
}

type IntegratorRequest = {
	x0: Point,
	v0: Point,
	h: number,
	n: number,
	method: string
}

type IntegratorResponse = {
	trajectory: {
		x: Point,
		v: Point
	}[]
}

type IVPSolution = {
	id: string,
	trajectory: PointState[],
	h: number,
	n: number,
	method: string,
	color: string
}
