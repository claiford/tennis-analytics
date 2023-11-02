import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { signOut, getUserInfo } from "../../api";

const pathIcons = {
    dashboard: '🏠'
}

const Utilities = () => {
    const [currentUser, setCurrentUser] = useState(null)

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

    useEffect(() => {
        getUserInfo().then((res) => {
            setCurrentUser(res)
        })
    }, [])

    return (
        <div className='flex flex-row w-full py-5 px-8 justify-between'>
            <div className='text-white'>
                {/* <p>Pages{pathString}</p> */}
                {/* <p>Hello, {currentUser.first_name} {currentUser.last_name}</p> */}
            </div>
            <div className='flex-none'>
                <span onClick={handleLogout}>🙍</span>
                <span>⚙️</span>
            </div>
        </div>
    )
};

export default Utilities;