import { FC } from "react";
import { FiSearch } from "react-icons/fi";
import { useLocation, Link } from "react-router-dom";

const Navbar: FC = () => {
    const { pathname } = useLocation();

    const routes = [
        {
            href: "/contact-sales",
            label: "Contact Sales",
            active: pathname === "/contact-sales",
        },
        {
            href: "/create-event",
            label: "Create Event",
            active: pathname === "/create-event",
        },
        { href: "/ticket", label: "Ticket", active: pathname === "/ticket" },
        { href: "/login", label: "Log In", active: pathname === "/login" },
        { href: "/sign-up", label: "Sign Up", active: pathname === "/sign-up" },
    ];

    return (
        <nav className="bg-darkBlue text-white px-6 py-4 flex flex-row items-center justify-between">
            {/* Left: Search Bar */}
            <div className="flex flex-row justify-end basis-1/2">
                <div className="flex flex-row items-center w-2/3 bg-white rounded-full px-4 py-2 shadow-sm mr-10">
                    <FiSearch className="text-black mr-2" />
                    <input
                        type="text"
                        placeholder="Search events"
                        className="w-full text-sm text-black bg-transparent focus:outline-none"
                    />
                </div>
            </div>

            {/* Right: Navigation Links */}
            <div className="flex flex-row items-center justify-end basis-1/2 gap-12 text-sm font-medium">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        to={route.href}
                        className={`${
                            route.active ? "underline" : "hover:underline"
                        } ${
                            route.label === "Create Event"
                                ? "border border-white rounded-full px-4 py-1 hover:bg-white hover:text-[#1A0B49] transition"
                                : ""
                        }`}
                    >
                        {route.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
