import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './index.css';

const Infor = props => {
    const [date, setDate] = useState(null);
    useEffect(() => {
        const time = moment().format('YYYY-MM-DD');
        setDate(time);
    }, [props.ip]);
    return (
        <div className="InforBox">
            <span className="dateText">{date}</span>
            <span className="ipText">IP地址：{props.ip}</span>
        </div>
    );
};

export default connect(
    state => ({
        ip: state.ip,
    }),
    {}
)(Infor);
