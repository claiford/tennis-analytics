import { useLocation } from "react-router-dom";

const pathIcons = {
    dashboard: '🏠'
}

const Utilities = () => {
    const location = useLocation();
    const path = location.pathname.split("/")
    console.log(path)

    let pathString = ''
    for (const page of path) {
        if (page) {
            pathString += ` / ${pathIcons[page] ?? page}`
        }
    }

    return (
        <div className='flex flex-row w-full py-5 px-8 justify-between'>
            <div className='text-white'>
                <p>Pages{pathString}</p>
            </div>
            <div className='flex-none'>
                <span>🙍</span>
                <span>⚙️</span>
            </div>
        </div>
    )
};

export default Utilities;