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
	x0: Point | null,
	v0: Point | null,
	h: number | null,
	n: number | null,
	method: string,
	color: string | null
}

type IntegratorRequest = {
	x0: Point,
	v0: Point,
	h: number,
	n: number,
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
