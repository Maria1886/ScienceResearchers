import { IAuthorProfile, ICatalog } from "../utils/interfaces";
import { useParams } from "react-router-dom";
import LoaderComponent from "../components/Loader";
import useFetchData from "../hooks/useFetchData";
import { HttpMethods } from "../utils/httpMethods";
import { useEffect, useState } from "react";
import axios from "axios";
import Catalog from "../components/Catalog";


const AuthorProfile = () => {
    const { authorId } = useParams();
    const { data: authorProfile, isLoading: isLoadingProfile, setUrl: setProfileUrlRefresh} = useFetchData<IAuthorProfile>(HttpMethods.GET, `/api/authors/${authorId}`);
    const { data: articles, isLoading: isLoadingArticles, setUrl: setArticlesUrlRefresh } = useFetchData<Array<ICatalog>>(HttpMethods.GET, `/api/articles/authored_by?author_id=${authorId}`);
    const [justAddedToFav, setAddedToFav] = useState<boolean>(false);
    const [authorError, setError] = useState<boolean>(false);
    const [showArticles, setShowArticles] = useState<boolean>(false);

    useEffect(() => {
        setProfileUrlRefresh(`/api/authors/${authorId}`);
        setArticlesUrlRefresh(`/api/articles/authored_by?author_id=${authorId}`);
        setAddedToFav(false);
        setError(false);
        setShowArticles(false);
    }, [authorId])

    const handleAddToFavClick = async () => {
        try {
            await axios.post(`/api/authors/favorites?author_id=${authorProfile?.id}`);
            setAddedToFav(true);
            setError(false);
        } catch (error) {
            setError(true);
        }
    }

    const handleShowArticles = () => {
        setShowArticles(true);
    }

    const handleHideArticles = () => {
        setShowArticles(false);
    }

    if (isLoadingProfile) {
        return <LoaderComponent type="Circles" />;
    }

    if (authorProfile === undefined) {
        return <p className="alert alert-danger">Something went wrong</p>
    }

    return (
        <>
            <div className="border border-primary rounded p-3">
                <div className="row">
                    <div className="col-8">
                        <img src={authorProfile.photo} alt="profile-photo" style={{"width": "130px", "height": "130px"}}/>
                        <span className="h2 m-0 mx-4">{authorProfile.displayName}</span>
                    </div>
                    <div className="col-4">
                        {
                            showArticles ? 
                            <button onClick={handleHideArticles} className="btn btn-secondary" style={{"float": "right", "marginLeft": "10px"}}>Hide articles</button>
                            :
                            <button onClick={handleShowArticles} className="btn btn-primary" style={{"float": "right", "marginLeft": "10px"}}>Show articles</button>
                        }
                        {
                            authorProfile.addedToFav || justAddedToFav ?
                            <p className="alert alert-success px-2 py-0 text-center mt-2" style={{"float": "right", "marginLeft": "10px"}}>Added to fav</p> 
                            :
                            <button onClick={handleAddToFavClick} className="btn btn-success" style={{"float": "right", "marginLeft": "10px"}}>Add la fav</button>
                        }
                        {
                            authorError ? 
                            <p className="alert alert-danger px-2 py-0 text-center mt-2" style={{"float": "right"}}>Error</p> 
                            : 
                            null
                        }
                    </div>
                </div>
                <div className="row col-12 mt-4">
                    <div className="col-12">
                        <span className="h4">Academic status: </span><span className="h5">{authorProfile.academicStatus}</span>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <span className="h4">Disciplines: </span>{authorProfile.disciplines.map((dis, i) => <span className="h5" key={i}>{dis + (i < authorProfile.disciplines.length - 1 ?  " | " : "")}</span>)}
                    </div>
                </div>
            </div>
            {
                showArticles ?
                (
                    isLoadingArticles ?
                    <LoaderComponent type="Circles" />
                    :
                    (
                        articles === undefined ?
                        <p className="alert alert-danger px-2 py-0 text-center mt-2" style={{"float": "right"}}>Error</p> 
                        :
                        <div>
                            <br />
                            {
                                articles.length > 0 ?
                                articles.map((cat, i) =>
                                    <Catalog catalog={cat} id={i + 1} key={i}/>
                                )
                                :
                                <h2>No articles.</h2>
                            }
                        </div>
                    )
                )
                :
                null
            }
            
        </>                
    )
}

export default AuthorProfile;