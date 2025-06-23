import { FC } from "react";

const AboutUsPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">About NeoTickets</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="space-y-6 text-gray-700">
            <p className="text-lg">Welcome to NeoTickets, your ultimate platform for live events. Our mission is two-fold: to provide a seamless and secure way for you to purchase tickets for your favorite events, and to empower creators to organize, promote, and manage their own successful events.</p>
            <h2 className="text-2xl font-bold text-gray-800 pt-4">Our Mission</h2>
            <p>We are dedicated to bridging the gap between event organizers and their audiences. For attendees, we offer a diverse marketplace of experiences waiting to be discovered. For organizers, we provide a powerful suite of tools to bring their vision to life.</p>
            <h2 className="text-2xl font-bold text-gray-800 pt-4">Our Vision</h2>
            <p>We envision a vibrant community where attending and creating live events is accessible to everyone. We are building more than just a ticketing service; we are building a home for event creators and a gateway to unforgettable memories for attendees.</p>
            <h2 className="text-2xl font-bold text-gray-800 pt-4">The Team</h2>
            <p>The NeoTickets team is a passionate group of developers, marketers, and event professionals based in Bến Cát, Binh Duong. We are united by our love for live events and our commitment to serving our community.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;