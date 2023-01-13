import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { BaseType } from 'd3';
import { Button, Box } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import ReplayIcon from '@mui/icons-material/Replay';

const MARGIN = {top: 20, right: 20, bottom: 30, left: 50};
const DATA_MARGIN = 1.3; // margin around data points within graph

const Graph = ({data, field}:
	{data: IVPSolution[] | undefined, field: string}) => {

	const ref = useRef<any>();

	const [refresh, setRefresh] = useState<boolean>();

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
		svg.append("rect")
		.attr("fill", "0x000000")
		.attr("width", width)
		.attr("height", height);

		const dressing = svg.append("g");
	
		if (data !== undefined && data.length > 0) {
			const cover = data.reduce<PointState[]>((acc, curr) => acc.concat(curr.trajectory), []);

			// calculate domains to show all data points nicely
			const extents = [
				d3.extent(cover.map(d => d.x[0])), 
				d3.extent(cover.map(d => d.x[1]))
			] as [number, number][];

			const scale  = extents
				.map((e: [number, number], i: number) => (e[1] - e[0]) / graphDims[i])
				.reduce((p: number, c: number) => Math.max(p, c));
			const ranges  = graphDims.map(dim => dim * scale).map(n => n / 2);
			const medians = extents.map(e => e[1] + e[0]).map(n => n / 2);
			const domains = medians.map(
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
					.attr("r", "3px")
					.attr("fill", "#FFFFFF");
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
					return [MARGIN.left + xScale(point.x[0]), MARGIN.top + yScale(point.x[1])];
				}

				let shownPoints = [transformPoint(result.trajectory[0])];

				const path = svg.append("path")
				.attr("fill", "none")
				.attr("stroke", result.color)
				.attr("stroke-width", "0.3px")
				.attr("d", d3.line()(shownPoints));

				const pt = svg.append("circle")
					.attr("cx", MARGIN.left + xScale(result.trajectory[animationStep[i]].x[0]))
					.attr("cy", MARGIN.top + yScale(result.trajectory[animationStep[i]].x[1]))
					.attr("r", "1px")
					.attr("fill", result.color)

				async function animate() {

					shownPoints.push(transformPoint(result.trajectory[animationStep[i]]));
					path.attr("d", d3.line()(shownPoints));

					if (animationStep[i] >= result.trajectory.length) {
						return;
					} else {
						pt.transition()
							.duration(1000 * result.h)
							.attr("cx", MARGIN.left + xScale(result.trajectory[animationStep[i]].x[0]))
							.attr("cy", MARGIN.top + yScale(result.trajectory[animationStep[i]].x[1]))
							.on("end", () => {
								animationStep[i]++;
								animate();
							});
					}
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
			<Box sx={{"position": "relative", "top": "-100%", "display":"grid", "justifyItems": "end"}}>
			<Tooltip title="Replay" placement="left">
				<Button onClick={() => {
					setRefresh(!refresh);}}>
					<ReplayIcon />
				</Button>
			</Tooltip>
			</Box>
		</>
	)
  }

export default Graph;