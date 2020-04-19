import React from 'react';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from "react-router-dom";
import Home from './page/Home';
import CityList from './page/CityList';
import Map from './page/Map';
import NotFound from './page/NotFound';
function App() {
  return (
    <Router className="App">
      <div className="app">
      <Link to="/home">首页</Link>
      <Link to="/CityList">城市列表</Link>
      <Link to="/Map">地图找房</Link>
      <Switch>
        {/* 路由重定向 */}
      <Redirect from="/" to="/home"/>
      <Route path="/home" component={Home}/>
      <Route path="/CityList" component={CityList}/>
      <Route path="/Map" component={Map}/>
      <Route component={NotFound}/>
      </Switch>
      </div>
    </Router>
  );
}

export default App;
