import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
    return (
        <footer className="bg-darkBlue text-white py-10 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Social Links */}
                <div>
                    <h4 className="font-semibold mb-4">Let’s connect</h4>
                    <div className="flex space-x-4 text-white text-xl">
                        <FaFacebookF />
                        <FaLinkedinIn />
                        <FaInstagram />
                    </div>
                </div>

                {/* For Customer */}
                <div>
                    <h4 className="font-semibold mb-2">For Customer</h4>
                    <p className="text-sm text-gray-300 hover:text-white cursor-pointer">
                        Customer terms of use
                    </p>
                    <h4 className="font-semibold mt-4 mb-2">For Organizer</h4>
                    <p className="text-sm text-gray-300 hover:text-white cursor-pointer">
                        Organizer terms of use
                    </p>
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
                        <li className="hover:text-white cursor-pointer">
                            About Us
                        </li>
                        <li className="hover:text-white cursor-pointer">
                            Press
                        </li>
                        <li className="hover:text-white cursor-pointer">
                            Contact Us
                        </li>
                        <li className="hover:text-white cursor-pointer">
                            Help Center
                        </li>
                        <li className="hover:text-white cursor-pointer">
                            How it Works
                        </li>
                        <li className="hover:text-white cursor-pointer">
                            Privacy
                        </li>
                        <li className="hover:text-white cursor-pointer">
                            Terms
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
