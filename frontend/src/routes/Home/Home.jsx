import { Outlet } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import Utilities from "./Utilities";

const Home = () => {
    return (
        <div className='flex flex-row h-full'>
            <aside className='flex flex-col w-1/5 h-full'>
                <p className='text-2xl text-white py-10 font-major'>TENNIS HEAT</p>
                {/* <h1 className='text-3xl font-bold py-10 text-white'>Logo</h1> */}
                <SidebarNav />
            </aside>
            <div className='w-4/5 flex flex-col h-full'>
                <Utilities />
                <Outlet />
            </div>
        </div>
    )
};

export default Home;