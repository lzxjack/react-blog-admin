import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import Content from '../../components/Content';
import { connect } from 'react-redux';
import { getClasses } from '../../redux/actions/classes';
import { getTags } from '../../redux/actions/tags';
import { db } from '../../utils/cloudBase';
import './index.css';

const Admin = props => {
    const [isMounted, setIsMounted] = useState(true);
    // 向数据库获取所有标签
    const getAllTags = () => {
        db.collection('tags')
            .get()
            .then(res => {
                props.getTags(res.data);
            });
    };
    // 向数据库获取所有分类
    const getAllClasses = () => {
        db.collection('classes')
            .get()
            .then(res => {
                props.getClasses(res.data);
            });
    };
    // 组件挂载，获取一次所有标签和分类
    useEffect(() => {
        if (isMounted) {
            getAllTags();
            getAllClasses();
        }
        return () => {
            setIsMounted(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    return (
        <div className="AdminBox">
            <div className="navBack"></div>
            <Nav />
            <Content />
        </div>
    );
};

export default connect(() => ({}), {
    getClasses,
    getTags,
})(Admin);
