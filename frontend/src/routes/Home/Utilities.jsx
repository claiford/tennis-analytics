import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "../../api";

const pathIcons = {
    dashboard: '🏠'
}

const Utilities = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split("/");

    let pathString = ''
    for (const page of path) {
        if (page) {
            pathString += ` / ${pathIcons[page] ?? page}`
        }
    }

    const handleLogout = () => {
        signOut()
        console.log("SIGNED OUT")
        navigate("/login")
    }

    return (
        <div className='flex flex-row w-full py-5 px-8 justify-between'>
            <div className='text-white'>
                <p>Pages{pathString}</p>
            </div>
            <div className='flex-none'>
                <span onClick={handleLogout}>🙍</span>
                <span>⚙️</span>
            </div>
        </div>
    )
};

export default Utilities;