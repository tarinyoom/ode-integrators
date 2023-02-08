import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { BaseType } from 'd3';
import * as Tone from 'tone';
import { dot, sqrt } from 'mathjs';
import { getUniqueSolnId } from "./utils";
import { weakHash } from './utils';

const MARGIN = {top: 5, right: 5, bottom: 20, left: 25};
const DATA_MARGIN = 1; 
const LIGHT = [82.41, 110, 138.59, 164.81, 220, 277.18];
const DARK = [87.31, 110, 146.83, 174.61, 220, 293.66];
const REFERENCE_FREQ = 110;
const SKIP = 2;
const extents = [
	[-1.8, 1.8], [-1.8, 1.8]
] as [number, number][];
let active: string[] = [];
let relativeFreqs: number[] = [];

const Graph = ({data, field}:
	{data: IVPSolution[] | undefined, field: string}) => {

	const synths: Tone.Synth<Tone.SynthOptions>[] = data === undefined? [] : data.map(_ => new Tone.Synth().toDestination());
	synths.forEach((synth) => {
		synth.volume.value = Number.MIN_SAFE_INTEGER;
	})

	data?.forEach((soln) => {
		soln.id = getUniqueSolnId();
	})
	
	active = data === undefined ? [] : data.map((value) => value.id);
	relativeFreqs = data === undefined ? [] : data.map(_ => REFERENCE_FREQ);
	const ref = useRef<any>();

	let animationStep = data === undefined ? [] : data.map(_ => 0);
	let rendered = false;

	function render() {

		if (rendered) {
			return;
		}

		rendered = true;

		const svg = d3.select<BaseType, any>(ref.current)

		svg.selectAll('*').remove();

		// Kind of hacky, is there a better way to find width/height of the image?
		const width = parseInt(svg.style("width"));
		const height = parseInt(svg.style("height"));
		const graphDims = [width - MARGIN.left - MARGIN.right, height - MARGIN.top - MARGIN.bottom];
		const background = svg.append("rect")
		.attr("fill", "0x000000")
		.attr("width", width)
		.attr("height", height);

		const dressing = svg.append("g");
	
		if (data !== undefined && data.length > 0) {

			const scale  = extents
				.map((e: [number, number], i: number) => (e[1] - e[0]) / graphDims[i])
				.reduce((p: number, c: number) => Math.max(p, c));
			const ranges: number[]  = graphDims.map(dim => dim * scale).map(n => n / 2);
			const medians: number[] = extents.map(e => e[1] + e[0]).map(n => n / 2);
			const domains: number[][] = medians.map(
				(median, i) => [-1, 1].map(s => median + s * ranges[i] * DATA_MARGIN)
				)
		
			// Add X axis
			var xScale = d3
				.scaleLinear()
				.domain(domains[0])
				.range([0, graphDims[0]]);
		
			var yScale = d3
				.scaleLinear()
				.domain(domains[1])
				.range([graphDims[1], 0])

			switch (field) {
				case "single_attractor":
					dressing.append("circle")
					.attr("cx", MARGIN.left + xScale(0))
					.attr("cy", MARGIN.top + yScale(0))
					.attr("r", "5px")
					.attr("fill", "#FFFFFF");
					break;
				case "single_repulsor":
					
					background.attr("fill", "#0F0F0F");

					svg.append("circle")
						.attr("cx", MARGIN.left + xScale(0))
						.attr("cy", MARGIN.top + yScale(0))
						.attr("r", xScale(3) - xScale(0))
						.attr("fill", "#000000");

					svg.append("circle")
						.attr("cx", MARGIN.left + xScale(0))
						.attr("cy", MARGIN.top + yScale(0))
						.attr("r", "5px")
						.attr("fill", "#FF0000");
					break;
				default:
					break;
			}
			
			svg.append("g")
				.attr("transform", `translate(${MARGIN.left}, ${graphDims[1] + MARGIN.top})`)
				.call(d3.axisBottom(xScale));
		
			svg.append("g")
				.attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
				.call(d3.axisLeft(yScale));

			data.forEach((result: IVPSolution, i: number) => {

				function transformPoint(point: PointState): [number, number] {
					const exact = [MARGIN.left + xScale(point.x[0]), MARGIN.top + yScale(point.x[1])];
					const approx: [number, number] = [Math.round(exact[0] * 100) / 100, Math.round(exact[1] * 100) / 100]
					return approx;
				}

				//let shownPoints = result.trajectory.map(transformPoint); 
				let shownPoints = [transformPoint(result.trajectory[0])];

				const path = svg.append("path")
				.attr("fill", "none")
				.attr("stroke", result.color)
				.attr("stroke-width", "0.5px")
				.attr("d", d3.line()(shownPoints));

				const pt = svg.append("circle")
					.attr("cx", MARGIN.left + xScale(result.trajectory[animationStep[i]].x[0]))
					.attr("cy", MARGIN.top + yScale(result.trajectory[animationStep[i]].x[1]))
					.attr("r", "1.5px")
					.attr("fill", result.color)

				async function animate() {

					if (!active.includes(result.id) || animationStep[i] >= result.trajectory.length) {
						synths[i].triggerRelease();
						synths[i].disconnect();
						synths[i].dispose();
						pt.remove();
						return;

					} else {

						const point = result.trajectory[animationStep[i]];
						switch (result.field) {
							case "single_attractor":
								console.log(`relative freqs is ${relativeFreqs[i]}`)
								synths[i].volume.value = (-2 - 9 * dot(point.x, point.x)) / SKIP * relativeFreqs[i];
								break;
							case "single_repulsor":
								synths[i].volume.value = (-5 - 7 * (sqrt(dot(point.x, point.x)) as number)) / SKIP * relativeFreqs[i];
								break;
						}
	
						shownPoints.push(transformPoint(point));
						path.attr("d", d3.line()(shownPoints));
						pt.transition()
							.duration(1000 * result.h)
							.attr("cx", MARGIN.left + xScale(result.trajectory[animationStep[i]].x[0]))
							.attr("cy", MARGIN.top + yScale(result.trajectory[animationStep[i]].x[1]))
							.on("end", () => {
								animationStep[i] += SKIP;
								animate();
							});
					}
				}

				switch (result.field) {
					case "single_attractor":
						relativeFreqs[i] = DARK[weakHash(result.color, i, DARK.length)] / REFERENCE_FREQ
						synths[i].triggerAttack(relativeFreqs[i] * REFERENCE_FREQ);
						break;
					case "single_repulsor":
						relativeFreqs[i] = LIGHT[weakHash(result.color, i, LIGHT.length)] / REFERENCE_FREQ;
						synths[i].triggerAttack(relativeFreqs[i] * REFERENCE_FREQ);
						break;
					default:
						break;
				}

				animate();
				})
		}
	}

	window.addEventListener("resize", render)

	useEffect(() => {
		render();
	})

	return (
		<>
			<svg
				ref={ref}
				width="100%"
				height="100%"
			/>
		</>
	)
  }

export default Graph;