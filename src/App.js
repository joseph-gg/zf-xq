import React from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Home from './page/Home'
function App() {
  return (
    <Router className="App">
      <Switch>
      <Route path="/home" component={Home}/>
      </Switch>
    </Router>
  );
}

export default App;
