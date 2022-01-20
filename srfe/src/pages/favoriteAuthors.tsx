import FavAuthor from "../components/FavoriteAuthor";
import LoaderComponent from "../components/Loader";
import useFetchData from "../hooks/useFetchData";
import { HttpMethods } from "../utils/httpMethods";
import { IAuthor } from "../utils/interfaces";

const FavoriteAuthors = () => {
    const { data, isLoading } = useFetchData<Array<IAuthor>>(HttpMethods.GET, '/api/authors/favorites');

    if (isLoading) {
        return <LoaderComponent type="Circles" />
    }

    if (data === undefined) {
        return <h1>Something went wrong.</h1>;
    }

    return (
        <div>
            {data.map((author, i) => <FavAuthor author={author} key={i} />)}
        </div>
    )
}

export default FavoriteAuthors;