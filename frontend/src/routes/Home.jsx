import { Outlet } from "react-router-dom";

const Home = () => {
    return (
        <>
            <h1 className="text-3xl font-bold underline">Home</h1>
            <Outlet />
        </>
    )
};

export default Home;