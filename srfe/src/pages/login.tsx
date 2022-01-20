import React, { useState } from "react";
import { useRef } from "react";
import axios, { AxiosError } from "axios";
import FormInput from "../components/FormInput";

type LoginData = {
    email: string,
    password: string
}

const Login = () => {
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const formElem = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const data: LoginData = {
            email: formElem.current?.email.value,
            password: formElem.current?.password.value
        }

        try {
            await axios.post('/auth/login', data, {headers: {'content-type': 'application/json'}});
            window.location.assign("/");
        } catch (error) {
            const err = error as AxiosError;
            setError(true);
            setErrorMessage(err.response?.data);
        }
    }

    return (
        <>
            {error ? <p>{errorMessage}</p> : null}
            <form onSubmit={handleSubmit} ref={formElem}>
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
                <div className="form-group">
                    <button type="submit" className="btn btn-info">Submit</button>
                </div>
            </form>
        </>
    )
}

export default Login;