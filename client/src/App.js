import React, { Component } from 'react';

// BrowserRouter is a <Router> that uses the HTML5 history API 
// (pushState, replaceState and the popstate event) to keep your UI in sync with the URL.
// From: https://reacttraining.com/react-router/web/api/BrowserRouter
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import {setCurrentUser, logoutUser} from './actions/authActions'

import {Provider} from 'react-redux'
import store from './store'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './auth/Register'
import Login from './auth/Login'
import PrivateRoute from './components/private-route/PrivateRoute'
import Dashboard from './components/dashboard/Dashboard'

// Check for token to keep user logged in
if(sessionStorage.jwtToken){
  
  // Set auth token header auth
  const token = sessionStorage.jwtToken
  setAuthToken(token)
  
  // Decode token and get user info and expiration 
  const decoded = jwt_decode(token)

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded))

  // Check for expired token
  const currentTime = Date.now() / 1000 // to get in milliseconds
  if (decoded.exp < currentTime){
    // Logout user
    store.dispatch(logoutUser())

    // Redirect to login
    window.location.href = './login'
  }
}


class App extends Component {
  render() {
    return(
      <Provider store={store}>
        <Router>
          <div className='App'>
            <Navbar/>
            <Route exact path='/' component={Landing}/>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/login' component={Login}/>
            <Switch>
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
            </Switch>
          </div>
         </Router>
      </Provider>
    )
  }
}

export default App;

