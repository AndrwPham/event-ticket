import { FC } from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer: FC = () => {
    return (
        <footer className="bg-darkBlue text-white py-10 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Social Links */}
                <div>
                    <h4 className="font-semibold mb-4">Let’s connect</h4>
                    <div className="flex space-x-4 text-white text-xl">
                         <a href="https://www.facebook.com/Fuisloy" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gray-300 transition-colors">
                            <FaFacebookF />
                        </a>
                        <a href="https://www.linkedin.com/in/fuisloy/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-gray-300 transition-colors">
                            <FaLinkedinIn />
                        </a>
                        <a href="https://www.instagram.com/fuisloy/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gray-300 transition-colors">
                            <FaInstagram />
                        </a>
                    </div>
                </div>

                {/* For Customer */}
                <div>
                    <h4 className="font-semibold mb-2">For Customer</h4>
                    <Link to="/customer-terms" className="text-sm text-gray-300 hover:text-white cursor-pointer">
                        Customer terms of use
                    </Link>
                    <h4 className="font-semibold mt-4 mb-2">For Organizer</h4>
                    <Link to="/organizer-terms" className="text-sm text-gray-300 hover:text-white cursor-pointer">
                        Organizer terms of use
                    </Link>
                </div>

                {/* Subscribe */}
                <div>
                    <h4 className="font-semibold mb-3">
                        Subscribe to our hottest events
                    </h4>
                    <form className="flex items-center bg-white rounded-full overflow-hidden">
                        <span className="px-3 text-gray-500">
                            <MdEmail />
                        </span>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-grow py-2 px-2 text-sm text-black focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="px-4 text-[#2D1D53] font-bold"
                        >
                            &gt;
                        </button>
                    </form>
                </div>

                {/* Company Info */}
                <div>
                    <h4 className="font-semibold mb-2">Our Company</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                        <li className="hover:text-white">
                            <Link to="/about-us">About Us</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/press">Press</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/contact-sales">Contact Us</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/help-center">Help Center</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/how-it-works">How it Works</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/privacy">Privacy</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/terms">Terms</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;