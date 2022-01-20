import SearchBar from "./SearchBar";
import "./Header.css"
import ActiveLink from "./ActiveLink";
import { useContext } from "react";
import { UserContext } from "../utils/globalStates";
import { IUser } from "../utils/interfaces";

const Header = () => {
    const [userState, isLoading] = useContext<[IUser | undefined, boolean]>(UserContext);

    return (
        <header className="p-3 bg-dark text-white">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <div style={{"color": "gold", "marginRight": "20px"}}>SCIENCE RESEARCHERS</div>
                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <ActiveLink
                            href="/"
                            class="nav-link px-2 text-secondary margin-right-sm"
                            activeClass="active"
                            label="Home"
                        />
                        <ActiveLink
                            href="/profile"
                            class="nav-link px-2 text-white"
                            activeClass="active"
                            label="My profile"
                        />
                        <ActiveLink
                            href="/authors/favorites"
                            class="nav-link px-2 text-white"
                            activeClass="active"
                            label="My authors"
                        />
                    </ul>
                    {
                        isLoading ? 
                        null :
                        (userState === undefined ? 
                            <div className="text-end">
                                <ActiveLink 
                                    href="/login"
                                    class="btn btn-outline-light me-2"
                                    activeClass="active"
                                    label="Login"
                                />
                                <ActiveLink 
                                    href="/register"
                                    class="btn btn-warning"
                                    activeClass="active-register"
                                    label="Sign-up"
                                />
                            </div>
                            :
                            <SearchBar /> 
                        )
                    }
                </div>
            </div>
        </header>
    )
}

export default Header;