import { Link, useLocation } from "react-router-dom";

const navNames = [
    'dashboard',
    'matches',
    'analytics',
    'profile',
]

const SidebarNav = () => {
    //   const pathname = usePathname()
    const location = useLocation();
    const pathRoot = location.pathname.split("/")[1]

    const navItems = navNames.map((name, i) => {
        return (
            <Link
                key={i}
                className={`
                    rounded-md
                    w-3/4
                    p-3
                    ${pathRoot === name ? 'bg-gray-700 text-white' : 'bg-inherit text-slate-600'}
                `}
                to={`/${name}`}
            >
                {name.charAt(0).toUpperCase() + name.slice(1)}
            </Link>
        )
    })

    return (
        <nav className='flex flex-col gap-5 h-full justify-start items-center'>
            {navItems}
            {/* {items.map((item) => (
        // <Link
        //   key={item.href}
        //   href={item.href}
        //   className={cn(
        //     buttonVariants({ variant: "ghost" }),
        //     pathname === item.href
        //       ? "bg-muted hover:bg-muted"
        //       : "hover:bg-transparent hover:underline",
        //     "justify-start"
        //   )}
        // >
        //   {item.title}
        // </Link>
    //   ))} */}
        </nav>
    )
}

export default SidebarNav;