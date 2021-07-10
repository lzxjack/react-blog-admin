import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Pie } from '@ant-design/charts';
import { db } from '../../../../utils/cloudBase';
import './index.css';

const Chart = props => {
    const [classData, setClassData] = useState([]);
    const pieConfig = {
        // padding: 'auto',
        appendPadding: 30,
        autoFit: true,
        data: classData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        legend: false,
        label: {
            type: 'outer',
            autoRotate: false,
            content: '{name} {percentage}',
            style: {
                fontSize: 16,
            },
        },
        interactions: [
            { type: 'pie-legend-active' },
            { type: 'element-active' },
            { type: 'tooltip' },
        ],
    };

    useEffect(() => {
        const classMap = new Map();
        const classes = [];
        db.collection('articles')
            .get()
            .then(res => {
                for (const item of res.data) {
                    classMap.set(item.classes, (classMap.get(item.classes) || 0) + 1);
                }
                for (const item of classMap) {
                    const obj = {
                        type: item[0] ? item[0] : '未分类',
                        value: item[1],
                    };
                    classes.push(obj);
                }
                setClassData(classes);
            });
    }, [props.chartState]);

    return (
        <div className="ChartBox">
            <Pie {...pieConfig} />
        </div>
    );
};

export default connect(
    state => ({
        chartState: state.chartState,
    }),
    {}
)(Chart);
