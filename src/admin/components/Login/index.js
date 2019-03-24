import React, { useState, useEffect } from "react"
import { AuthenticateUser, CheckTokenAuthentication } from '../../util'

const Login = ({history}) => {
    const [ username, setUsername ] = useState()
    const [ password, setPassword ] = useState()
    const [ isLoading, setIsLoading ] = useState(false)
    const [ loginError, setLoginError ] = useState({
        show: false,
        message: ''
    })

    useEffect(() => {
        checkAuthentication()
    }, [])
    
    const checkAuthentication = async () => {
        const { authenticated } = await CheckTokenAuthentication()

        if (authenticated) {
            history.push({ pathname: '/admin/view-all' })
        }
    }

    const loginUser = async (event, username, password) => {
        event.preventDefault()

        setIsLoading(true)

        const { authenticated, message } = await AuthenticateUser(username, password)
        
        setIsLoading(false)

        authenticated? history.push({pathname: '/admin/view-all'}) : setLoginError({ show: true, message })
    }

    return (
        <div className="login">
            {loginError.show && <p className="warning">{loginError.message}</p>}
            <form onSubmit={event => loginUser(event, username, password)} >
                <h2>Login</h2>
                <input type="email" name="username" placeholder="Username" autoComplete="email" onChange={event => {
                    setUsername(event.target.value)
                    setLoginError({show: false})
                    }}/>
                <input type="password" name="password" placeholder="Pasword" autoComplete="current-password" onChange={event => {
                    setPassword(event.target.value)
                    setLoginError({show: false})
                    }}/>
                <input type="submit" value="Submit" disabled={isLoading}/>
            </form>
        </div>
    )
}

export default Login;