import axios, { AxiosError } from "axios";
import React, { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import FormInput from "../components/FormInput";

type RegisterData = {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    confirm_password: string
}

const Register = () => {
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [redirectLogin, setRedirectLogin] = useState<boolean>(false);
    const formElem = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        
        const data: RegisterData = {
            first_name: formElem.current?.first_name.value,
            last_name: formElem.current?.last_name.value,
            email: formElem.current?.email.value,
            password: formElem.current?.password.value,
            confirm_password: formElem.current?.confirm_password.value
        }

        try {
            await axios.post('/auth/register', data, {headers: {'content-type': 'application/json'}})
            setRedirectLogin(true);
        } catch (error) {
            const err = error as AxiosError;
            setError(true);
            setErrorMessage(err.response?.data);
        }
    }

    return (
        <>
            {redirectLogin ? <Navigate to="/login" /> : null}
            {error ? <p>{errorMessage}</p> : null}
            <form onSubmit={handleSubmit} ref={formElem}>
                <FormInput 
                    label="First name"
                    name="first_name"
                    type="text"
                    placeholder="Enter first name"
                    minLength={2}
                />
                <br />
                <FormInput 
                    label="Last name"
                    name="last_name"
                    type="text"
                    placeholder="Enter last name"
                    minLength={2}
                />
                <br />
                <FormInput 
                    label="Email"
                    name="email"
                    type="text"
                    placeholder="Enter email"
                    minLength={3}
                />
                <br />
                <FormInput 
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    minLength={3}
                />
                <br />
                <FormInput 
                    label="Confirm password"
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm password"
                    minLength={3}
                />
                <br />
                <div className="form-group">
                    <button type="submit" className="btn btn-info">Submit</button>
                </div>
            </form>
        </>
    )
}

export default Register;