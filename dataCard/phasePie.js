
function makePie(){
    var width = forcewidth*2,
        height = forceheight*2;
    var diameter = forcewidth;
    var margin = 60;
    var radius = (diameter / 2)-margin+3;
    var color = ["#3F51B5","#607D8B","#7986CB"];

    var pie = d3.layout.pie()
        .sort(null);

    var outerRadius = radius;
    var innerRadius = radius-20;
    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    var labelr = radius/1.7 + 23; 

    var netSVG = d3.select("#facehand")
    	.append("svg")
    	.attr("width",forcewidth*2)
    	.attr("height",forceheight*2)  
    	.append("g")
    	.style("margin-top","1px")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    var pathPie = netSVG.selectAll("pathPie")
        .data(pie(phaseArray))
        .enter().append("path")
        .attr("fill", function(d, i) { return color[i]; })
        .attr("d", arc);

    var label_group = netSVG.append("svg:g")
        .attr("class", "lblGroup")

    var sliceLabel = label_group.selectAll("text")
        .data(pie(phaseArray))

    sliceLabel.enter().append("svg:text")
        .attr("class", "arcLabel")
        .attr("transform", function(d) {
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                // pythagorean theorem for hypotenuse
                h = Math.sqrt(x*x + y*y);
            return "translate(" + (x/h * labelr) +  ',' +
               (y/h * labelr) +  ")"; 
        })
        .attr("dy",  function(d){
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                // pythagorean theorem for hypotenuse
                h = Math.sqrt(x*x + y*y);
        	if ((y/h * labelr)>outerRadius/2) {
        		return "2.2em"
        	}
    		else{
    			return ("-1.3em")
    		}
        })
        .attr("text-anchor", "middle")
        .text(function(d, i) { 
        	if(i==0){
        		return "Plan"
        	}
        	if(i==1){
        		return "Document"
        	}
        	if(i==2){
        		return "Reflect"
        	}
        })
        .attr("fill", "white")
            // function(d, i) { return color[i]; })
}
function makeRectPhases(){
    //draw a rectangle for each key
    var rectPhase = timeSVG.selectAll(".phase")
        .data(obs)
        .enter()
        .append("rect")
        .attr("class","phase")
          .attr("x",function(d,i){
            console.log(d);
            console.log(timeX(d.start))
            return timeX(d.start); 
          })
          .attr("y",0)
          .attr("width",function(d,i){
            return timeX(d.end)-timeX(d.start);
          })
          .attr("height",timeSVGH)//-2*cmargin)
          .attr("fill",function(d,i){
            if(d.num%2==0){
                return "none"
            } else{
                return "lightgray";
            }
          })
          .attr("opacity",.1)
          .attr("stroke","grey")

    var textPhase = timeSVG.selectAll(".phaseText")
        .data(obs)
        .enter()
        .append("text")
        .attr("class","phaseText")
        .attr("x",function(d,i){
            var currentX = timeX(d.start)+(timeX(d.end)-timeX(d.start))/2;
            return currentX;    
        })
        .attr("y",function(d,i){
                if(i>0){
                    var currentX = timeX(d.start)+(timeX(d.end)-timeX(d.start))/2;
                    var oneBefore = (timeX(obs[i-1].start)+timeX(obs[i-1].end)-timeX(obs[i-1].start))/2;
                    var whichIndex=1; 
                    if((currentX-oneBefore)>70){
                        return 15;
                    } else{
                        whichIndex++;
                        return 15*whichIndex;
                    }
                }
                if(i==0){
                    return 15;
                }
            })
          .text(function(d){
            if(d.phase=="obs_reflect"){
                return "REFLECTION"
            }
            if(d.phase=="obs_document"){
                return "DOCUMENTATION"
            }
            if(d.phase=="obs_plan"){
                return "PLANNING"
            }
          })
          .attr("text-anchor","middle")
}