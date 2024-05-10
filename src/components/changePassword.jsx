import { useState } from 'react';
import { FaUser, FaLock } from "react-icons/fa";
import Snackbar from '@mui/material/Snackbar';
import './LoginRegister.css';

const API = 'http://localhost:8080';

const ChangePassword = () => {
    const [fields, setFields] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleClose = () => {
        setMessage("");
    };

    const resetFields = (type) => {
        document.getElementById(type).reset();
    }

    const getFormFields = (type, e) => {
        let val = e.target.value;

        const data = fields;
        data[type] = val;
        console.log("data", data);
        setFields(data);
    }

    const changeReq = () => {
        fetch(`${API}/signup`, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify({ email: fields.email, password: fields.password })
        })
            .then((res) => {
                return res.json()
            })
            .then(response => {
                setMessage(response.message);
                resetFields('changepassword');
            })
            .catch(err => {
                setMessage(err.message);
                throw new Error(err)
            })
    }

    return (
        <div className="auth-form">
            <div className="wrapper password">
                <div className="form-box login">
                    <form id="changepassword" onSubmit={changeReq}>
                        <h1>Change Password</h1>
                        <div className="input-box">
                            <input type="text" placeholder="username" required onChange={(e) => getFormFields('username', e)} />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="password" placeholder="password" required onChange={(e) => getFormFields('password', e)} />
                            <FaLock className="icon" />
                        </div>

                        <button type="submit">Change password</button>
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

export default ChangePassword;

