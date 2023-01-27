import React, { useState } from 'react';
import styles from "./auth.module.scss";
import { BiLogIn } from "react-icons/bi";
import Card from '../../components/card/Card';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { SET_LOGIN, SET_NAME, SET_USER } from '../../redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';
import { loginUser, validateEmail } from '../../services/authService';
import { toast } from 'react-toastify';


const initialState = {
    email: "",
    password: "",
}

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const { email, password } = formData;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const login = async (e) => {
        e.preventDefault();
        // console.log(formData);

        // Validation
        if (!email || !password) {
            return toast.error("All field are required");
        };

        if (password.length < 6) {
            return toast.error("Password must be 6 character or more")
        };

        if (!validateEmail(email)) {
            return toast.error("Please enter validate email");
        }

        const userData = { email, password };
        setIsLoading(true);
        try {
            const data = await loginUser(userData);
            await dispatch(SET_LOGIN(true));
            await dispatch(SET_NAME(data.name));
            navigate("/dashboard");
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            // console.log(error.message);
        }
    };

    return (
        <div className={`container ${styles.auth}`}>
            {isLoading && <Loader/>}
            <Card>
                <div className={styles.form}>
                    <div className='--flex-center'>
                        <BiLogIn size={35} color="#999" />
                    </div>
                    <h2>Login</h2>
                    <form onSubmit={login}>
                        <input type="email" placeholder='Email' required name='email' value={email} onChange={handleInputChange} />
                        <input type="Password" placeholder='Password' required name='password' value={password} onChange={handleInputChange} />
                        <button type='submit' className='--btn --btn-primary --btn-block'>Login</button>
                    </form>
                    <Link to="/forgot">Forgot Password</Link>
                    <span className={styles.register}>
                        <Link to="/">Home</Link>
                        <p>&nbsp; Don't have a account? &nbsp;</p>
                        <Link to="/register">Register</Link>
                    </span>
                </div>
            </Card>
        </div>
    )
}

export default Login