import React, { useState, useEffect } from 'react';

interface MultiImageUploaderProps {
    onFilesChange: (files: File[]) => void;
    label: string;
}

const MAX_IMAGES = 8;

export const MultiImageUploader = ({ onFilesChange, label }: MultiImageUploaderProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // This useEffect is now ONLY responsible for managing preview URLs.
    // It no longer calls the parent's onChange function.
    useEffect(() => {
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

        return () => {
            newPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            let updatedFiles = [...files, ...newFiles];

            if (updatedFiles.length > MAX_IMAGES) {
                alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
                updatedFiles = updatedFiles.slice(0, MAX_IMAGES);
            }

            setFiles(updatedFiles);
            onFilesChange(updatedFiles);
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    const showUploader = files.length < MAX_IMAGES;

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <h4 className="font-semibold text-gray-700">{label}</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex-grow flex flex-col bg-white">
                <div className="flex-grow flex">
                    {files.length === 0 ? (
                        <label htmlFor="multi-image-upload-labeled-fixed" className="flex flex-col flex-grow items-center justify-center text-gray-400 cursor-pointer text-center h-full w-full hover:bg-gray-50 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1a2 2 0 010-2.828l1-1" /><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
                            <span className="font-semibold text-base">Add Images</span>
                            <span className="text-sm">(Up to {MAX_IMAGES} images, recommended 16:9)</span>
                        </label>
                    ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                                {previews.map((preview, index) => (
                                    <div key={index} className="relative aspect-video shadow-md rounded-md border-2 border-white bg-gray-100">
                                        <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-md" />
                                        <button type="button" onClick={() => removeFile(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 leading-none hover:bg-red-600 transition-colors" aria-label="Remove image">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                                {showUploader && (
                                    <label htmlFor="multi-image-upload-labeled-fixed" className="flex items-center justify-center aspect-video bg-gray-100 rounded-md border-2 border-white hover:bg-gray-200 cursor-pointer shadow-md">
                                        <span className="text-3xl text-gray-500">+</span>
                                    </label>
                                )}
                            </div>
                        )}
                </div>
                {showUploader && (
                    <input type="file" id="multi-image-upload-labeled-fixed" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                )}
            </div>
        </div>
    );
};
