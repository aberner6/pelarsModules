var circle, path, text;
var linkData;
var linkNodes = []
var linkLinks;
var nodes;
var diameter = forcewidth;
var radius = diameter / 2;
var margin = 60;
function makeLinkDiagram(linkData, linkNodes, linkLinks){
    linkData = linkData;
    linkNodes = linkNodes;
    linkLinks = linkLinks;

    for(i=0; i<linkData.length; i++){
        linkData[i].parent = linkData[i].mod;
    }   
    var buttonSVG = d3.select("#linkDiagram")
        .append("svg")
        .attr("width",forcewidth*2)
        .attr("height",forceheight*2)  
        .style("margin-top","1px"); 

    var plot = buttonSVG.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + radius + ", " + (radius-39) + ")");

    var kitColor3 = buttonSVG.append("g").attr("class","backlabels")
            .append("circle")
            .attr("cx", forcewidth/3.5-6)
            .attr("cy", forceheight*2-5)
            .attr("r", 4)
            .attr("fill","lightpink")
            .attr("stroke","lightpink")
    var kitNameColor3 = buttonSVG.append("g").attr("class","backlabels")
            .append("text")
            .attr("x", forcewidth/3.5)
            .attr("y", forceheight*2-3)
            .text("Inputs")
            .attr("font-size",8)

    var kitColor4 = buttonSVG.append("g").attr("class","backlabels")
            .append("circle")
            .attr("cx", forcewidth/2-12)
            .attr("cy", forceheight*2-5)
            .attr("r", 4)
            .attr("fill","#FF9800")
            .attr("stroke","#FF9800")
    var kitNameColor4 = buttonSVG.append("g").attr("class","backlabels")
            .append("text")
            .attr("x", forcewidth/2-6)
            .attr("y", forceheight*2-3)
            .text("Outputs")
            .attr("font-size",8)

    var kitColor5 = buttonSVG.append("g").attr("class","backlabels")
            .append("circle")
            .attr("cx", forcewidth/1.5-6)
            .attr("cy", forceheight*2-5)
            .attr("r", 4)
            .attr("fill","#C71549")
            .attr("stroke","#C71549")
    var kitNameColor5 = buttonSVG.append("g").attr("class","backlabels")
            .append("text")
            .attr("x", forcewidth/1.5)
            .attr("y", forceheight*2-3)
            .text("Functions")
            .attr("font-size",8)

    // draw border around plot area
    plot.append("circle")
        .attr("class", "outline")
        .attr("fill","none")
        .attr("stroke","black")
        .attr("stroke-width",.5)
        .attr("r", radius - margin+2);

    circleLayout(linkNodes);

    drawCurves(linkLinks);
    // draw nodes last
    drawNodes(linkNodes);

    // Calculates node locations
    function circleLayout(nodes) {
        // sort nodes by group
        nodes.sort(function(a, b) {
            return a.group - b.group;
        });

        // use to scale node index to theta value
        var scale = d3.scale.linear()
            .domain([0, nodes.length])
            .range([0, 2 * Math.PI]);

        // calculate theta for each node
        nodes.forEach(function(d, i) {
            // calculate polar coordinates
            var theta  = scale(i);
            var radial = radius - margin;

            // convert to cartesian coordinates
            d.x = radial * Math.sin(theta);
            d.y = radial * Math.cos(theta);
        });
    }
    // Generates a tooltip for a SVG circle element based on its ID
    function addTooltip(circle) {
        var x = parseFloat(circle.attr("cx"));
        var y = parseFloat(circle.attr("cy"));
        var r = parseFloat(circle.attr("r"));
        var text = circle.attr("id");

        var tooltip = d3.select("#plot")
            .append("text")
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("dy", -r * 2)
            .attr("id", "tooltip");

        var offset = tooltip.node().getBBox().width / 2;

        if ((x - offset) < -radius) {
            tooltip.attr("text-anchor", "start");
            tooltip.attr("dx", -r);
        }
        else if ((x + offset) > (radius)) {
            tooltip.attr("text-anchor", "end");
            tooltip.attr("dx", r);
        }
        else {
            tooltip.attr("text-anchor", "middle");
            tooltip.attr("dx", 0);
        }
    }
    function drawNodes(nodes) {
        var radius = 5;
        d3.select("#plot").selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("id", function(d, i) { return d.name; })
            .attr("cx", function(d, i) { return d.x; })
            .attr("cy", function(d, i) { return d.y; })
            .attr("r", radius)
            .style("fill",  function(d, i) { 
                addTooltip(d3.select(this))
                for(j=0; j<inputs.length; j++){
                    if(d.name.toLowerCase().indexOf(inputs[j].toLowerCase())>-1){
                        return "lightpink";
                    }
                }
                for(k=0; k<outputs.length; k++){
                    if(d.name.toLowerCase().indexOf(outputs[k].toLowerCase())>-1){
                        return "#FF9800";
                    }
                }
                for(l=0; l<programming.length; l++){
                    if(d.name.toLowerCase().indexOf(programming[l].toLowerCase())>-1){
                        return "#C71549";
                    }
                }
            })
    }
    // Draws curved edges between nodes
    function drawCurves(links) {
        var curve = d3.svg.diagonal()
            .projection(function(d) { return [d.x, d.y]; });

        d3.select("#plot").selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("stroke",function(d, i) { 
                for(j=0; j<inputs.length; j++){
                    if(d.name.toLowerCase().indexOf(inputs[j].toLowerCase())>-1){
                        return "lightpink";
                    }
                }
                for(k=0; k<outputs.length; k++){
                    if(d.name.toLowerCase().indexOf(outputs[k].toLowerCase())>-1){
                        return "#FF9800";
                    }
                }
                for(l=0; l<programming.length; l++){
                    if(d.name.toLowerCase().indexOf(programming[l].toLowerCase())>-1){
                        return "#C71549";
                    }
                }
            })
            .attr("fill","none")
            .attr("d", curve);
    }
}

