import { Icon } from "monday-ui-react-core"
import { MoveArrowRight } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { Link, useNavigate } from "react-router-dom"
import { useRef, useState, useEffect } from "react"
import { signup } from "../store/actions/user.action"
import { showSuccessMsg } from "../services/event-bus.service"
import { MsgModalSuccess } from "../cmps/MsgModalSuccess"
import { uploadService } from "../services/upload.service"

function getEmptyCredentials() {
    return {
        fullname: '',
        username: '',
        password: '',
        imgUrl: 'https://cdn1.monday.com/dapulse_default_photo.png'
    }
}

export function Signup() {

    const [credentials, setCredentials] = useState(getEmptyCredentials())
    const fileInputRef = useRef(null)
    const navigate = useNavigate()
    let timeoutId

    useEffect(() => {
        return () => {
            clearTimeout(timeoutId)
        }
    }, [])

    function handleCredentialsChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials(credentials => ({ ...credentials, [field]: value }))
    }

    function handleUpload() {
        fileInputRef.current.click()
    }

    async function handleFileChange(ev) {
        const avatarImg = await uploadService.uploadImg(ev)
        setCredentials(credentials => ({ ...credentials, imgUrl: avatarImg.url }))
    }

    async function onSubmit() {
        if (!credentials.fullname || !credentials.username || !credentials.password) {
            showSuccessMsg('Please fill all the fields above')
            return
        }
        try {
            const user = await signup(credentials)
            navigate('/board')
            timeoutId = setTimeout(() => {
                showSuccessMsg(`Welcome ${user.fullname}, you successfully sign up`)
            }, 500)
            return user
        } catch (err) {
            console.log('ShowErrorMsg')
            throw err
        }
    }

    return (
        <section className="sign-up">
            <div className="sign-up-container">
                <div className="content">
                    <div className="heading">
                        <h1 className="title">Welcome to workit</h1>
                        <h2 className="sub-title">Get started - it's free. No credit card needed.</h2>
                    </div>
                    <div className="sign-up-fields">
                        <div className="label-container">
                            <span className="label">
                                Username
                            </span>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="username"
                                    onChange={handleCredentialsChange} />
                            </div>
                        </div>
                        <div className="label-container">
                            <span className="label">
                                Password
                            </span>
                            <div className="input-container">
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleCredentialsChange} />
                            </div>
                        </div >
                        <div className="label-container">
                            <span className="label">
                                Fullname
                            </span>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="fullname"
                                    onChange={handleCredentialsChange} />
                            </div>
                        </div>
                        <div className="upload-btn-container">
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={(ev) => handleFileChange(ev)} />
                            <button
                                className="upload-btn"
                                onClick={handleUpload}>
                                Upload avatar img
                            </button>
                        </div>
                        <button className="sign-up-btn" onClick={onSubmit}>
                            <span className="btn-text">
                                Sign up
                            </span>
                            <Icon className="arrow-icon" icon={MoveArrowRight} />
                        </button>
                    </div>
                </div>
                <div className="login-container">
                    <div className="container">
                        <h5 className="login-title">Already have an account?</h5>
                        <Link className="flex align-center" to='/login'>
                            <span>
                                Log in
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="aside-img-container">
                <img src="https://dapulse-res.cloudinary.com/image/upload/monday_platform/signup/signup-right-side-assets-new-flow/welcome-to-monday.png" alt="" />
            </div>
            <MsgModalSuccess />
        </section>
    )
}