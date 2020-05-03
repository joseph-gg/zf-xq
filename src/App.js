import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Home from './page/Home';
import CityList from './page/CityList';
import Map from './page/Map';
import NotFound from './page/NotFound';
import HouseDetail from "./page/house/components/HouseDetail";
import Login from "./page/Login";
function App() {
  return (
    <Router className="App">
      <div className="app">
      <Switch>
        {/* 路由重定向 */}
      <Redirect exact from="/" to="/home"/>
      <Route path="/home" component={Home}/>
      <Route path="/CityList" component={CityList}/>
      <Route path="/Map" component={Map}/>
      <Route path="/detail/:id" component={HouseDetail} />
      <Route path="/login" component={Login}/>
      <Route component={NotFound}/>
      </Switch>
      </div>
    </Router>
  );
}

export default App;
