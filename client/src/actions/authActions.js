import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'

import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING,
} from './types'

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        // I will change this to /api/users/register when I get a chance
        .post('/api/users/register', userData)
        // Re-direct user to login on successful register
        .then(res => history.push('/login'))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }))
}

// Login - get user token
export const loginUser = userData => dispatch => {
    axios
         // I will change this to /api/users/login when I get a chance
        .post('/api/users/login', userData)
        .then(res => {
            // Save to sessionStorage

            // Set token to sessionStorage
            const {token} = res.data
            sessionStorage.setItem('jwtToken', token)
            
            // Set token to Auth header
            setAuthToken(token)

            // Decode token to get user data
            const decoded = jwt_decode(token)

            // Set current user 
            // look further down and you'll see where 
            // setCurrentUser is set up as a variable to
            // accept the SET_CURRENT_USER type
            dispatch(setCurrentUser(decoded))
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

// Set logged in user
export const setCurrentUser = decoded => {
    return{
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// User loading
export const setUserLoading = () => {
    return{
        type: USER_LOADING
    }
}

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from sessionStorage
    sessionStorage.removeItem('jwtToken')
    
    // Remove auth header for future requests
    setAuthToken(false)

    // Set current user to empty object {} which will
    // set isAuthenticate to false
    dispatch(setCurrentUser({}))
}