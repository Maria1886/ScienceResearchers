import { Link, useLocation } from "react-router-dom";

interface Props {
    href: string,
    class?: string,
    activeClass?: string,
    label: string
}

const ActiveLink: React.FC<Props> = (props) => {
    let { pathname } = useLocation();

    return (
        <Link 
            to={props.href}
            className={props.class + ' ' + (pathname == props.href? props.activeClass : "")}
        >{props.label}</Link>
    )
}

export default ActiveLink;