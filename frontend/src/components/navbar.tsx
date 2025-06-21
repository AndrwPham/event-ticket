import { FC } from "react";
import { useLocation, Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

interface NavbarProps {
    onLogInClick: () => void;
    onSignUpClick: () => void;
}

const Navbar: FC<NavbarProps> = ({ onLogInClick, onSignUpClick }) => {
    const { pathname } = useLocation();

    const routes = [
        {
            href: "/contact-sales",
            label: "Contact Sales",
        },
        {
            href: "/create-event",
            label: "Create Event",
        },
        {
            href: "/tickets",
            label: "Tickets",
        },
        {
            label: "Log In",
            onClick: onLogInClick,
        },
        {
            label: "Sign Up",
            onClick: onSignUpClick,
        },
    ];

    return (
        <nav className="bg-[#1D0E3C] text-white px-6 py-4 flex flex-row items-center justify-between">
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

            <div className="flex flex-row items-center justify-end basis-1/2 gap-12 text-sm font-medium">
                {routes.map((route) => {
                    const isActive = route.href && pathname === route.href;

                    const commonClasses = "hover:underline transition";
                    const createEventClasses =
                        route.label === "Create Event"
                            ? "border border-white rounded-full px-4 py-1 hover:bg-white hover:text-[#1A0B49]"
                            : "";
                    const activeClasses = isActive ? "underline" : "";

                    const finalClassName = `${commonClasses} ${createEventClasses} ${activeClasses}`;

                    return route.onClick ? (
                        <button
                            key={route.label}
                            onClick={route.onClick}
                            className={finalClassName}
                        >
                            {route.label}
                        </button>
                    ) : (
                        <Link
                            key={route.label}
                            to={route.href || "#"}
                            className={finalClassName}
                        >
                            {route.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
