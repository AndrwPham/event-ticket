import { FC } from "react";
import { FiSearch } from "react-icons/fi";

interface NavbarProps {
    onLogInClick: () => void;
}

const Navbar: FC<NavbarProps> = ({ onLogInClick }) => {
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
                <a href="#" className="hover:underline">
                    Contact Sales
                </a>
                <a
                    href="#"
                    className="border border-white rounded-full px-4 py-1 hover:bg-white hover:text-[#1A0B49] transition"
                >
                    Create Event
                </a>
                <a href="#" className="hover:underline">
                    Tickets
                </a>
                <button onClick={onLogInClick} className="hover:underline">
                    Log In
                </button>
                <a href="#" className="hover:underline">
                    Sign Up
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
