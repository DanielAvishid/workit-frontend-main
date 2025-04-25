import { Icon } from "monday-ui-react-core"
import { MoveArrowRight, DisabledUser } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { MsgModalSuccess } from "../cmps/MsgModalSuccess"
import { login } from "../store/actions/user.action"
import { showSuccessMsg } from "../services/event-bus.service"
import { utilService } from "../services/util.service"

export function Login() {

    const [credentials, setCredentials] = useState(utilService.getEmptyUserCredentials())
    const navigate = useNavigate()
    let timeoutId
    let guestTimeoutId

    useEffect(() => {
        return () => {
            clearTimeout(timeoutId)
        }
    }, [])

    function handleKeyPress(ev) {
        if (ev.key === 'Enter') {
            console.log('enter clicked');
            onSubmit()
        }
    }

    function handleCredentialsChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials(credentials => ({ ...credentials, [field]: value }))
    }

    async function onGuestClick() {
        try {
            const user = await login({ username: "Guest", password: "1234" })
            navigate('/board')
            guestTimeoutId = setTimeout(() => {
                showSuccessMsg(`Welcome Guest, you successfully logged in`)
                clearTimeout(guestTimeoutId)
            }, 500)
            return user
        } catch (err) {
            console.log('ShowErrorMsg')
            throw err
        }
    }

    async function onSubmit() {
        if (!credentials.username || !credentials.password) {
            showSuccessMsg('Please fill all the fields above')
            return
        }
        try {
            const user = await login(credentials)
            navigate('/board')
            timeoutId = setTimeout(() => {
                showSuccessMsg(`Welcome ${user.fullname}, you successfully logged in`)
            }, 500)
            return user
        } catch (err) {
            console.log('ShowErrorMsg')
            throw err
        }
    }

    return (
        <section className="login">
            <div className="login-header">
                <div className="logo-container" onClick={() => navigate('/')}>
                    <img className="logo" src="https://res.cloudinary.com/dvcgvn34o/image/upload/v1699389325/monday-logo_oxvnvi.svg" alt="" />
                    <span className="brand-name">workit</span>
                </div>
            </div>
            <div className="login-content">
                <div className="login-section">
                    <h1 className='login-title'><b>Log</b> In</h1>
                    <div className='login-container'>
                        <div className="label-container">
                            <span className="label">Username</span>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="username"
                                    onChange={handleCredentialsChange}
                                    onKeyDown={handleKeyPress} />
                            </div>
                        </div>
                        <div className="label-container">
                            <span className="label">Password</span>
                            <div className="input-container">
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleCredentialsChange}
                                    onKeyDown={handleKeyPress} />
                            </div>
                        </div >
                        <div className="login-btn-container">
                            <button className="login-btn" onClick={onSubmit}>
                                <span className="btn-text">Log in</span>
                                <Icon className="arrow-icon" icon={MoveArrowRight} />
                            </button>
                        </div>
                    </div>
                    <div className="login-separator">
                        <span className="separator-line"></span>
                        <h2 className="guest-title">Or Sign in as</h2>
                        <span className="separator-line"></span>
                    </div>
                    <button className="guest-btn" onClick={onGuestClick}>
                        <Icon className="guest-icon" icon={DisabledUser} />
                        <span>Guest</span>
                    </button>
                    <div className="sign-up-container">
                        <span>Don't have an account yet?</span>
                        <Link className="flex align-center" to='/sign_up'>
                            <span className="sign-up-link">Sign up</span>
                        </Link>
                    </div>
                </div>
            </div>
            <MsgModalSuccess />
        </section>
    )
}