import { useSearchParams } from "react-router-dom";
import LoaderComponent from "../components/Loader";
import { ICatalog } from "../utils/interfaces";
import Catalog from '../components/Catalog';
import useFetchData from "../hooks/useFetchData";
import { HttpMethods } from "../utils/httpMethods";

const Search = () => {
    const [searchParams] = useSearchParams();
    const { data, isLoading } = useFetchData<Array<ICatalog>>(HttpMethods.POST, "/api/articles/search", { keywords: searchParams.get("keywords") });

    if (isLoading) {
        return <LoaderComponent type="Circles" />
    }

    if (data === undefined) {
        return <h1>Something went wrong.</h1>;
    }

    return (
        <>
            <div>
                {data.map((cat, i) =>
                    <Catalog catalog={cat} id={i + 1} key={i}/>
                )}
            </div>
        </>
    )
}

export default Search;