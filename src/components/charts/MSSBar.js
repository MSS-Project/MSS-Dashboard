import React, { Component } from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, LabelList} from 'recharts';

function CustomizedLabel({viewBox, value1, value2}){
    const {cx, cy} = viewBox;
    let percent = (value1/value2 * 100).toFixed(0);

    return (
        <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
        <tspan x={cx} y={cy-5} fontSize="36">{percent}</tspan>
        <tspan fontSize="18">%</tspan>
        <tspan x={cx}  dy="40" alignmentBaseline="middle" fontSize="30"  fill="#999">{value1}</tspan>
        <tspan fontSize="20" fill="#999">/{value2}</tspan>

        </text>
    )
}

class MSSBar extends Component {
    render () {
        return (
            <BarChart width={600} height={300} data={this.props.data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey={this.props.key1}>
            {
                this.props.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={this.props.colors[index % 20]}/>
                ))
            }
            <LabelList dataKey={this.props.key1} position="top"/>
            {/* <LabelList content={<CustomizedLabel external={} />} /> */}

        </Bar>
        <Bar dataKey={this.props.key2} fill="#999" />
        <Bar dataKey={this.props.key3} fill="#666" />
        </BarChart>
        )
    }
}
export default MSSBar;