import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {loginUser} from '../actions/authActions'
import classnames from 'classnames'

class Login extends Component{
    /* I need to create a constructor function and call super in order
     * to get access to the "this" method.
     * This method isn't limited to react
     */
    constructor(){
        super()
        // This the start of state machine
        // intial state is an empty string and an empty "errors" object
        this.state = {
            email: '',
            password: '',
            errors: {} 
        }
    }

    componentDidMount(){
        // If logged in and user navigates to 
        // Login page, should redirect them to dashboard
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/dashboard')
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.auth.isAuthenticated){
            // push user to dashboard when they login
            this.props.history.push('/dashboard')
        }

        if(nextProps.errors){
            this.setState({
                errors: nextProps.errors
            })
        }
    }

    // Think of this as an event handler. It's tells the form what to do with the submitted data
    // In this instance we are targeting the object properties of our User Model and the values
    // that the user enters
    onChange = e => {
        // This will target Key/Value as in target "name: Roderick Jacksons Brason Son"
        this.setState({[e.target.id]: e.target.value}) // Man! huge source of headache right here!!
    }
    
    // Submit event will accept the data the user enters
    // The e.preventDefault() method will cancel the event if it is                            
    // cancelable, meaning that the default action that belongs to  
    // the event won't occur.
    onSubmit = e => {
        e.preventDefault()

        const userData = {
            email: this.state.email,
            password: this.state.password,
        }
    this.props.loginUser(userData)
    } 

    // RENDERING Below HOMIE WHAT WE CODED ABOVE ^
    
    render(){
        // this will catch the errors and put them in that empty object we created up top
        const {errors} = this.state

        return(
            <div className='container'>
                <div className='row'>
                    <div className='col s8 offset-s2'>
                        <Link to='/' className='btn-flat waves-effect'>
                            <i className='material-icons left'>keyboard_backspace</i>
                            Back to Home                       
                        </Link>
                        <div className='col s12' style={{paddingLeft: '11px'}}>
                            <h4><b>Login</b>below</h4>
                            <p className='gret-text text-darken-1'>
                                Don't have an account?
                                <Link to='/register'>Register</Link>
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className='input-field col s12'>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id='email'
                                    type='email'
                                    className={classnames('', {
                                        invalid: errors.email || errors.emailnotfound
                                    })}
                                />
                                <label htmlFor='email'>Email</label>
                                <span className='red-text'>
                                    {errors.email}
                                    {errors.emailnotfound}
                                </span>
                            </div>
                            <div className='input-field col s12'>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id='password'
                                    type='password'
                                    className={classnames('', {
                                        invalid: errors.password || errors.passwordincorrect
                                    })}
                                />
                                <label htmlFor='password'>Password</label>
                                <span className='red-text'>
                                    {errors.password}
                                    {errors.passwordincorrect}
                                </span>
                            </div>
                            <div className='col s12' style={{padding: '11'}}>
                                <button style={{
                                    width: '150',
                                    borderRadius: '3',
                                    letterSpacing: '1.5',
                                    marginTop: '1rem'
                                }}
                                    type='submit' 
                                    className='btn btn-large waves-effect 
                                    waves-light hoverable blue accent-3'
                                > 
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(
    mapStateToProps,
    {loginUser}    
)(Login)