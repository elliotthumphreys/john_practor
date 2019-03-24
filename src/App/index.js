import React from "react";
import AdminBase from "../admin/components/Base";
import Home from "../client/Home"
import Product from "../client/Product"
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

const App = () => {
    return(
      <Router>
        <Switch>
          <Route path="/admin" component={AdminBase} />
          <Route path="/home" component={Home} />
          <Route path="/product/:id" component={Product} />
          <Redirect to='/home' />
        </Switch>
      </Router>
    )
}

export default App;