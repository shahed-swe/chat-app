import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../api/config";
import { useRouter } from "next/router";
import Link from "next/link";

const Register = () => {
    const router = useRouter();
    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    // State to store input values (username, email, password, confirmPassword)
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Redirect to home page if the user is already authenticated
    useEffect(() => {
        if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            router.push('/');
        }
    }, []);

    // Function to handle input changes and update the state
    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    // Function to validate the form before submitting
    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;
        if (password !== confirmPassword) {
            toast.error('Password and confirm password should be the same.', toastOptions);
            return false;
        } else if (username.length < 3) {
            toast.error('Username should be greater than 3 characters.', toastOptions);
            return false;
        } else if (password.length < 8) {
            toast.error('Password should be equal to or greater than 8 characters.', toastOptions);
            return false;
        } else if (email === '') {
            toast.error('Email is required.', toastOptions);
            return false;
        }

        return true;
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const { email, username, password } = values;
            const { data } = await axios.post(registerRoute, {
                username,
                email,
                password,
            });

            if (data.status === false) {
                toast.error(data.msg, toastOptions);
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

    // Render the Register component
    return (
        <>
            <div className="h-screen w-screen flex flex-col justify-center items-center bg-blue-900">
                <div className="brand flex items-center gap-4 justify-center">
                    <h1 className="text-white uppercase mb-5 text-lg">Chat App</h1>
                </div>
                {/* Registration form */}
                <form
                    action=""
                    onSubmit={(event) => handleSubmit(event)}
                    className="bg-black bg-opacity-60 rounded-2xl p-10 flex flex-col gap-8"
                >
                    {/* Input fields */}
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={(e) => handleChange(e)}
                        className="bg-transparent border border-blue-900 rounded px-4 py-2 text-white w-full"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => handleChange(e)}
                        className="bg-transparent border border-blue-900 rounded px-4 py-2 text-white w-full"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                        className="bg-transparent border border-blue-900 rounded px-4 py-2 text-white w-full"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={(e) => handleChange(e)}
                        className="bg-transparent border border-blue-900 rounded px-4 py-2 text-white w-full"
                    />
                    {/* Submit button */}
                    <button
                        type="submit"
                        className="bg-blue-900 text-white font-bold py-2 px-8 rounded uppercase hover:bg-blue-800"
                    >
                        Create User
                    </button>
                    {/* Login link */}
                    <span className="text-white uppercase">
                        Already have an account ?{' '}
                        <Link href="/login">
                            <span className="text-blue-900 font-bold">Login.</span>
                        </Link>
                    </span>
                </form>
            </div>
            {/* Toast container for displaying error messages */}
            <ToastContainer />
        </>
    );
};

export default Register;
