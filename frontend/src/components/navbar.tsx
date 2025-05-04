import { FC } from 'react';
import { FiSearch } from 'react-icons/fi';

const Navbar: FC = () => {
    return (
        <nav className="bg-[#1D0E3C] text-white px-6 py-4 flex items-center justify-between">
            {/* Left: Search Bar */}
            <div className="flex items-center gap-3 w-5/6 max-w-3xl pl-56">
                <div className="flex items-center w-full bg-white rounded-full px-4 py-2 shadow-sm">
                    <FiSearch className="text-black mr-2" />
                    <input
                        type="text"
                        placeholder="Search events"
                        className="w-full text-sm text-black bg-transparent focus:outline-none"
                    />
                </div>
            </div>

            {/* Right: Navigation Links */}
            <div className="flex items-end gap-12 text-sm font-medium">
                <a href="#" className="hover:underline">Contact Sales</a>
                <a
                    href="#"
                    className="border border-white rounded-full px-4 py-1 hover:bg-white hover:text-[#1A0B49] transition"
                >
                    Create Event
                </a>
                <a href="#" className="hover:underline">Tickets</a>
                <a href="#" className="hover:underline">Log In</a>
                <a href="#" className="hover:underline">Sign Up</a>
            </div>
        </nav>
    );
};

export default Navbar;
