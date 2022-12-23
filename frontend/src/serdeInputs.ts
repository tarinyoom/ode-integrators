export function parsePoint2D(s: string) : Point | null {
	const point = parsePoint(s);
	if (point === null || point.length !== 2) {
		return null;
	} else {
		return point;
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

export function stringifyPoint(p: Point | null) : string | null {
	if (p === null) {
		return null;
	} else {
		return `(${p.join(", ")})`;
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
