import React from 'react';

interface ImageUploaderProps {
    id: string;
    previewUrl: string | null;
    onFileChange: (file: File | null) => void;
    label: string;
    dimensions: string;
}

export const ImageUploader = ({ id, previewUrl, onFileChange, label, dimensions }: ImageUploaderProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onFileChange(file);
    };

    return (
        <div className="relative">
            <label
                htmlFor={id}
                className="border-2 border-dashed border-gray-300 rounded-lg h-56 flex items-center justify-center text-gray-400 flex-col text-center text-sm cursor-pointer hover:bg-gray-50 transition-colors"
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={`${label} preview`}
                        className="object-cover w-full h-full rounded-md"
                    />
                ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1a2 2 0 010-2.828l1-1" />
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            </svg>
                            <p className="font-semibold">{label}</p>
                            <p className="text-xs">{dimensions}</p>
                        </>
                    )}
            </label>
            <input
                type="file"
                accept="image/*"
                id={id}
                onChange={handleInputChange}
                className="hidden"
            />
        </div>
    );
};
