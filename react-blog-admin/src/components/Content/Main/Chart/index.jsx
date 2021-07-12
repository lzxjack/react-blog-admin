import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Pie } from '@ant-design/charts';
import './index.css';

const Chart = props => {
    const [classData, setClassData] = useState([]);
    const pieConfig = {
        appendPadding: 30,
        autoFit: true,
        data: classData,
        angleField: 'count',
        colorField: 'className',
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
    // 整理饼图需要的数据格式
    useEffect(() => {
        // classes分类的数组
        const classes = props.classes
            .filter(item => item.count !== 0)
            .map(item => ({
                className: item.class,
                count: item.count,
            }));
        // 求有分类的文章的数目
        let articleHadClass = 0;
        const len = classes.length;
        for (let i = 0; i < len; i++) {
            articleHadClass += classes[i].count;
        }
        // 未分类的文章
        // 类名为“未分类”，数量=文章总数-有分类的文章的数目
        const articleNoClass = { className: '未分类', count: props.articlesNum - articleHadClass };
        // 未分类的文章追加到数组中
        const articlesData = [...classes, articleNoClass];
        setClassData(articlesData);
    }, [props.classes, props.articlesNum]);

    return (
        <div className="ChartBox">
            <span className="type">文章概览</span>
            <Pie {...pieConfig} />
        </div>
    );
};

export default connect(
    state => ({
        classes: state.classes,
        articlesNum: state.articlesNum,
    }),
    {}
)(Chart);
