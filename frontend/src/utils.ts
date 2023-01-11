const MAX_COLOR_VAL = 16777216;

let nextId = 0;
export function getUniqueId() {
  return (nextId++).toString();
}

/*
 * Serialization here
 */

export function stringifyPoint(s: Point | null): string {
	if (s === null) {
		return "";
	} else {
		return `(${s.join(", ")})`;
	}
}

export function parsePoint2D(s: string) : Point | null {
	const point = parsePoint(s);
	if (point === null || point.length !== 2) {
		return null;
	} else {
		return point;
	}
}

export function parsePoint(s: string) : Point | null {

	if (s.length > 0 && s[0] === "(" && s[s.length - 1] === ")") {
		s = s.substring(1, s.length - 1);
	}

	const components = s.split(",").map((fragment: string) => {
		return parseFloat(fragment.trim());
	});

	if (components.includes(NaN)) {
		return null;
	} else {
		return components;
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

export function parseMethod(s: string | null) : Method | "" {
	if (s === "Forward Euler" || s === "RK4") {
		return s;
	} else {
		return "";
	}
}

export function parseColor(s: string) : string | null {
	if (s.length > 0 && s[0] === "#") {
		const suffix = s.substring(1);
		const val = parseInt(suffix, 16);
		if (!Number.isNaN(val) && val < MAX_COLOR_VAL) { 
			return s;
		} else {
			return null;
		}
	} else {
		return null;
	}
}
