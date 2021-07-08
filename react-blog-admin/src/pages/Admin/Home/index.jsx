import { useState, useEffect } from 'react';
import Welcome from '../../../components/Content/Main/Welcome';
import Statistic from '../../../components/Content/Main/Statistic';
import MyNavLink from '../../../components/MyNavLink';
import './index.css';

const Home = () => {
    return (
        <>
            <Welcome />
            <div className="statisticRegion">
                <MyNavLink to="/admin/article" className="homeLink">
                    <Statistic type={'articles'} />
                </MyNavLink>
                <MyNavLink to="/admin/draft" className="homeLink">
                    <Statistic type={'drafts'} />{' '}
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
        </>
    );
};

export default Home;
