import { Route, Switch, Redirect } from 'react-router-dom';
import About from '../../../pages/Admin/About';
import Article from '../../../pages/Admin/Article';
import Gallery from '../../../pages/Admin/Gallery';
import Link from '../../../pages/Admin/Link';
import Log from '../../../pages/Admin/Log';
import Msg from '../../../pages/Admin/Msg';
import Say from '../../../pages/Admin/Say';
import Show from '../../../pages/Admin/Show';
import Home from '../../../pages/Admin/Home';
import AddArticle from '../../../pages/Admin/AddArticle';
import AddGallery from '../../../pages/Admin/AddGallery';
import Draft from '../../../pages/Admin/Draft';

import './index.css';

const Main = () => {
    return (
        <div className="MainBox">
            <Switch>
                <Route path="/admin/home" component={Home} />
                <Route path="/admin/article" component={Article} />
                <Route path="/admin/gallery" component={Gallery} />
                <Route path="/admin/say" component={Say} />
                <Route path="/admin/msg" component={Msg} />
                <Route path="/admin/link" component={Link} />
                <Route path="/admin/show" component={Show} />
                <Route path="/admin/about" component={About} />
                <Route path="/admin/log" component={Log} />
                <Route path="/admin/draft" component={Draft} />
                <Route path="/admin/addArticle" component={AddArticle} />
                <Route path="/admin/addGallery" component={AddGallery} />
                <Redirect to="/admin/home" />
            </Switch>
        </div>
    );
};

export default Main;
