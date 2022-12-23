import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { BaseType } from 'd3';

const MARGIN = {top: 20, right: 20, bottom: 30, left: 50};
const DATA_MARGIN = 1.3; // margin around data points within graph

const Graph = ({data}:{data: PointState[] | undefined}) => {

	const ref = useRef<any>();

	function render() {
		const svg = d3.select<BaseType, any>(ref.current)

		svg.selectAll('*').remove();
	
		if (data !== undefined && data.length > 0) {
			// Kind of hacky, is there a better way to find width/height of the image?
			const width = parseInt(svg.style("width"));
			const height = parseInt(svg.style("height"));
			const graphDims = [width - MARGIN.left - MARGIN.right, height - MARGIN.top - MARGIN.bottom];

			svg.append("rect")
				.attr("fill", "0x000000")
				.attr("width", width)
				.attr("height", height);

			// calculate domains to show all data points nicely
			const extents = [d3.extent(data.map((d: PointState) => d.x[0])), d3.extent(data.map((d: PointState) => d.x[1]))] as [number, number][];
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
			
			svg.append("g")
				.attr("transform", `translate(${MARGIN.left}, ${graphDims[1] + MARGIN.top})`)
				.call(d3.axisBottom(xScale));
		
			svg.append("g")
				.attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
				.call(d3.axisLeft(yScale));

			const transformedData: [number, number][] = data.map(
				d => [MARGIN.left + xScale(d.x[0]), MARGIN.top + yScale(d.x[1])]
			);

			svg.append("g")
			.selectAll("dot")
			.data<[number, number]>(transformedData)
			.enter()
			.append("circle")
				.attr("cx", d => d[0] )
				.attr("cy", d => d[1] )
				.attr("r", "1px")
				.style("fill", "#FFFFFF")

			svg.append("path")
				.attr("fill", "none")
				.attr("stroke", "#FFFFFF")
				.attr("stroke-width", "0.2px")
				.attr("d", d3.line()(
					transformedData
					))
		}

	}

	window.addEventListener("resize", render)

	useEffect(() => {
		render();
	})

	return (
		<svg
			ref={ref}
			width="100%"
			height="100%"
		/>
	)
  }

export default Graph;