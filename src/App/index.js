import React, { useEffect, useState } from "react"
import { GetContent } from "../client/util"
import AdminBase from "../admin/components/Base"
import Home from "../client/components/Home"
import Product from "../client/components/Product"
import Collection from "../client/components/Collection"
import Terms from "../client/components/Terms"
import About from "../client/components/About"
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

const App = () => {
  const [home, setHome] = useState()
  const [collection, setCollection] = useState()
  const [navigation, setNavigation] = useState()

  const getContentAsync = async () => {
    const { success, content } = await GetContent()
    console.log(content)

    if (success) {
      setHome(content.pages.find(_ => _.slug === 'home').data)
      setCollection(content.pages.find(_ => _.slug === 'collection').data)
      setNavigation(content.navigation)
    }
  }

  useEffect(() => {
    getContentAsync()
  }, [])

  return (
    <Router>
      <Switch>
        <Route path="/admin" component={AdminBase} />
        <Route path="/home" render={(props) => <Home {...props} nav={navigation} content={home}/>} />
        <Route path="/collection" render={(props) => <Collection {...props} nav={navigation} content={collection} header={home && home.header}/>} />
        <Route path="/terms" component={Terms} />
        <Route path="/about" component={About} />
        <Route path="/product/:id" component={Product} />
        <Redirect to='/home' />
      </Switch>
    </Router>
  )
}

export default App;