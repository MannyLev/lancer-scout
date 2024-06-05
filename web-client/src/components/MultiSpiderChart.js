import React from "react"

// spider chart with multiple translucent layers
const MultiSpiderChart = ({ chartWidth, chartHeight, maxHeight, style, data, axisLabels, axisMaximums }) => {
    const teamNames = Object.keys(data)

    if (Object.keys(axisLabels).length == 0) return (
        <div style={{ ...style, chartWidth, chartHeight }} />
    )
    
    const teamColors = {}
    teamNames.forEach((teamName, index) => {
        const hue = Math.floor(360 * (index / teamNames.length))

        teamColors[teamName] = {
            solid: `hsl(${hue}, 70%, 50%)`,
            transparent: `hsla(${hue}, 70%, 50%, 0.1)`
        }
    })

    const polarToCartesian = (theta, r) => ({ x: 18 + r * Math.cos(theta + 0.5 * Math.PI + Math.PI / (2 * Object.keys(axisLabels).length)), y: 15 - r * Math.sin(theta + 0.5 * Math.PI + Math.PI / (2 * Object.keys(axisLabels).length)) })

    // all these can technically be merged, separated for readability

    const axisRenders = []
    const center = polarToCartesian(0, 0)
    for(let i = 0;i<Object.keys(axisLabels).length;i++){
        const endPoint = polarToCartesian(2 * Math.PI * (i / Object.keys(axisLabels).length), 9)

        axisRenders.push(
            <line key={"axis" + i} stroke={"rgb(20, 20, 20)"} strokeWidth={0.05} x1={center.x} y1={center.y} x2={endPoint.x} y2={endPoint.y} />
        )
    }

    const dataRenders = []
    teamNames.forEach(teamName => {
        const teamData = Object.entries(data[teamName])

        const indicatorPoints = teamData.map((point, index) => polarToCartesian(2 * Math.PI * (index / teamData.length), 9 * (Math.min(point[1] / axisMaximums[point[0]], 1) || 0.001)))
        for(let i = 0;i<indicatorPoints.length;i++){
            dataRenders.push(
                <circle key={teamName + "indicator" + i} fill={teamColors[teamName].solid} cx={indicatorPoints[i].x} cy={indicatorPoints[i].y} r={0.2} />
            )
        }

        let indicatorConnectionsPath = `M ${indicatorPoints[indicatorPoints.length - 1].x} ${indicatorPoints[indicatorPoints.length - 1].y}`
        for(let i = 0;i<indicatorPoints.length;i++){
            indicatorConnectionsPath += ` L ${indicatorPoints[i].x} ${indicatorPoints[i].y}`
        }
        
        dataRenders.push(
            <path key={teamName + "path"} fill={teamColors[teamName].transparent} stroke={teamColors[teamName].solid} strokeWidth={0.1} d={indicatorConnectionsPath} />
        )
    })

    const labelRenders = []
    Object.entries(axisLabels).forEach(([ key, label ], i) => {
        const x = Math.cos(2 * Math.PI * (i / Object.keys(axisLabels).length) + 0.5 * Math.PI)
        const y = Math.sin(2 * Math.PI * (i / Object.keys(axisLabels).length) + 0.5 * Math.PI)
        const textAnchor = x < -0.9 ? "end" : x > 0.9 ? "start" : "middle"

        const anchor = polarToCartesian(2 * Math.PI * (i / Object.keys(axisLabels).length), (Math.abs(x) < 0.9 ? 11.5 : 10.5) + (Math.abs(y) > 0.99 && Object.keys(axisLabels).length > 10 ? 1 : 0))

        labelRenders.push(
            <text key={"label" + i} x={anchor.x} y={anchor.y} textAnchor={textAnchor} dominantBaseline={"middle"} fontSize={1} fontFamily={"OpenSans"} fontWeight={"700"} >
                {
                    label + " (" + axisMaximums[key] + ")"
                }
            </text>
        )
    })

    const colorKeyRenders = []
    teamNames.forEach(teamName => {
        colorKeyRenders.push(
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginRight: 20, marginBottom: 20 }}>
                <div style={{ width: 16, height: 16, marginRight: 4, borderRadius: 4, backgroundColor: teamColors[teamName].transparent, borderStyle: "solid", borderWidth: 2, borderColor: teamColors[teamName].solid }} />
                <i>
                    {
                        teamName
                    }
                </i>
            </div>
        )
    })

    return (
        <div style={{ display: "flex", flexDirection: "column", width: chartWidth, height: maxHeight }}>
            <svg width={chartWidth} height={chartHeight} style={{ ...style, flexShrink: 0 }} viewBox={"0 0 36 30"}>
                {
                    [...dataRenders, ...labelRenders]
                }
            </svg>
            <div style={{ overflowY: "scroll" }}>
                {
                    colorKeyRenders
                }
            </div>
        </div>
    )
}

// TODO: is this worth memoizing
export default MultiSpiderChart