import axios, { AxiosError } from "axios";
import React, { useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const SearchBar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    let { pathname } = useLocation();
    const navigate = useNavigate();
    const formElem = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (pathname === "/search"){
            setSearchParams({keywords: formElem.current?.keywords.value})
            window.location.reload();
        } else {
            navigate(`/search?keywords=${formElem.current?.keywords.value}`)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} ref={formElem} className="col-11 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                <input name="keywords" type="search" defaultValue={searchParams.get("keywords") || ""} className="form-control form-control-dark" placeholder="Search catalogs..." aria-label="Search" />
            </form>
            <button onClick={handleSubmit} type="submit" className="btn btn-warning">Search</button>
        </>
    )
}

export default SearchBar;