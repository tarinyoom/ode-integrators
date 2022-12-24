export function parsePoint2D(s: string) : Point | null {
	const point = parsePoint(s);
	if (point === null || point.length !== 2) {
		return null;
	} else {
		return point;
	}
}

export function parsePoints4D(s: string): PointState[] | null {
	const points = s.split(";")
		.map((fragment: string) => parsePoint(fragment.trim()));

	if (points.includes(null)) {
		return null;
	} else {
		return (points as Point[]).map((p: Point) => {
			return {x: [p[0], p[1]], v: [p[2], p[3]]};
		})
	}
}

function parsePoint(s: string) : Point | null {
	if (s.length === 0 || s[0] !== "(" || s[s.length - 1] !== ")") {
		return null;
	} else {
		const components = s.substring(1, s.length - 1).split(",").map((fragment: string) => {
			return parseFloat(fragment.trim());
		});

		if (components.includes(NaN)) {
			return null;
		} else {
			return components;
		}
	}
}

export function stringifyPoints(ps: PointState[] | null) : string | null {
	if (ps === null) {
		return null;
	} else {
		return ps.map((p) => `(${p.x[0]}, ${p.x[1]}, ${p.v[0]}, ${p.v[1]})`).join(";");
	}
}

export function parseH(s: string) : number | null {
    const val = parseFloat(s);
    return val ? val : null;
}

export function parseN(s: string) : number | null {
    const val = parseInt(s);
    return val > 0 ? val : null;
}
