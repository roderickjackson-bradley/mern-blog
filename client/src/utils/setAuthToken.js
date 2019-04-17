import axios from 'axios'

const setAuthToken = token => {
    if(token){
        // Apply authorization token to every request if logged in 
        // Ok so I'm taking a lucky guess with this,
        // This piece of code is going to place the token to the
        // XMLHttpRequest header on every request
        // We want this token so the user can refresh the browser
        // And still be logged in on both browser and mobile devices
        axios.defaults.headers.common['Authorization'] = token
    }
    else{
        // Delete auth header
        delete axios.defaults.headers.common['Authorization']
    }
}

export default setAuthToken