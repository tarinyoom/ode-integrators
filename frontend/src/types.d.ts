type Point = number[];

type PointState = {
	x: Point,
	v: Point
}

type IVPRequest = {
	init: PointState[],
	h: number,
	n: number,
}

type IVPResponse = PointState[]
