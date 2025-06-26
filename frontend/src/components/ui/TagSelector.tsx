import React, { useState, useEffect } from 'react';
import { Tag } from '@/types/event';

interface TagSelectorProps {
    selectedTagIds: string[];
    onChange: (newTagIds: string[]) => void;
}

// You can keep this or move it to a central API config file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const TagSelector = ({ selectedTagIds, onChange }: TagSelectorProps) => {
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all available tags when the component mounts
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/tags`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tags');
                }
                const data: Tag[] = await response.json();
                setAvailableTags(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTags();
    }, []);

    const handleToggleTag = (tagId: string) => {
        const isSelected = selectedTagIds.includes(tagId);
        let newTagIds: string[];

        if (isSelected) {
            // If already selected, remove it from the array
            newTagIds = selectedTagIds.filter(id => id !== tagId);
        } else {
            // If not selected, add it to the array
            newTagIds = [...selectedTagIds, tagId];
        }
        // Call the parent's onChange handler with the new array
        onChange(newTagIds);
    };

    // Render loading state
    if (isLoading) {
        return <div className="p-3 bg-gray-100 rounded-md text-sm text-gray-500">Loading tags...</div>;
    }

    // Render error state
    if (error) {
        return <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>;
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Tags</label>
            <div className="flex flex-wrap items-center gap-3 p-2 border border-gray-200 rounded-lg bg-white">
                {availableTags.map(tag => {
                    const isSelected = selectedTagIds.includes(tag.id);

                    return (
                        <button
                            type="button"
                            key={tag.id}
                            onClick={() => handleToggleTag(tag.id)}
                            className={`
px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out
${isSelected 
? 'bg-primary text-white shadow-md scale-105' 
: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
}
`}
                        >
                            {tag.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
