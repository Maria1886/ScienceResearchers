import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IAuthor } from "../utils/interfaces";

const FavAuthor: React.FC<{author: IAuthor}> = ({ author }) => {
    const [removed, setRemoved] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const handleRemoveFavAuthor = async () => {
        try {
            await axios.delete(`/api/authors/favorites?author_id=${author.id}`);
            setRemoved(true);
        } catch (error) {
            setError(true);
        }
    }

    return (
        <div className="row border border-black rounded p-3 mb-3">
            <div className="col-6">
                <h2 className="m-0">{author.first_name + ' ' + author.last_name}</h2>
            </div>
            <div className="col-6">
                <Link 
                    to={`/authors/${author.id}`}
                    className="btn btn-primary"
                    style={{"float": "right", "marginLeft": "10px"}}
                >See profile</Link>
                {
                    removed ?
                    <p className="alert alert-warning px-2 py-0 text-center m-0 mt-2" style={{"float": "right"}}>Author removed, refresh to dissapear.</p>
                    :
                    <button onClick={handleRemoveFavAuthor} className="btn btn-danger" style={{"float": "right"}}>Remove</button>
                }
                {
                    error ?
                    <p className="alert alert-danger px-2 py-0 text-center" style={{"float": "right", "margin": "7px 10px 0 0"}}>Error</p>
                    :
                    null
                }
            </div>
        </div>
    )
}

export default FavAuthor;