import { useEffect, useState } from 'react';
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import './LoginRegister.css';

const API = 'http://localhost:8080';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [fields, setFields] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [redirectPage, setRedirect] = useState(false);
    const [val, add] = useState(9);

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

    const changeReq = async () => {
        fetch(`${API}/signup`, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify({ email: fields.email, password: fields.password })
        })
            .then((res) => {
                console.log("response.messgae", response);
                return res.json()
            })
            .then(response => {
                console.log("response.messgae", response.message);
                setMessage(response.message);
                resetFields('changepassword');
                setRedirect(true);
                add(8);
            })
            .catch(err => {
                setMessage(err.message);
                throw new Error(err)
            })

        // const options = {
        //     mode: 'cors',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     method: "PUT",
        //     body: JSON.stringify({ email: fields.email, password: fields.password })
        // }

        // const data = await fetch(`${API}/signup`, options)
        // const response = await data.json();

        // setMessage(response.message);
        // resetFields('changepassword');
        // setRedirect(true);

        // console.log("tttttttttttt", data, response);
    }

    // useEffect(()=>{
    //     console.log("no", redirectPage)
    //     if(redirectPage) {
    //         console.log("yes", redirectPage)
    //         navigate('/auth');
    //     }
    // }, [redirectPage]);

    console.log("redirect: ", redirectPage, val);

    return (
        <div className="auth-form">
            <div className="wrapper password">
                <div className="form-box login">
                    <form id="changepassword" onSubmit={changeReq}>
                        <h1>Change Password</h1>
                        <div className="input-box">
                            <input type="email" placeholder="Email" required onChange={(e) => getFormFields('email', e)} />
                            <FaEnvelope className="icon" />
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

