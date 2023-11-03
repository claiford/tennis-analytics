import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import courtBackground from '../..//images/tennis-court_2696x3976.jpg';

const COLS = 27
const ROWS = 40
const GRIDSIZE = 15

const Chart = ({ selectedDiagnostic }) => {
	const heatmapRef = useRef(null);

	const generateData = () => {
		let gridObject = {}
		for (let x = 1; x <= 27; x++) {
			for (let y = 1; y <= 40; y++)
				gridObject[`${x},${y}`] = {
					pos: '',
					value: 0
				}
		}
		const coords = JSON.parse(selectedDiagnostic.xy)
		for (const xyxy of Object.values(coords)) {
			const x_front = Math.ceil(xyxy['xy_front'][0] / 100)
			const y_front = Math.ceil(xyxy['xy_front'][1] / 100)
			const x_back = Math.ceil(xyxy['xy_back'][0] / 100)
			const y_back = Math.ceil(xyxy['xy_back'][1] / 100)
			if (y_front < Math.ceil(1988 / 100)) {
				continue
			} else if (y_back > Math.ceil(1988 / 100)) {
				continue
			} else {
				if (`${x_front},${y_front}` in gridObject) {
					gridObject[`${x_front},${y_front}`].value += 1
					gridObject[`${x_front},${y_front}`].pos = "front"
				}
				if ([`${x_back},${y_back}`] in gridObject) {
					gridObject[`${x_back},${y_back}`].value -= 1
					gridObject[`${x_front},${y_front}`].pos = "back"
				}
			}
		}
		return gridObject
	}

	const color_picker = (d) => {
		
	}

	// function generateFakeCommitData() {
	// 	var commitsPerDate = [];
	// 	for (let month = 0; month < 12; month++) {
	// 		// Get the number of days in the current month
	// 		const numberOfDays = new Date(2023, month + 1, 0).getDate();

	// 		// Loop through each day of the current month
	// 		for (let day = 1; day <= numberOfDays; day++) {
	// 			// Create a new Date object for the current day
	// 			const currentDate = new Date(2023, month, day, 5); // hack: added 5 hours to avoid midnight

	// 			// Add a new object to the array
	// 			commitsPerDate.push({
	// 				date: currentDate.toJSON().substring(0, 10),
	// 				count: Math.floor(Math.random() * 100)
	// 			});
	// 		}
	// 	}
	// 	// console.log(commitsPerDate)
	// 	return commitsPerDate
	// }

	useEffect(() => {
		const gridObject = generateData()

		const values = []
		for (const grid of Object.entries(gridObject)) {
			values.push({
				x: grid[0].split(",")[0],
				y: grid[0].split(",")[1],
				data: grid[1].value,
				position: grid[1].pos
			})
		}

		// first, initialize the variables that are independent of the data
		const cols = COLS
		const rows = ROWS
		const gridSize = GRIDSIZE
		const margin = { top: 30, right: 0, bottom: 30, left: 0 }
		const width = cols * gridSize
		const height = rows * gridSize
		var legendElementWidth = gridSize * 3
		var colors_front = ["#EBEDF0", "#C6E48B", "#7BC96F", "#239A3B", "#196127"];
		var colors_back = ["#EBEDF0", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"];
		var colors_divergent = ["#bdebbf", "#EBEDF0", "#97ddec"]
		
		var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

		d3.selectAll(".chart").remove()
		var svg = d3.select(heatmapRef.current).append("svg") // attach chart to the DOM and center it within an svg element based on margins
			.attr("class", "chart")
			.attr("width", width)
			.attr("height", height)
			.append("g") // an svg "group", similar to an html "div"
		// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var colorScale_front = d3.scaleOrdinal() // map array of values to array of colors
			.domain([0, 100]) // move this inside of data callback and change this to newValues if you use option code to generate domain from the data
			.range(colors_front);
		var colorScale_back = d3.scaleLinear() // map array of values to array of colors
			.domain([0, 5]) // move this inside of data callback and change this to newValues if you use option code to generate domain from the data
			.range(colors_back);
		var colorScale_divergent = d3.scaleDiverging() // map array of values to array of colors
			.domain([-5, 0, 5]) // move this inside of data callback and change this to newValues if you use option code to generate domain from the data
			.range(colors_divergent);

		// svg.selectAll(".day") // add day labels
		// 	.data(days)
		// 	.enter().append("text")
		// 	.text(function (d) { return d; })
		// 	.attr("x", 0)
		// 	.attr("y", function (d, i) { return i * gridSize; })
		// 	.style("text-anchor", "end")
		// 	.attr("transform", "translate(-6," + gridSize / 1.3 + ")")
		// 	.attr("class", "label");

		// svg.selectAll(".week") // add week labels
		// 	.data(d3.range(1, 53))
		// 	.enter().append("text")
		// 	.text(function (d) {
		// 		if (d % 5 === 0)
		// 			return months[d / 5]
		// 		else
		// 			return ""
		// 	})
		// 	.attr("x", function (d, i) { return i * gridSize; })
		// 	.attr("y", 0)
		// 	.style("text-anchor", "middle")
		// 	.attr("transform", "translate(" + gridSize / 2 + ", -6)")
		// 	.attr("class", "label");

		// var newValues = [] // optional code to generate color domain from the data
		// // make an object first
		// var valueObj = data.reduce(function (obj, key) {
		//   obj[key.type] = 0
		//   return obj
		// }, {})
		// for (key in valueObj) {
		//   newValues.push(key)
		// }
		// newValues.sort()
		// console.log(newValues);


		var heatMap = svg.selectAll(".grid") // make heatMap with data, data can be a hard coded array or an array of objects brought in through another file
			.data(values) // play with this, but later change this it to the data that is passed in on line 24
			.enter()
			.append("rect")
			.attr("width", gridSize)
			.attr("height", gridSize)
			.attr("x", function (d) { return (d.x - 1) * gridSize; })
			.attr("y", function (d) { return (d.y - 1) * gridSize; })
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("class", "bordered")
			.style("fill", function (d) { return colorScale_divergent(d.data); }) // use this line if you are not using the transition() to a new color

		// heatMap.transition().duration(1000) // example d3 animation
		// 	.style("fill", function (d) { return colorScale(d.data); })


		// heatMap.append("title") // append and format title element
		//   .text(function (d) {
		//     var title = d.type + ' ' + d.date
		//     return title;
		//   });

		// var legend = svg.selectAll(".legend") // create legend, legend data is the color domain
		// 	.data(colors, function (d) { return d; }) // d is each element in the data
		// 	.enter().append("g")
		// 	.attr("class", "legend");

		// legend.append("rect") // define legend rectangles
		// 	.attr("x", function (d, i) { return legendElementWidth * i; })
		// 	.attr("y", gridSize * 8)
		// 	.attr("width", legendElementWidth)
		// 	.attr("height", gridSize)
		// 	.attr("class", "bordered")
		// 	.attr("rx", 4)
		// 	.attr("ry", 4)
		// 	.style("fill", function (d, i) {
		// 		return d;
		// 	}) // map color domain array (d) to color range array



		// legend.append("text") // add legend text labels to same coordinates as legend rectangles, center
		// 	.text(function (d) { return d; })
		// 	.attr("x", function (d, i) { return (legendElementWidth * i) + legendElementWidth / 2; })
		// 	.attr("y", (gridSize * 8) + (gridSize / 1.4))
		// 	.attr("class", "label")
		// 	.style("text-anchor", "middle");

	}, [selectedDiagnostic]);

	return (
		<div className="flex justify-center relative mt-9">
			<div className="w-full flex justify-center" id="Chart" ref={heatmapRef}></div>
			<img className="absolute top-0 opacity-20" src={courtBackground} width={GRIDSIZE * COLS}></img>
		</div>
	)
};

export default Chart;