import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import DocumentMeta from "react-document-meta";
import NotificationStore from "store/NotificationStore";
import { Tabs, TabPane, Tooltip, Pagination } from "element-react/next";
import { Link } from "react-router-dom";
import moment from "moment";
import { getTimeDiff, getGMT8DateStr } from "utils/DateTimeKit";

const styles = require("./styles/index.less");

interface NotificationViewProps {
    type: string;
    match: any;
    location: any;
    history: any;
}

interface NotificationViewState {}

@observer
class NotificationView extends React.Component<
    NotificationViewProps,
    NotificationViewState
> {
    private store: NotificationStore;

    constructor(props) {
        super(props);
        const { match, location, type } = props;
        this.store = NotificationStore.getInstance(
            { match, location, cookies: "" },
            type
        );
    }

    switchTab = (tab: any) => {
        const { history, type } = this.props;
        const tabName = tab.props.name;
        if (tabName === type) {
            return;
        }
        if (tabName === "system") {
            history.push("/notification/system");
        } else {
            history.push("/notification");
        }
    };

    onPageChange = (nextpage: number) => {
        const { history, type } = this.props;
        const { page } = this.store;
        if ((page > 1 && nextpage === 1) || (page === 1 && nextpage > 1)) {
            this.store.destroy();
        }
        const pageSuffix = nextpage === 1 ? "" : `/page/${nextpage}`;
        if (type === "system") {
            history.push(`/notification/system${pageSuffix}`);
        } else {
            history.push(`/notification${pageSuffix}`);
        }
    };

    componentDidUpdate(prevProps) {
        const { location, match } = this.props;
        const page = Number(match.params.page) || 1;
        const prevPage = Number(prevProps.match.params.page) || 1;
        if (page !== prevPage) {
            this.store = NotificationStore.rebuild({
                location,
                match,
                cookies: ""
            });
        }
    }

    renderTabs = () => {
        const { type } = this.props;
        return (
            <header className={styles.tabs}>
                <Tabs activeName={type} onTabClick={this.switchTab}>
                    <TabPane label="站内消息" name="user" />
                    <TabPane label="系统通知" name="system" />
                </Tabs>
            </header>
        );
    };

    renderNotificationList = () => {
        const { total, notifications, loading } = this.store;
        const { type } = this.props;
        if (total === 0 && !loading) {
            return (
                <div
                    className={ClassNames(
                        [styles.notificationList],
                        [styles.emptyList]
                    )}
                >
                    空空如也~
                </div>
            );
        }
        return (
            <ul className={styles.notificationList}>
                {notifications.map((notification, index) => {
                    return (
                        <li key={index}>
                            <header>
                                <div>
                                    {type !== "system" && (
                                        <span className={styles.sender}>
                                            <Link
                                                to={`/u/${notification.sender}`}
                                            >
                                                {notification.sender}
                                            </Link>
                                        </span>
                                    )}
                                    <span className={styles.sendTime}>
                                        <Tooltip
                                            effect="dark"
                                            placement="top"
                                            content={getGMT8DateStr(
                                                moment(
                                                    notification.createTime *
                                                        1000
                                                )
                                            )}
                                        >
                                            {getTimeDiff(
                                                moment(
                                                    notification.createTime *
                                                        1000
                                                )
                                            )}
                                        </Tooltip>
                                    </span>
                                </div>
                            </header>
                            <h4>{notification.title}</h4>
                            {notification.content && (
                                <p>{notification.content}</p>
                            )}
                        </li>
                    );
                })}
                {loading && (
                    <div className={styles.loading}>
                        <i className="el-icon-loading" />
                    </div>
                )}
            </ul>
        );
    };

    renderPagination = () => {
        const { store } = this;
        const { total, page, pageSize, loading } = store;
        if (total < 0 || loading) {
            return null;
        }
        return (
            <div className={styles.pagination}>
                <Pagination
                    layout="prev, pager, next"
                    total={total}
                    currentPage={page}
                    pageSize={pageSize}
                    onCurrentChange={this.onPageChange}
                />
            </div>
        );
    };

    render() {
        const { type } = this.props;
        const meta = {
            title: `${type === "system"
                ? "系统通知"
                : "站内通知"}-Elune Forum-Web development community,WordPress,PHP,Java,JavaScript`,
            description: "",
            // canonical: "https://elune.me",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Elune,forum,wordpress,php,java,javascript,react"
                }
            }
        };

        return (
            <div className={styles.notificationView}>
                <DocumentMeta {...meta} />
                <div className={ClassNames("container", [styles.container])}>
                    {this.renderTabs()}
                    {this.renderNotificationList()}
                </div>
            </div>
        );
    }
}

const NotificationViewWithRouter = withRouter(NotificationView);

export default NotificationViewWithRouter;
