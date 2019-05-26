import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from "../Home"
import Product from "../Product"
import Collection from "../Collection"
import Generic from "../Generic"
import { ContentProvider, HatsProvider } from '../Context'

import "../../sass/main.scss"

const Routes = () => {
  return (
    <ContentProvider>
      <HatsProvider>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/browse/:category" component={Collection} />
          <Route path="/browse" component={Collection} />
          <Route path="/terms" component={Generic} />
          <Route path="/about" component={Generic} />
          <Route path="/contact" component={Generic} />
          <Route path="/product/:id" component={Product} />
          <Redirect from="/product" to="/browse" />
          <Redirect to="/home" />
        </Switch>
      </HatsProvider>
    </ContentProvider>
  )
}

export default Routes;