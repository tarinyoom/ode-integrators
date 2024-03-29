import { random, randomInt, cos, sin, unit } from "mathjs";

const SUP_COMPONENT_VAL = 256;
const INF_COMPONENT_VAL = 32;
const SUP_COLOR_VAL = 16777216;

let nextId = 0;
export function getUniqueId() {
  return (nextId++).toString();
}

let nextSolnId = 0;
export function getUniqueSolnId() {
	return (nextSolnId++).toString();
}

export function weakHash(val: string, i: number, mod: number) {
	// const hash = Array.from(val).reduce((acc, curr) => (acc + 7 * curr.charCodeAt(0)) % 11, 23);
	const hash = i;
	
	return hash % mod;
}

export function getRandomDirection(min: number, max: number) {
	const degrees = random(min, max);
	const x = (cos(unit(degrees, 'deg'))).toString().substring(0, 6);
	const y = (sin(unit(degrees, 'deg'))).toString().substring(0, 6);
	return `(${x}, ${y})`;
}

export function getRandomStartPosition(min: number, max: number) {
	const x = random(min, max).toString().substring(0, 6);
	return `(${x}, 0)`;
}

export function getRandomColor() {
	const components = ["","",""].map((_) => randomInt(INF_COMPONENT_VAL, SUP_COMPONENT_VAL).toString(16).padStart(2, "0"));
	return `#${components.join('')}`;
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
    return val > 0 && val <= 65000 ? val : null;
}

export function parseMethod(s: string | null) : Method | "" {
	if (s === "Forward Euler" || s === "Backward Euler" || s === "RK4") {
		return s;
	} else {
		return "";
	}
}

export function parseColor(s: string) : string | null {
	if (s.length > 0 && s[0] === "#") {
		const suffix = s.substring(1);
		const val = parseInt(suffix, 16);
		if (!Number.isNaN(val) && val < SUP_COLOR_VAL) { 
			return s;
		} else {
			return null;
		}
	} else {
		return null;
	}
}
