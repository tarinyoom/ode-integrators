type Point = number[];
type PointState = {
	x: Point,
	v: Point
}
type Method = "Forward Euler" | "RK4";

type IVP = {
	id: string,
	x0: Point,
	v0: Point,
	h: number,
	n: number,
	method: string,
	color: string
}

type PartialIVP = {
	id: string,
	x0: string,
	v0: string,
	h: string,
	n: string,
	method: string,
	color: string
}

type IntegratorRequest = {
	x0: Point,
	v0: Point,
	h: number,
	n: number,
	field: string,
	method: string
}

type IntegratorResponse = {
	trajectory: PointState[]
}

type IVPSolution = {
	id: string,
	trajectory: PointState[],
	h: number,
	n: number,
	method: string,
	color: string
}
