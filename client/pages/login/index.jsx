import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../api/config";
import Link from "next/link";
import { useRouter } from "next/router";

const Login = () => {
    const router = useRouter();
    const [values, setValues] = useState({ username: '', password: '' });

    useEffect(() => {
        if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            router.push('/');
        }
    }, []);

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const validateForm = () => {
        const { username, password } = values;
        if (username === '' || password === '') {
            toast.error('Email and Password is required.', {
                position: 'bottom-right',
                autoClose: 8000,
                pauseOnHover: true,
                draggable: true,
                theme: 'dark',
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const { username, password } = values;
            const { data } = await axios.post(loginRoute, {
                username,
                password,
            });
            if (data.status === false) {
                toast.error(data.msg, {
                    position: 'bottom-right',
                    autoClose: 8000,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'dark',
                });
            }
            if (data.status === true) {
                localStorage.setItem(
                    process.env.REACT_APP_LOCALHOST_KEY,
                    JSON.stringify(data.user)
                );

                router.push('/');
            }
        }
    };

    return (
        <>
            <div className="h-screen w-screen flex flex-col justify-center items-center bg-blue-900">
                <div className="brand flex items-center gap-4 justify-center">
                    {/* <img src={Logo.src} alt="logo" className="h-20" /> */}
                    <h1 className="text-white text-xl uppercase mb-5">Chat App</h1>
                </div>
                <form
                    action=""
                    onSubmit={(event) => handleSubmit(event)}
                    className="bg-black bg-opacity-60 rounded-2xl p-10 flex flex-col gap-8"
                >
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={(e) => handleChange(e)}
                        className="bg-transparent border border-blue-900 rounded px-4 py-2 text-white w-full"
                        min="3"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                        className="bg-transparent border border-blue-900 rounded px-4 py-2 text-white w-full"
                    />
                    <button
                        type="submit"
                        className="bg-blue-900 text-white font-bold py-2 px-8 rounded uppercase hover:bg-blue-800"
                    >
                        Log In
                    </button>
                    <span className="text-white uppercase">
                        Don't have an account ?{' '}
                        <Link href="/register">
                            <span className="text-blue-900 font-bold">Create One.</span>
                        </Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    );
};

export default Login;