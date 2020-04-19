import React, { Component } from "react";
import {Route , Link} from 'react-router-dom'
import Index from "../index";
import House from "../house";
import Profile from "../profile";
class Home extends Component {
    render() {
        return (
            <div className="home">
                {/* 二级路由 */}
                <Link to="/home">默认首页</Link>
                <Link to="/home/house">列表找房</Link>
                <Link to="/home/profile">我的</Link>
                <Route exact path="/home" component={Index} />
                <Route path="/home/house" component={House} />
                <Route path="/home/profile" component={Profile} />

            </div>
        )
    }
}
export default Home;