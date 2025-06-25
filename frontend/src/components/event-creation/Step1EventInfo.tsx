import React, { useCallback } from 'react';
import {
    RichTextEditorComponent,
    Inject,
    Toolbar,
    Image,
    Link,
    HtmlEditor,
    QuickToolbar,
    ChangeEventArgs,
} from "@syncfusion/ej2-react-richtexteditor";
import { EventFormData } from '@/types/event';
import { useFilePreview } from '@/hooks/useFilePreview';
import { ImageUploader } from './ImageUploader';
import { Tooltip } from '@/components/ui/Tooltip';

interface Step1Props {
    formData: EventFormData;
    setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
}

export const Step1EventInfo = ({ formData, setFormData }: Step1Props) => {
    const eventLogoPreview = useFilePreview(formData.eventLogo);
    const eventCoverPreview = useFilePreview(formData.eventCover);
    const organizerLogoPreview = useFilePreview(formData.organizer.logo);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    const handleFileChange = (field: 'eventLogo' | 'eventCover', file: File | null) => {
        setFormData(prev => ({ ...prev, [field]: file }));
    };

    const handleOrganizerPosterChange = (file: File | null) => {
        setFormData(prev => ({ ...prev, organizer: { ...prev.organizer, logo: file }}));
    }

    const handleDescriptionChange = useCallback((args: ChangeEventArgs) => {
        setFormData(prev => ({...prev, description: args.value || ""}));
    }, [setFormData]);

    const toolbarSettings = {
        items: ["Bold", "Italic", "Underline", "|", "Formats", "Alignments", "OrderedList", "UnorderedList", "|", "CreateLink", "Image", "|", "SourceCode", "Undo", "Redo"],
    };

    const imageTooltipContent = (
        <div className="space-y-2">
            <p><strong className="font-semibold">Poster Image:</strong> A single image used in event listings and search results.</p>
            <p><strong className="font-semibold">Cover Image(s):</strong> Act as the main banner on your event page. If given multiple images, a carousel will be placed instead.</p>
        </div>
    );

    return (
        <div className="space-y-12">
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Event Images</h3>
                    <Tooltip content={imageTooltipContent} position="right"></Tooltip>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                    <div className="lg:col-span-3">
                        <ImageUploader id="event-poster-upload" label="Add Event Poster" dimensions="(Recommended: 3:4)" previewUrl={eventLogoPreview} onFileChange={(file) => handleFileChange('eventLogo', file)} />
                    </div>
                    {/* TODO: allow the cover uploader to support multiple files */}
                    <div className="lg:col-span-7">
                        <ImageUploader id="event-cover-upload" label="Add Event Cover(s)" dimensions="(Recommended: 16:9)" previewUrl={eventCoverPreview} onFileChange={(file) => handleFileChange('eventCover', file)} />
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
                        <label htmlFor="location-online" className="flex items-center gap-2"><input id="location-online" type="radio" name="eventType" value="online" checked={formData.eventType === 'online'} onChange={handleChange} /> Online</label>
                        <label htmlFor="location-onsite" className="flex items-center gap-2"><input id="location-onsite" type="radio" name="eventType" value="onsite" checked={formData.eventType === 'onsite'} onChange={handleChange} /> Onsite</label>
                    </div>
                    {formData.eventType === 'onsite' && (
                        <div className="space-y-4 pt-2">
                            <input name="venueName" value={formData.venueName} onChange={handleChange} type="text" placeholder="Venue Name" className="w-full border-gray-300 rounded-md shadow-sm"/>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="city" value={formData.address.city} onChange={handleAddressChange} type="text" placeholder="City/Province" className="border-gray-300 rounded-md shadow-sm"/>
                                <input name="district" value={formData.address.district} onChange={handleAddressChange} type="text" placeholder="District" className="border-gray-300 rounded-md shadow-sm"/>
                                <input name="ward" value={formData.address.ward} onChange={handleAddressChange} type="text" placeholder="Ward" className="border-gray-300 rounded-md shadow-sm"/>
                                <input name="street" value={formData.address.street} onChange={handleAddressChange} type="text" placeholder="Street and Number" className="border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        </div>
                    )}
                </fieldset>

                {/* TODO: change to query from database */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Event Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm">
                        <option value="" disabled>Select a category...</option>
                        <option value="Music">Music</option>
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Art">Art & Culture</option>
                        <option value="Sport">Sports</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
                    {/* IMPROVEMENT: Pass the memoized handler to the 'change' prop. */}
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

                {/* TODO: move organizer info to another window */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t">
                    <div className="lg:col-span-3">
                        <ImageUploader id="organizer-logo-upload" label="Add Organizer Logo" dimensions="(Recommended: 1:1)" previewUrl={organizerLogoPreview} onFileChange={handleOrganizerPosterChange} />
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
