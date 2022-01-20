import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IArticleAuthor } from "../utils/interfaces";

const ArticleAuthor: React.FC<{ author: IArticleAuthor }> = ({ author }) => {
    const [addedToFav, setAddedToFav] = useState<boolean>(author.addedToFav);
    const [authorError, setError] = useState<boolean>(false);

    const handleAddToFavClick = async () => {
        try {
            await axios.post(`/api/authors/favorites?author_id=${author.id}`);
            setAddedToFav(true);
            setError(false);
        } catch (error) {
            setError(true);
        }
    }

    return (
        <div className={"p-2"}>
            {
                author.standOut !== true && author.id ? 
                <p className="text-center">
                    <Link to={`/authors/${author.id}`}>
                        {author.first_name + ' ' + author.last_name}
                    </Link>
                </p>
                :
                <p className={"text-center"  + (author.standOut === true ? " border border-black rounded p-4" : "")}>{author.first_name + ' ' + author.last_name}</p>
            }
            {
                author.standOut === true ?
                null 
                :
                (
                    author.id ? 
                    (
                        addedToFav ? 
                        <p className="alert alert-success px-2 py-0 text-center">Added to fav</p> 
                        : 
                        <button onClick={handleAddToFavClick} className="btn btn-success btn-sm py-0" style={{"width" : "100%"}} type="button">Add to fav</button>
                    )
                    :
                    <p className="alert alert-warning px-2 py-0 text-center">No profile</p>
                )
            }
            {authorError ? <p className="alert alert-danger px-2 py-0 text-center mt-2">Error</p> : null}
        </div>
    )
}

export default ArticleAuthor;