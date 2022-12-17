import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { BaseType } from 'd3';
import { Paper } from '@mui/material';
import data from './testData.json';

const Graph = () => {

	const margin = {top: 20, right: 20, bottom: 30, left: 50};
	const ref = useRef<any>();

	function render() {
		const svg = d3.select<BaseType, any>(ref.current)

		svg.selectAll('*').remove();
	
		// Kind of hacky, is there a better way to do this?
		const width = parseInt(svg.style("width")) - margin.left - margin.right;
		const height = parseInt(svg.style("height")) - margin.top - margin.bottom;
	
		// Add X axis
		var xScale = d3
			.scaleLinear()
			.domain([0, 4000])
			.range([0, width]);
	
		var yScale = d3
			.scaleLinear()
			.domain([0, 4000])
			.range([height, 0])
		
		svg.append("g")
			.attr("transform", `translate(${margin.left}, ${height + margin.top})`)
			.call(d3.axisBottom(xScale));
	
		svg.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`)
			.call(d3.axisLeft(yScale));

		const transformedData: [number, number][] = data.map(
			d => [margin.left + xScale(d.x), margin.top + yScale(d.y)]
		);

		svg.append("g")
		.selectAll("dot")
		.data<[number, number]>(transformedData)
		.enter()
		.append("circle")
			.attr("cx", d => d[0] )
			.attr("cy", d => d[1] )
			.attr("r", width / 700)
			.style("fill", "#FFFFFF")

		svg.append("path")
			.attr("fill", "none")
			.attr("stroke", "#FFFFFF")
			.attr("stroke-width", width / 2000)
			.attr("d", d3.line()(
				transformedData
				))


	}

	window.addEventListener("resize", render)

	useEffect(() => {
		render();
	})

	return (
		<Paper elevation={4} sx={{"height": "100%", "width": "100%"}}>
			<svg
				ref={ref}
				width="100%"
				height="100%"
			/>
		</Paper>
	)
  }

export default Graph;