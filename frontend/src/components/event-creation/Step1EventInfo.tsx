// src/components/events/create/Step1EventInfo.tsx

import React, { useCallback, useMemo } from 'react'; // FIX: Imported useMemo
// FIX: Imported ProvidedVenue type
import { EventFormData, ProvidedVenue } from '@/types/event'; 
import { ImageUploader } from './ImageUploader';
import { MultiImageUploader } from './MultiImageUploader';
import { TagSelector } from '@/components/ui/TagSelector';
import { Tooltip } from '@/components/ui/Tooltip';
import { RichTextEditorComponent, Inject, Toolbar, Image, Link, HtmlEditor, QuickToolbar, ChangeEventArgs } from "@syncfusion/ej2-react-richtexteditor";
import { useFilePreview } from '@/hooks/useFilePreview';


// Hardcoded venues with full addresses for UI development.
const providedVenues: ProvidedVenue[] = [
    { id: 1, name: 'Grand Convention Center', address: { street: '123 Main St', ward: 'Ward 1', district: 'District 1', city: 'Ho Chi Minh City' } },
    { id: 2, name: 'Riverside Exhibition Hall', address: { street: '456 Waterway Ave', ward: 'Ward 4', district: 'District 2', city: 'Ho Chi Minh City' } },
    { id: 3, name: 'The City Auditorium', address: { street: '789 Central Square', ward: 'Ward Ben Thanh', district: 'District 1', city: 'Ho Chi Minh City' } },
];

interface Step1Props {
    formData: EventFormData;
    setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
}


export const Step1EventInfo = ({ formData, setFormData }: Step1Props) => {
    const eventPosterPreview = useFilePreview(formData.eventPoster);
    const organizerLogoPreview = useFilePreview(formData.organizer.logo);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value },
        }));
    };

    const handleOrganizerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            organizer: { ...prev.organizer, [name]: value },
        }));
    };
    
    const handleTagsChange = (newTagIds: string[]) => {
      setFormData(prev => ({ ...prev, tagIds: newTagIds }));
    };

    const handleSingleFileChange = (field: 'eventPoster', file: File | null) => {
        setFormData(prev => ({ ...prev, [field]: file }));
    };

    const handleMultipleFileChange = (files: File[]) => {
        setFormData(prev => ({ ...prev, eventCovers: files }));
    };
    
    const handleOrganizerLogoChange = (file: File | null) => {
        setFormData(prev => ({ ...prev, organizer: { ...prev.organizer, logo: file }}));
    }

    const handleDescriptionChange = useCallback((args: ChangeEventArgs) => {
        setFormData(prev => ({...prev, description: args.value || ""}));
    }, [setFormData]);


    const handleEventTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ 
            ...prev,
            eventType: e.target.value as 'online' | 'onsite',
            providedVenueId: null, 
            venueType: 'provided', // Default back to provided when changing
            address: { city: "", district: "", ward: "", street: "" },
        }));
    }

    const handleVenueTypeChange = (type: 'provided' | 'custom') => {
        setFormData(prev => ({
            ...prev,
            venueType: type,
            providedVenueId: null,
            address: { city: "", district: "", ward: "", street: "" },
        }));
    };

    const handleProvidedVenueSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const venueId = e.target.value;
        const selected = providedVenues.find(v => v.id === venueId);
        setFormData(prev => ({ 
            ...prev, 
            providedVenueId: venueId,
            address: selected ? selected.address : { city: "", district: "", ward: "", street: "" },
        }));
    };

    const selectedVenue = useMemo(() => {
        return providedVenues.find(v => v.id === formData.providedVenueId);
    }, [formData.providedVenueId]);

    const toolbarSettings = { items: ["Bold", "Italic", "Underline", "|", "Formats", "Alignments", "OrderedList", "UnorderedList", "|", "CreateLink", "Image", "|", "SourceCode", "Undo", "Redo"] };
    const imageTooltipContent = ( <div className="space-y-2"> <p><strong className="font-semibold">Event Poster:</strong> Used in event listings and search results. A vertical 3:4 ratio works best.</p> <p><strong className="font-semibold">Event Cover(s):</strong> The main banner on your event page. A horizontal 16:9 is recommended.</p> </div> );

    return (
        <div className="space-y-8">
            <section className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Event Images</h3>
                    <Tooltip content={imageTooltipContent} position="right">
                        <div className="flex items-center justify-center w-5 h-5 bg-gray-300 text-gray-600 rounded-full text-sm font-bold cursor-help">?</div>
                    </Tooltip>
                </div>
                <div className="flex flex-col lg:flex-row items-start gap-6">
                    <div className="w-full lg:w-1/4">
                        <ImageUploader 
                            id="event-poster-upload" 
                            label="Event Poster" 
                            dimensions="(Recommended: 3:4)" 
                            previewUrl={eventPosterPreview} 
                            onFileChange={(file) => handleSingleFileChange('eventPoster', file)} 
                        />
                    </div>
                    <div className="w-full lg:w-3/4">
                        <MultiImageUploader 
                            label="Event Covers"
                            onFilesChange={handleMultipleFileChange} 
                        />
                    </div>
                </div>
            </section>

            <form className="space-y-8 bg-white p-8 rounded-lg shadow">
                <div className="space-y-2">
                    <label htmlFor="eventName" className="text-sm font-medium text-gray-700">Event Name</label>
                    <input name="eventName" value={formData.eventName} onChange={handleChange} type="text" placeholder="e.g., The Grand Music Festival" className="w-full border-gray-300 rounded-md shadow-sm"/>
                </div>

                <fieldset className="space-y-4">
                    <legend className="text-sm font-medium text-gray-700">Event Location</legend>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            {/* FIX: Using the correct handler */}
                            <input type="radio" name="eventType" value="online" checked={formData.eventType === 'online'} onChange={handleEventTypeChange} /> Online
                        </label>
                        <label className="flex items-center gap-2">
                            {/* FIX: Using the correct handler */}
                            <input type="radio" name="eventType" value="onsite" checked={formData.eventType === 'onsite'} onChange={handleEventTypeChange} /> Onsite
                        </label>
                    </div>

                    {formData.eventType === 'onsite' && (
                        <div className="pl-4 pt-4 space-y-4 border-l-2 border-gray-100">
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="venueType" value="provided" checked={formData.venueType === 'provided'} onChange={() => handleVenueTypeChange('provided')} /> Provided Venue
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="venueType" value="custom" checked={formData.venueType === 'custom'} onChange={() => handleVenueTypeChange('custom')} /> Custom Address
                                </label>
                            </div>

                            {formData.venueType === 'provided' ? (
                                <div className="pt-2 space-y-2">
                                     <select 
                                        value={formData.providedVenueId || ''}
                                        onChange={handleProvidedVenueSelect} 
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="" disabled>Select a provided venue...</option>
                                        {providedVenues.map(venue => (
                                            <option key={venue.id} value={venue.id}>{venue.name}</option>
                                        ))}
                                    </select>
                                    {selectedVenue && (
                                        <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 border">
                                            <p>{selectedVenue.address.street}, {selectedVenue.address.ward}, {selectedVenue.address.district}, {selectedVenue.address.city}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4 pt-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="city" value={formData.address.city} onChange={handleAddressChange} type="text" placeholder="City/Province" className="border-gray-300 rounded-md shadow-sm"/>
                                        <input name="district" value={formData.address.district} onChange={handleAddressChange} type="text" placeholder="District" className="border-gray-300 rounded-md shadow-sm"/>
                                        <input name="ward" value={formData.address.ward} onChange={handleAddressChange} type="text" placeholder="Ward" className="border-gray-300 rounded-md shadow-sm"/>
                                        <input name="street" value={formData.address.street} onChange={handleAddressChange} type="text" placeholder="Street and Number" className="border-gray-300 rounded-md shadow-sm"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </fieldset>
                
                <TagSelector selectedTagIds={formData.tagIds} onChange={handleTagsChange} />
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
                    <RichTextEditorComponent 
                        id="event-description-editor" 
                        height="350px" 
                        value={formData.description} 
                        change={handleDescriptionChange} 
                        toolbarSettings={toolbarSettings}
                    >
                        <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
                    </RichTextEditorComponent>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t">
                    <div className="lg:col-span-3">
                        <ImageUploader id="organizer-logo-upload" label="Organizer Logo" dimensions="(Recommended: 1:1)" previewUrl={organizerLogoPreview} onFileChange={handleOrganizerLogoChange} />
                    </div>
                    <div className="lg:col-span-9 space-y-4">
                         <div>
                            <label htmlFor="organizer-name" className="block text-sm font-medium text-gray-700 mb-1">Organizer Name</label>
                            <input id="organizer-name" name="name" value={formData.organizer.name} onChange={handleOrganizerChange} type="text" placeholder="Your Company or Team Name" className="w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="organizer-info" className="block text-sm font-medium text-gray-700 mb-1">Organizer Information</label>
                            <textarea id="organizer-info" name="info" value={formData.organizer.info} onChange={handleOrganizerChange} rows={4} placeholder="Briefly describe the organizer." className="w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
