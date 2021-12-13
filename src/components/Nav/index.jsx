import MyNavLink from '../MyNavLink';
import './index.css';

const Nav = () => {
    const router = [
        {
            to: '/admin/home',
            content: '首页',
        },
        {
            to: '/admin/article',
            content: '文章',
        },
        {
            to: '/admin/gallery',
            content: '图库',
        },
        {
            to: '/admin/say',
            content: '说说',
        },
        {
            to: '/admin/msg',
            content: '留言板',
        },
        {
            to: '/admin/link',
            content: '友链',
        },
        {
            to: '/admin/show',
            content: '作品',
        },
        {
            to: '/admin/about',
            content: '关于',
        },
        {
            to: '/admin/log',
            content: '建站日志',
        },
        {
            to: '/admin/draft',
            content: '草稿箱',
        },
    ];
    return (
        <div className="NavBox">
            <div className="appName">飞鸟小站</div>
            <ul className="funcBtns">
                {router.map((item, index) => (
                    <li key={index}>
                        <MyNavLink to={item.to} className="funcLi">
                            {item.content}
                        </MyNavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Nav;
