import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Tag, CalendarPlus, User } from 'lucide-react';

// A reusable component for each card in the contact hub
const ContactOptionCard: FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
}> = ({ icon, title, description, linkTo, linkText }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-start h-full">
      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm flex-grow mb-4">{description}</p>
      <Link to={linkTo} className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors text-sm">
        {linkText} &rarr;
      </Link>
    </div>
  );
};

// The main Contact Us page component
const ContactUs = () => {
  const contactOptions = [
    {
      icon: <Tag className="w-6 h-6" />,
      title: 'Find Tickets',
      description: 'Looking for events? Browse all our upcoming events or use the search to find exactly what you\'re looking for.',
      linkTo: '/events',
      linkText: 'Browse Events',
    },
    {
      icon: <CalendarPlus className="w-6 h-6" />,
      title: 'Create an Event',
      description: 'Are you an organizer? List your event on our platform and reach a wider audience effortlessly.',
      linkTo: '/create-event',
      linkText: 'Become an Organizer',
    },
    {
      icon: <User className="w-6 h-6" />,
      title: 'My Account',
      description: 'Manage your profile, view your purchased tickets, and update your personal information.',
      linkTo: '/profile',
      linkText: 'Go to Profile',
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            How can we help?
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Get in touch and let us know how we can help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {contactOptions.map((option) => (
            <ContactOptionCard key={option.title} {...option} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;