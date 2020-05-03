import React, { Component } from "react";
import {Route} from 'react-router-dom'
import Index from "../index";
import House from "../house";
import Profile from "../Profile";
import {TabBar} from "antd-mobile";
import './index.css'
import TabBarConfig from "../../utils/tabBarConfig";
class Home extends Component {
    state = {
        // 默认选中
        selectedTab: this.props.location.pathname
    };
    componentDidMount() {
        // 监听路由变化-点击切换TabBar路由
        this.props.history.listen((location) => {
            if (location.pathname !== this.state.selectedTab) {
                this.setState({
                    selectedTab: location.pathname,
                });
            }
        })
    }

    // 渲染TabBar组件
    renderTabBar = () => {
        return (
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="white"
            >
                {
                    TabBarConfig.map((item) =>
                        <TabBar.Item
                            title={item.title}
                            key={item.title}
                            icon={<i className={`iconfont ${item.icon}`}></i>}
                            selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
                            selected={this.state.selectedTab === item.path}
                            // 点击事件 => 切换路由
                            onPress={() => {
                                this.props.history.push(item.path)
                            }}
                        />
                    )
                }
            </TabBar>
        )
    }
    render() {
        return (
            <div className="home">
                {/* 二级路由 */}
                <Route exact path="/home" component={Index} />
                <Route path="/home/house" component={House} />
                <Route path="/home/profile" component={Profile} />
                {/*标签栏*/}
                <div className="tabBar">
                    {
                        // 渲染
                        this.renderTabBar()
                    }
                </div>
            </div>
        )
    }
}
export default Home;
