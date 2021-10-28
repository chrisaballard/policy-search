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
        .attr("fill", d => d.data.color || "white")
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function () { d3.select(this).attr("opacity", 0.5); })
        .on("mouseout", function () { d3.select(this).attr("opacity", 1); })
        .on("click", (event, d) => focus !== d && (zoom(event, d)));
        // .on("click", (event, d) => (zoom(event, d)));

    // Add the rect elements, these are placeholders
    // svg.append("g")
    //     .selectAll("rect")
    //     .data(root.descendants())
    //     .join("rect")
    //     // .attr("x", d => { 
    //     //     console.log(d)
    //     //     return d.x
    //     // })
    //     // .attr("y", d => d.y)
    //     .style("fill", "black")
    //     .style("opacity", "0.5");

    

    const label = svg.append("g")
        .style("font", "12px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .attr("y", d => {
            // console.log(d)
            return -d.height - 30
        })
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .style("fill", "black")
        .text(d => d.data.value ? d.data.name + " (" + d.data.value + ")" : d.data.name + '')

    // svg.selectAll("text")
    // .each(function(d) { d.bbox = this.getBBox(); });

    // // Update the rectangles using the sizes we just added to the data
    // const xMargin = 4
    // const yMargin = 2
    // svg.selectAll("rect")
    // .data(root.descendants())
    // .join("rect")
    //     .attr("width", d => d.bbox.width + 2 * xMargin)
    //     .attr("height", d => d.bbox.height + 2 * yMargin)
    //     .attr('transform', function(d) {
    //         return `translate(-${xMargin}, -${d.bbox.height * 0.8 + yMargin})`
    //     });

    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
        const k = width / v[2];

        view = v;

        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
    }

    function zoom(event, d) {
        
        console.log(event.currentTarget)
        if(d.data.link) {
            console.log('change page')
            window.location.href = d.data.link;
            return;
        }
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

// renderVisualisation()

document.addEventListener("DOMContentLoaded", function(event) { 
    //your code here
    renderVisualisation()
});