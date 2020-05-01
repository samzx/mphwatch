import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Dashboard from './Dashboard';
import Landing from './Landing';

const AppRouter = () => (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div>
            <Switch>
                <Route path="/" component={Landing} exact={true} />
                <Route path="/demo" component={Dashboard} exact={true}/>
                <Route path="/:id" component={Dashboard} />
            </Switch>
        </div>
    </BrowserRouter>
);

export default AppRouter;