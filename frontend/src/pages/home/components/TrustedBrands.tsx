import SpotifyLogo from "../../../assets/images/brands/spotify.svg";
import GoogleLogo from "../../../assets/images/brands/google.svg";
import StripeLogo from "../../../assets/images/brands/stripe.svg";
import YouTubeLogo from "../../../assets/images/brands/youtube.svg";
import MicrosoftLogo from "../../../assets/images/brands/microsoft.svg";
import SMBCLogo from "../../../assets/images/brands/SMBC.svg";
import ZoomLogo from "../../../assets/images/brands/zoom.svg";
import UberLogo from "../../../assets/images/brands/uber.svg";
import GrabLogo from "../../../assets/images/brands/grab.svg";

const brands = [
    { name: "Spotify", src: SpotifyLogo },
    { name: "Google", src: GoogleLogo },
    { name: "Stripe", src: StripeLogo },
    { name: "YouTube", src: YouTubeLogo },
    { name: "Microsoft", src: MicrosoftLogo },
    { name: "SMBC", src: SMBCLogo },
    { name: "Zoom", src: ZoomLogo },
    { name: "Uber", src: UberLogo },
    { name: "Grab", src: GrabLogo },
];

const TrustedBrands = () => {
    return (
        <section className="py-8 bg-white text-center">
            <h2 className="text-2xl font-bold text-brandPurple mb-2">
                Join these brands
            </h2>
            <p className="text-gray-500 mb-6">
                We've had the pleasure of working with industry-defining brands.{" "}
                <br />
                These are just some of them.
            </p>
            <div className="flex flex-wrap justify-center gap-8 lg:gap-12 max-w-5xl mx-auto">
                {brands.map((brand) => (
                    <img
                        key={brand.name}
                        src={brand.src}
                        alt={brand.name}
                        className="h-8 md:h-10 object-contain"
                    />
                ))}
            </div>
        </section>
    );
};

export default TrustedBrands;
