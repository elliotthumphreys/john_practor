import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from "../Login"
import ViewAll from "../ViewAll"
import Add from "../Add"
import UpdateContent from "../Content"
import "../../sass/main.scss"

const AdminBase = ({ match: { path } }) => {
    return (
        <Switch>
            <Route path={`${path}/view-all`} component={ViewAll} />
            <Route path={`${path}/add`} component={Add} />
            <Route path={`${path}/update/:id`} component={Add} />
            <Route path={`${path}/edit-main-content`} component={UpdateContent} />
            <Route path={`${path}/login`} component={Login} />
        </Switch>
    )
}

export default AdminBase;