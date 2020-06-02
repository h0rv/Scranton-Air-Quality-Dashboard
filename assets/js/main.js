var requestUrl = 'https://api.weatherbit.io/v2.0/history/airquality?lat=41.4090&lon=-75.6624&key=eb2a6d93c1cc44e2bf4dcd8f4ac81a9c';
var currentRequestUrl = 'https://api.weatherbit.io/v2.0/current/airquality?lat=41.4090&lon=-75.6624&key=eb2a6d93c1cc44e2bf4dcd8f4ac81a9c'
var time_labels;
var aqi;
var pm10;
var pm25;
var co;
var o3;
var so2;
var no2;

(function ($) {

	// Breakpoints.
	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});

	$(function () {

		var $window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
		$body.addClass('is-loading');

		$window.on('load', function () {
			window.setTimeout(function () {
				$body.removeClass('is-loading');
			}, 100);
		});

		// Prioritize "important" elements on medium.
		skel.on('+medium -medium', function () {
			$.prioritize(
				'.important\\28 medium\\29',
				skel.breakpoint('medium').active
			);
		});

		// Off-Canvas Navigation.

		// Navigation Panel.
		$(
			'<div id="navPanel">' +
			$('#nav').html() +
			'<a href="#navPanel" class="close"></a>' +
			'</div>'
		)
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'left'
			});

		// Fix: Remove transitions on WP<10 (poor/buggy performance).
		if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
			$('#navPanel')
				.css('transition', 'none');
	});

	$(document).ready(function () {
		time_labels = [];
		aqi = [];
		pm10 = [];
		pm25 = [];
		co = [];
		o3 = [];
		so2 = [];
		no2 = [];
		$.getJSON(requestUrl)
			.done((data) => {
				for (var i = data.data.length; i >= 0; i--) {
					if (data && data.data[i]) {
						var utcSeconds = 1234567890;
						var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
						d.setUTCSeconds(data.data[i].ts);
						time_labels.push(d.toLocaleString());
						aqi.push(data.data[i].aqi);
						co.push(data.data[i].co);
						so2.push(data.data[i].so2);
						no2.push(data.data[i].no2);
						o3.push(data.data[i].o3);
						pm10.push(data.data[i].pm10);
						pm25.push(data.data[i].pm25);
					
					}
				}
				displayChart();
				var currentAQI = aqi[data.data.length - 1];
				if (currentAQI <= 50) {
					document.getElementById("currentaqi").innerHTML = "Good";
					document.getElementById("currentaqi").style.color = '#40ff00';
				}
				else if (currentAQI <= 100) {
					document.getElementById("currentaqi").innerHTML = "Moderate";
					document.getElementById("currentaqi").style.color = '#ffff00';
				}
				else if (currentAQI <= 150) {
					document.getElementById("currentaqi").innerHTML = "Unhealthy";
					document.getElementById("currentaqi").style.color = '#ff8000';
				}
				else {
					document.getElementById("currentaqi").innerHTML = "Very Unhealthy";
					document.getElementById("currentaqi").style.color = '#ff0000';
				}
			})
			$.getJSON(currentRequestUrl)
			.done((data) => {
				if(data.data[0]){
					document.getElementById("grass-level").innerHTML = data.data[0].pollen_level_grass;
					document.getElementById("weed-level").innerHTML = data.data[0].pollen_level_weed;
					document.getElementById("tree-level").innerHTML = data.data[0].pollen_level_tree;
					document.getElementById("mold-level").innerHTML = data.data[0].mold_level;
				}
			})
	})


})
	(jQuery);

function displayChart() {
	console.log(time_labels);
	var chartRef = document.getElementById("chart").getContext("2d");
	new Chart(chartRef, {
		options: {
			scales: {
				xAxes: [{
					ticks: {
						maxTicksLimit: 10,
						maxRotation: 0,
						minRotation: 0
					}
				}]
			}
		},
		type: 'line',
		data: {
			labels: time_labels,
			datasets: [{
				data: aqi,
				label: "Air Quality Index",
				borderColor: "rgba(205, 97, 85)",
				fillColor: "rgba(205, 97, 85,0.2)",
				strokeColor: "rgba(205, 97, 85,1)",
				pointColor: "rgba(205, 97, 85,1)",
				pointHighlightStroke: "rgba(205, 97, 85,1)",
			},
			{
				data: co,
				label: "Concentration of carbon monoxide (µg/m³)",
				borderColor: "rgba(195, 155, 211)",
				fillColor: "rgba(195, 155, 211,0.2)",
				strokeColor: "rgba(195, 155, 211,1)",
				pointColor: "rgba(195, 155, 211,1)",
				pointHighlightStroke: "rgba(195, 155, 211,1)",
			},
			{
				data: so2,
				label: "Concentration of surface SO2 (µg/m³)",
				borderColor: "rgba(127, 179, 213)",
				fillColor: "rgba(127, 179, 213,0.2)",
				strokeColor: "rgba(127, 179, 213,1)",
				pointColor: "rgba(127, 179, 213,1)",
				pointHighlightStroke: "rgba(127, 179, 213,1)",
			},
			{
				data: no2,
				label: "NO2",
				borderColor: "rgba(118, 215, 196)",
				fillColor: "rgba(118, 215, 196,0.2)",
				strokeColor: "rgba(118, 215, 196,1)",
				pointColor: "rgba(118, 215, 196,1)",
				pointHighlightStroke: "rgba(118, 215, 196,1)",
			},
			{
				data: o3,
				label: "Concentration of surface O3 (µg/m³)",
				borderColor: "rgba(247, 220, 111)",
				fillColor: "rgba(247, 220, 111,0.2)",
				strokeColor: "rgba(247, 220, 111,1)",
				pointColor: "rgba(247, 220, 111,1)",
				pointHighlightStroke: "rgba(247, 220, 111,1)",
			},
			{
				data: pm10,
				label: "Concentration of particulate matter < 2.5 microns (µg/m³)",
				borderColor: "rgba(229, 152, 102)",
				fillColor: "rgba(229, 152, 102,0.2)",
				strokeColor: "rgba(229, 152, 102,1)",
				pointColor: "rgba(229, 152, 102,1)",
				pointHighlightStroke: "rgba(229, 152, 102,1)",
			},
			{
				data: pm25,
				label: "Concentration of particulate matter < 10 microns (µg/m³)",
				borderColor: "rgba(86, 101, 115)",
				fillColor: "rgba(86, 101, 115,0.2)",
				strokeColor: "rgba(86, 101, 115,1)",
				pointColor: "rgba(86, 101, 115,1)",
				pointHighlightStroke: "rgba(86, 101, 115,1)",
			},
			]
		},

	});
}
