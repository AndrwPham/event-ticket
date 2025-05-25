// app/page.tsx (or pages/index.tsx depending on Next.js version)
'use client';

import React, { useState } from 'react';
import FilterPanel from '../../components/FilterPanel';
import { Search } from 'lucide-react';
import EventList from '../../components/EventList';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  price: string;
  followers: string;
  image: string;
  category: string;
  city: string;
  district: string;
  ward: string;
  eventType: string;
  organizer: string;
}

const Page: React.FC = () => {
    
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const mockEvents: Event[] = [
    {
      id: 1,
      title: "Swinging Through U.S. History: The Evolution of American Jazz",
      date: "Thu Jan 04 7:30 PM",
      location: "The American Center HCMC - Ho Chi Minh City",
      price: "Free",
      followers: "1.3k followers",
      organizer: "The U.S Consulate General in Ho Chi Minh",
      image: "/api/placeholder/280/200",
      category: "Music",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Concert",
    },
    {
      id: 2,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 3,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 4,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 5,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 6,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 7,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 8,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 9,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 10,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 11,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 12,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 12,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 13,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 14,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    },
    {
      id: 15,
      title: "Test Automation Summit | Ho Chi Minh City | 2025",
      date: "Thu Apr 24 8:00 AM",
      location: "Saigon Export Plaza - Bến Nghé, Hồ Chí",
      price: "Free",
      followers: "177 followers",
      organizer: "TESTINGMIND",
      image: "/api/placeholder/280/200",
      category: "Technology",
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      eventType: "Conference",
    }
  ];

  const filterOptions = {
    categories: Array.from(new Set(mockEvents.map(e => e.category))),
    cities: Array.from(new Set(mockEvents.map(e => e.city))),
    districts: Array.from(new Set(mockEvents.map(e => e.district))),
    wards: Array.from(new Set(mockEvents.map(e => e.ward))),
    eventTypes: Array.from(new Set(mockEvents.map(e => e.eventType))),
  };

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = searchQuery === '' || [event.title, event.location, event.category, event.organizer].some(
      field => field.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return (event as any)[key]?.toLowerCase() === value.toLowerCase();
    });

    return matchesSearch && matchesFilters;
  });

  const displayedEvents = filteredEvents;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Search Results</h1>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </span>
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onClear={() => setFilters({})}
              {...filterOptions}
            />
          </div>
        </div>

        <EventList
            events={displayedEvents}
            maxCards={12}
            onCardClick={(e) => console.log('Clicked:', e)}
        />
      </div>
    </div>
  );
};

export default Page;
