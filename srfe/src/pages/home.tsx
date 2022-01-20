import { useContext } from "react";
import LoaderComponent from "../components/Loader";
import { UserContext } from "../utils/globalStates";

const Home = () => {
    const [userState, isLoading] = useContext(UserContext);

    if (isLoading) {
        return <LoaderComponent type="Circles" />
    }

    return (
        <div>
            {
                userState === undefined ?
                <>
                    <p className="alert alert-primary">Your personal science Researchers/Authors management app.</p>
                    <p className="alert alert-success">Please login or create an account to access the benefits of Science Researches for free.</p>
                </>
                :
                <>
                    <p className="alert alert-success">Congratulations, you are now a valuable user!</p>
                    <p className="alert alert-primary">Start searching for articles and discover new authors.</p>
                    <p className="alert alert-warning">You can see your list of favorite authors in "My authors" section.</p>
                </>
            }
        </div>
    )
}

export default Home;