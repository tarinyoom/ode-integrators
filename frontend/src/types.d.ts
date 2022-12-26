type Point = number[];

type PointState = {
	x: Point,
	v: Point
}

type IVPRequest = {
	init: PointState,
	h: number,
	n: number,
}

type IVPResult = {
	trajectory: PointState[],
	h: number
}
