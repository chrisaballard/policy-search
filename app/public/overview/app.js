function color(){
    return d3.scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl)
}

function doSomething(svg) {
    svg.selectAll("circle")
    .each(function(d) { console.log(d.height); d.circleHeight = d.height; });
}

async function renderVisualisation() {
    const width = 932; //window.innerWidth;
    const height = 932; //window.innerHeight;
    
    const data = await d3.json("./files/data.json", data => {
        return data
    })

    const packLayout = d3.pack()
        .size([width, height])
        .padding(3)
            
    const root = packLayout(d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value))

    // console.log(root.descendants().slice(1))

    const svg = d3.select('#visContainer').append("svg")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("background", color(0))
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));

    const node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
        .attr("fill", d => {
            if(d.data.value === 0) {
                d.r = '5';
                return "white"
            }
            
            return d.data.color || "white"
        })
        .attr("stroke", d => {
            if(d.data.value === 0) {
                return d.data.color;
            }
        })
        .attr("opacity", d => {
            if(d.data.value === 0) {
                return 0.5;
            }
        })
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function () { d3.select(this).attr("opacity", 0.5); })
        .on("mouseout", function () { d3.select(this).attr("opacity", 1); })
        .on("click", (event, d) => focus !== d && (zoom(event, d)));
        
    const label = svg.append("g")
        .style("font", "14px sans-serif")
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .attr("pointer-events", d => d.data.link ? "auto" : "none")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .style("fill", "black")
        .text(d => d.data.name)
        .on("click", (event, d) => {
            if(d.data.link) {
                window.open(d.data.link, '_parent');
            }
        })

        label.append('tspan')
            .text(d => d.data.name2 ? d.data.name2 : '')
            .attr('x', '0')
            .attr("dy", "1.2em")
            .append('tspan')
                .text(d => d.data.value !== undefined ? "(" + d.data.value + ")" : '')
                .attr('x', '0')
                .attr("dy", "1.2em")


    
    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {

        const k = width / v[2];

        view = v;

        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
    }

    function zoom(event, d) {

        event.stopPropagation()

        const focus0 = focus;

        focus = d;

        const transition = svg.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", d => {
                const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t => zoomTo(i(t));
            });

        label
            .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
            .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
    }
}

renderVisualisation();

