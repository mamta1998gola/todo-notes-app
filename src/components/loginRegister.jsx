import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import './LoginRegister.css';

const API = 'http://localhost:8080';


const LoginRegister = () => {
    const [action, setAction] = useState('');
    const [fields, setFields] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [message, setMessage] = useState('');

    const handleClose = () => {
        setMessage("");
    };

    const registerLink = () => {
        setAction('active');
    }

    const loginLink = () => {
        setAction('');
    }

    const resetFields = (type) => {
        document.getElementById(type).reset();
    }

    const getFormFields = (type, e) => {
        let val = e.target.value;

        const data = fields;
        data[type] = val;

        setFields(data);
    }

    const submitData = () => {
        fetch(`${API}/signup`, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ ...fields })
        })
            .then((res) => {
                return res.json()
            })
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.token));
                resetFields('registerform');
            })
            .catch(err => {
                setMessage(err.message);
                throw new Error(err)
            })
    }

    const loginReq = () => {
        fetch(`${API}/signin`, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ email: fields.email, password: fields.password })
        })
            .then((res) => {
                return res.json()
            })
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.token));
                resetFields('loginform');
            })
            .catch(err => {
                setMessage(err.message);
                throw new Error(err)
            })
    }

    return (
        <div className="auth-form">
            <div className={`wrapper ${action}`}>
                <div className="form-box login">
                    <form id="loginform" onSubmit={loginReq}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input type="text" placeholder="username" required onChange={(e) => getFormFields('username', e)} />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="password" placeholder="password" required onChange={(e) => getFormFields('password', e)} />
                            <FaLock className="icon" />
                        </div>

                        <div className="remember-forgot">
                            <label htmlFor="checkbox">
                                <input type="checkbox" />
                                Remember me
                            </label>
                            <Link to="/changepassword">Forgot password</Link>
                        </div>

                        <button type="submit">Login</button>

                        <div className="register-link">
                            <p>Don't have an account? <a href="#" onClick={() => registerLink('/changepassword')}>Register</a></p>
                        </div>
                    </form>
                </div>

                <div className="form-box register">
                    <form id="registerform" onSubmit={submitData}>
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input type="text" placeholder="username" required onChange={(e) => getFormFields('username', e)} />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="email" placeholder="Email" required onChange={(e) => getFormFields('email', e)} />
                            <FaEnvelope className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="password" placeholder="password" required onChange={(e) => getFormFields('password', e)} />
                            <FaLock className="icon" />
                        </div>

                        <div className="remember-forgot">
                            <label htmlFor="checkbox">
                                <input type="checkbox" />
                                I agree to terms & conditions
                            </label>
                        </div>

                        <button type="submit">Register</button>

                        <div className="register-link">
                            <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                        </div>
                    </form>
                </div>
            </div>
            {
                message && <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={!!message}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    message={message}
                />
            }
        </div>
    )
}

export default LoginRegister;
