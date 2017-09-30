import * as React from "react";
import { observer, inject } from "mobx-react";
import ClassNames from "classnames";
import AuthModal, { AuthType } from "components/authModal";
import Dropdown from "common/dropdown";
import GlobalStore from "store/GlobalStore";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import Headroom from "react-headroom";
// import * as PropTypes from "prop-types";
import { Button } from "element-react/next";

const styles = require("./index.less");

interface HeaderProps {
    stores?: any;
    match: any;
    location: any;
}

interface HeaderState {
    authType: AuthType;
}

@inject("stores")
@observer
class Header extends React.Component<HeaderProps, HeaderState> {
    // static contextTypes = {
    //     router: PropTypes.shape({
    //         staticContext: PropTypes.object
    //     })
    // };

    constructor(props) {
        super(props);
        this.state = {
            authType: AuthType.None
        };
    }

    componentWillMount() {
        // if is ssr, set the sessionid from cookie to the global store
        console.dir("componentWillMount");
        // if (this.context.router.staticContext) {
        //     console.log(
        //         `SESSIONID: ${this.context.router.staticContext.SESSIONID}`
        //     );
        //     GlobalStore.getInstance(
        //         this.context.router.staticContext.SESSIONID
        //     );
        // }
        const { globalStore } = this.props.stores;
        if (globalStore) {
            console.dir("cookies: " + globalStore.Cookies);
            console.dir(GlobalStore.Instance.Cookies);
        } else {
            console.dir("globalStore inject failed");
        }

        const match = this.props.match;
        console.dir(JSON.stringify(match));
        const location = this.props.location;
        console.dir(JSON.stringify(location));
    }

    closeAuthPannel = () => {
        this.setState({
            authType: AuthType.None
        });
    };

    switchAuthType = (authType: AuthType) => {
        this.setState({
            authType
        });
    };

    logout = () => {
        GlobalStore.Instance.requestLogout().then(() => {
            // TODO redirect according to url query
        });
    };

    renderAuthPanel = () => {
        const { authType } = this.state;
        return (
            <AuthModal
                open={authType !== AuthType.None}
                onClose={this.closeAuthPannel}
                authType={authType}
                switchType={this.switchAuthType}
            />
        );
    };

    renderSession = () => {
        const globalStore = GlobalStore.Instance;
        const user = globalStore.user;
        if (!user || !user.id) {
            return null;
        }

        return (
            <li className={styles.itemSession}>
                <Dropdown
                    className={styles.sessionDropdown}
                    anchorNode={
                        <span className="btn-label">{user.username}</span>}
                >
                    <Dropdown.Item hasIcon>
                        <Link to={`/u/${user.username}`}>
                            <i className="fa fa-fw fa-user" />
                            <span className="btn-label">我的资料</span>
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item hasIcon>
                        <Link to={"/settings"}>
                            <i className="fa fa-fw fa-cog" />
                            <span className="btn-label">个人设置</span>
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item hasIcon>
                        <Button type="primary" onClick={this.logout}>
                            <i className="fa fa-fw fa-sign-out" />
                            <span className="btn-label">登出</span>
                        </Button>
                    </Dropdown.Item>
                </Dropdown>
            </li>
        );
    };

    render() {
        const globalStore = GlobalStore.Instance;
        const user = globalStore.user;
        const logged = user && user.id > 0;
        return (
            <Headroom>
                <header id="header" className={styles.appHeader}>
                    <div
                        className={ClassNames("container", [styles.container])}
                    >
                        <h1 className={styles.headerTitle}>
                            <a href="/">Elune Forum</a>
                        </h1>
                        <div className={styles.headerPrimary}>
                            <ul className={styles.headerControls}>
                                <li>
                                    <a
                                        href="/"
                                        className={ClassNames("btn btn--link", [
                                            styles.btnLink
                                        ])}
                                    >
                                        <i className="fa fa-home" />首页
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className={styles.headerSecondary}>
                            <ul className={styles.headerControls}>
                                <li className={styles.itemSearch}>
                                    <div className={styles.search}>
                                        <div className={styles.searchInput}>
                                            <input
                                                className="form-control"
                                                placeholder="搜索其实很简单"
                                            />
                                        </div>
                                        <ul className={styles.searchResults} />
                                    </div>
                                </li>
                                {/* <li className={styles.itemNotifications}></li>
                        <li className={styles.itemSession}></li> */}
                                {!logged && (
                                    <li className={styles.itemSignup}>
                                        <Button
                                            className={ClassNames(
                                                "btn btn--link",
                                                [styles.btnLink]
                                            )}
                                            type="primary"
                                            title="注册"
                                            onClick={this.switchAuthType.bind(
                                                this,
                                                AuthType.Register
                                            )}
                                        >
                                            <span className={styles.btnLabel}>
                                                注册
                                            </span>
                                        </Button>
                                    </li>
                                )}
                                {!logged && (
                                    <li className={styles.itemSignin}>
                                        <Button
                                            className={ClassNames(
                                                "btn btn--link",
                                                [styles.btnLink]
                                            )}
                                            type="primary"
                                            title="登录"
                                            onClick={this.switchAuthType.bind(
                                                this,
                                                AuthType.Login
                                            )}
                                        >
                                            <span className={styles.btnLabel}>
                                                登录
                                            </span>
                                        </Button>
                                    </li>
                                )}
                                {this.renderSession()}
                            </ul>
                        </div>
                    </div>
                    {this.renderAuthPanel()}
                </header>
            </Headroom>
        );
    }
}

const HeaderWithRouter = withRouter(Header);
export default HeaderWithRouter;
