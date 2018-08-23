import React from 'react'
import ReactDom from 'react-dom'
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router'

import Login from './components/login.js'
import Register from './components/register.js'
import BaseLayout from './components/baselayout'
import Explorer from './components/explorer'

import Home from './components/home'
import TobeProcessed from "./components/tobeprocessed"
import Letters from './components/letters.js'
import Clients from './components/clients'
import ClientList from './components/clientList'
import Settings from './components/settings'
import Users from './components/users'

import LetterDraft from './components/letter/draft'
import LetterOriginal from './components/letter/original'
import LetterAdvising from './components/letter/advising'
import LetterAcceptance from './components/letter/acceptance'
import LetterAcceptancebyAB from './components/letter/acceptancebyadvisingbank'
import LetterRedemption from './components/letter/redemption'
import LetterClosing from './components/letter/closing'

ReactDom.render(
    (
        <Router history={hashHistory} >
            <Route path="/" >
                <IndexRoute component={Login}/>
                <Route path="login" component={Login} />
                <Route path="register" component={Register} />
                <Route path="lcpayment" component={BaseLayout}>
                    <Route path="index" component={Home} />
                    <Route path="tobeprocessed" component={TobeProcessed} />                    
                    <Route path="letters" component={Letters} />
                    <Route path="clients" component={Clients} />
                    <Route path="clientlist" component={ClientList} />
                    <Route path="settings" component={Settings} />
                    <Route path="users" component={Users} />
                    <Route path="draft(/:id)" component={LetterDraft} />
                    <Route path="original(/:id)" component={LetterOriginal} />
                    <Route path="advising(/:id)" component={LetterAdvising} />
                    <Route path="acceptance(/:id)" component={LetterAcceptance} />
                    <Route path="acceptancebyadvisingbank(/:id)" component={LetterAcceptancebyAB} />
                    <Route path="redemption(/:id)" component={LetterRedemption} />
                    <Route path="closing(/:id)" component={LetterClosing} />
                </Route>
                <Route path="browser" component={BaseLayout}>
                    <Route path="index" component={Explorer} />
                </Route>
            </Route>
        </Router>
    ), document.getElementById('app')
);
