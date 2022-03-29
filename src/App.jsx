import { useEffect } from 'react';
import { connect } from 'react-redux';
import { auth } from '../src/utils/cloudBase';
import { login } from '../src/redux/actions';
import Login from './pages/Login';
import Admin from './pages/Admin';

const App = ({ loginState, login }) => {
  useEffect(() => {
    auth.hasLoginState() ? login(true) : login(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState]);

  return <>{loginState ? <Admin /> : <Login />}</>;
};

export default connect(
  state => ({
    loginState: state.loginState
  }),
  { login }
)(App);
