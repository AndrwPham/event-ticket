import React from 'react';

interface ImageUploaderProps {
    id: string;
    previewUrl: string | null;
    onFileChange: (file: File | null) => void;
    label: string; // The persistent label
    dimensions: string;
}

export const ImageUploader = ({ id, previewUrl, onFileChange, label, dimensions }: ImageUploaderProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onFileChange(file);
    };

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <h4 className="font-semibold text-gray-700">{label}</h4>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg flex-grow flex items-center justify-center text-gray-400 bg-white p-5">
                {previewUrl ? (
                    <>
                        <img src={previewUrl} alt={`${label} preview`} className="object-cover w-full h-full rounded-md" />
                        {/* Overlay to change the image */}
                        <label htmlFor={id} className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 flex items-center justify-center text-white opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                            Change Image
                        </label>
                    </>
                ) : (
                        <label htmlFor={id} className="flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 rounded-md w-full h-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1a2 2 0 010-2.828l1-1" /><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
                            <span className="font-semibold">Add Image</span>
                            <span className="text-xs">{dimensions}</span>
                        </label>
                    )}
                <input
                    type="file"
                    accept="image/*"
                    id={id}
                    onChange={handleInputChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};
