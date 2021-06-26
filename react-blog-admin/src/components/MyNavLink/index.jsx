import { NavLink } from 'react-router-dom';

const MyNavLink = props => {
    return <NavLink activeClassName="navActive" {...props} />;
};

export default MyNavLink;
