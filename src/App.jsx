import { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth } from '../src/utils/cloudBase';
import { login } from '../src/redux/actions';
import Login from './pages/Login';
import Admin from './pages/Admin';

const App = props => {
    useEffect(() => {
        auth.hasLoginState() ? props.login(true) : props.login(false);
    }, [props]);

    return (
        <Switch>
            {props.loginState ? (
                <Route path="/admin" component={Admin} />
            ) : (
                <Route path="/login" component={Login} />
            )}
        </Switch>
    );
};

export default connect(
    state => ({
        loginState: state.loginState,
    }),
    { login }
)(App);
