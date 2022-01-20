import axios, { AxiosError } from "axios";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import LoaderComponent from "../components/Loader";
import { UserContext } from "../utils/globalStates";


const Profile = () => {
    const navigate = useNavigate();
    const [profileError, setError] = useState<boolean>(false);
    const [nameUpdated, setNameUpdated] = useState<boolean>(false);
    const [userState] = useContext(UserContext);
    const formElem = useRef<HTMLFormElement>(null);


    const handleLogout = async () => {
        try {
            await axios.get("/auth/logout");
            navigate('/');
        } catch (error) {
            setError(true);
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('/auth/delete');
            navigate('/');
        } catch (error) {
            setError(true);
        }
    }

    const handleUpdateName = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const data = {
            first_name: formElem.current?.first_name.value,
            last_name: formElem.current?.last_name.value,
        }

        try {
            await axios.post('/auth/update', data, {headers: {'content-type': 'application/json'}})
            setError(false);
            setNameUpdated(true);
        } catch (error) {
            setError(true);
            setNameUpdated(false);
        }
    }

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    {
                        profileError ? 
                        <p className="alert alert-danger">Something went wrong.</p>
                        :
                        (
                            nameUpdated ?
                            <p className="alert alert-success">Name updated successfully.</p>
                            :
                            null
                        )
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <form onSubmit={handleUpdateName} ref={formElem}>
                        <FormInput 
                            label="First name" 
                            name="first_name" 
                            type="text" 
                            defaultValue={userState!.first_name}
                            minLength={2}
                        />
                        <br />
                        <FormInput 
                            label="Last name" 
                            name="last_name" 
                            type="text" 
                            defaultValue={userState!.last_name}
                            minLength={2}
                        />
                        <br />
                        <div className="form-group">
                            <button type="submit" className="btn btn-info">Submit</button>
                        </div>
                    </form>
                </div>
    
                <div className="col-8">
                    <button onClick={handleLogout} className="btn btn-dark" style={{"float": "right"}}>Logout</button>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <button onClick={handleDeleteAccount} className="btn btn-danger" style={{"float": "right"}}>Delete account</button>
                </div>
            </div>
        </div>
    )
}

export default Profile;