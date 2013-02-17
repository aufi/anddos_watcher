$(document).ready(function(){
	
	// Creates canvas 320 × 200 at 10, 50
	var paper = Raphael('status_title', 20, 20);
	// Creates circle at x = 50, y = 40, with radius 10
	var circle = paper.circle(10, 12, 8);
	// Sets the fill attribute of the circle to red (#f00)
	circle.attr("fill", "yellow");
	// Sets the stroke attribute of the circle to white
	circle.attr("stroke", "#fff");
	
	
	var values = [], labels = [];
	$("table.global_state th").each(function () {
	    labels.push($(this).text());
	});
	$("table.global_state td").each(function () {
	    values.push(parseInt($(this).text(), 10));
	});
	Raphael("chart_overview", 450, 450).pieChart(200, 200, 150, values, labels, "#fff");
	
	
	/* refacctor table alg */
	$('table.clients_state tr:not(:first)').each(function(){
		values = [], labels = [];
		$("th", $(this).parent()[0]).each(function () {
		    labels.push($(this).text());
		});
		$("td:not(:last):not(:first)", this).each(function () {
		    values.push(parseInt($(this).text(), 10));
		});
		console.log(values);
		console.log(labels);
		Raphael($('div.chart_client', this)[0], 50, 50).pieChart(20, 20, 15, values, labels, "#fff");
	});
	
	
});

Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    var angle = 0,
        total = 0,
        start = 0,
        process = function (j) {
            var value = values[j],
                angleplus = 360 * value / total,
                popangle = angle + (angleplus / 2),
                color = Raphael.hsb(start, .75, 1),
                ms = 500,
                delta = 30,
                bcolor = Raphael.hsb(start, 1, 1),
                p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 3}),
                txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 20});
            p.mouseover(function () {
                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
                txt.stop().animate({opacity: 1}, ms, "elastic");
            }).mouseout(function () {
                p.stop().animate({transform: ""}, ms, "elastic");
                txt.stop().animate({opacity: 0}, ms);
            });
            angle += angleplus;
            chart.push(p);
            chart.push(txt);
            start += .1;
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};