import { FC } from "react";
import { useLocation, Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext"; // We assume AuthContext is in src/context

interface NavbarProps {
    onLogInClick: () => void;
    onSignUpClick: () => void;
}

const Navbar: FC<NavbarProps> = ({ onLogInClick, onSignUpClick }) => {
    const { pathname } = useLocation();
    const { isAuthenticated, logout } = useAuth();

    // Base routes that are always visible
    const baseRoutes = [
        {
            href: "/contact-sales",
            label: "Contact Sales",
        },
        {
            href: "/create-event",
            label: "Create Event",
        },
        {
            href: "/ticket",
            label: "Tickets",
        },
    ];

    // Dynamically add auth-related routes
    const authRoutes = isAuthenticated
        ? [
              {
                  href: "/profile",
                  label: "My Account",
              },
              {
                  label: "Log Out",
                  onClick: logout,
              },
          ]
        : [
              {
                  label: "Log In",
                  onClick: onLogInClick,
              },
              {
                  label: "Sign Up",
                  onClick: onSignUpClick,
              },
          ];

    const allRoutes = [...baseRoutes, ...authRoutes];

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
                {allRoutes.map((route) => {
                    const isActive = route.href && pathname === route.href;

                    const commonClasses = "hover:underline transition";
                    const createEventClasses =
                        route.label === "Create Event"
                            ? "border border-white rounded-full px-4 py-1 hover:bg-white hover:text-[#1A0B49]"
                            : "";
                    const activeClasses = isActive ? "underline" : "";

                    const finalClassName = `${commonClasses} ${createEventClasses} ${activeClasses}`;

                    return "onClick" in route &&
                        typeof route.onClick === "function" ? (
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
