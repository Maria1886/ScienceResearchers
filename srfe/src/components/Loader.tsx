import Loader from "react-loader-spinner"


const LoaderComponent: React.FC<{ type: "Audio" | "BallTriangle" | "Bars" | "Circles" | "Grid" | "Hearts" | "Oval" | "Puff" | "Rings" | "TailSpin" | "ThreeDots" | "Watch" | "RevolvingDot" | "Triangle" | "Plane" | "MutatingDots" | "CradleLoader" }> = ({ type }) => {
    return (
        <div className="d-flex align-items-start flex-row flex-wrap justify-content-around mt-3">
            <Loader type={type}/>
        </div>
    )
}

export default LoaderComponent;