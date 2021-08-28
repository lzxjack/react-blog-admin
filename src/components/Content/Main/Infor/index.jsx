import { connect } from 'react-redux';
import './index.css';

const Infor = props => (
    <div className="InforBox">
        <span className="dateText">{props.poem.date}</span>
        <span className="ipText">IP地址：{props.poem.ip}</span>
    </div>
);

export default connect(
    state => ({
        poem: state.poem,
    }),
    {}
)(Infor);
