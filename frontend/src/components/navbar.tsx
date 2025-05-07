import { FC } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const Navbar: FC = () => {
    return (
        <nav className="bg-[#1D0E3C] text-white px-6 py-4 flex flex-row items-center justify-between">
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
                <Link to="#" className="hover:underline">Contact Sales</Link>
                <Link
                    to="#"
                    className="border border-white rounded-full px-4 py-1 hover:bg-white hover:text-[#1A0B49] transition"
                >
                    Create Event
                </Link>
                <Link to="#" className="hover:underline">Tickets</Link>
                <Link to="#" className="hover:underline">Log In</Link>
                <Link to="/signup" className="hover:underline">Sign Up</Link>
            </div>
        </nav>
    );
};

export default Navbar;
