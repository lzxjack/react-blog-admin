// import { useState, useEffect } from 'react';
import Welcome from '../../../components/Content/Main/Welcome';
import Infor from '../../../components/Content/Main/Infor';
import Statistic from '../../../components/Content/Main/Statistic';
import Chart from '../../../components/Content/Main/Chart';
import Class from '../../../components/Content/Main/Class';
import MyTag from '../../../components/Content/Main/MyTag';
import MyNavLink from '../../../components/MyNavLink';
import './index.css';

const Home = () => {
    return (
        <>
            <div className="outlineBox">
                <Welcome />
                <Infor />
            </div>

            <div className="statisticRegion">
                <MyNavLink to="/admin/article" className="homeLink">
                    <Statistic type={'articles'} />
                </MyNavLink>
                <MyNavLink to="/admin/draft" className="homeLink">
                    <Statistic type={'drafts'} />
                </MyNavLink>
                <MyNavLink to="/admin/link" className="homeLink">
                    <Statistic type={'links'} />
                </MyNavLink>
                <MyNavLink to="/admin/show" className="homeLink">
                    <Statistic type={'shows'} />
                </MyNavLink>
                <MyNavLink to="/admin/say" className="homeLink">
                    <Statistic isRight={true} type={'says'} />
                </MyNavLink>
            </div>
            <div className="chart-class-tag">
                <Chart />
                <Class />
                <MyTag />
            </div>
        </>
    );
};

export default Home;
