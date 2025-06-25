import React, { useState, useMemo } from "react";
import { registerLicense } from '@syncfusion/ej2-base';

import { EventFormData, UploadedImage } from "@/types/event";
import { Stepper } from "@/components/event-creation/Stepper";
import { OrganizerLayout } from "@/components/layout/OrganizerLayout";
import { Step1EventInfo } from "@/components/event-creation/Step1EventInfo";
import { Step2TimeAndTickets } from "@/components/event-creation/Step2TimeAndTickets";
import { Step3Payment } from "@/components/event-creation/Step3Payment";

// Remember to replace 'YOUR_LICENSE' with your actual Syncfusion license key
registerLicense('YOUR_LICENSE');

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const STEPS = ["Event information", "Show time & Ticket", "Payment"];

const initialFormData: EventFormData = {
    eventName: "",
    eventType: "online",
    venueName: "",
    address: { city: "", district: "", ward: "", street: "" },
    tagIds: [],
    description: "<p>Tell your audience about the event!</p>",
    organizer: { name: "", info: "", logo: null },
    time: { start: "", end: "" },
    tickets: [],
    payment: { accountOwner: "", accountNumber: "", bank: "", branch: "" },
    eventPoster: null,
    eventCovers: [],
};

const LoadingOverlay = ({ message }: { message: string }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
        <p className="text-white text-lg">{message}</p>
    </div>
);

export default function CreateEvent() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<EventFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState('');

    const isStepValid = useMemo(() => {
        switch (step) {
            case 1:
                const { eventName, eventType, address, tagIds, organizer } = formData;
                const isAddressValid = eventType === 'online' || (address.city && address.district && address.street);
                return !!(eventName && isAddressValid && tagIds.length > 0 && organizer.name);
            case 2:
                const { time, tickets } = formData;
                return !!(time.start && time.end && new Date(time.end) > new Date(time.start) && tickets.length > 0);
            case 3:
                const { payment } = formData;
                return !!(payment.accountOwner && payment.accountNumber && payment.bank);
            default:
                return false;
        }
    }, [formData, step]);

    const handleSubmit = async (formData: EventFormData) => {
        setIsSubmitting(true);

        // --- Step 1: Handle File Uploads ---
        setSubmissionMessage('Preparing images...');

        const posterFile = formData.eventPoster;
        if (!posterFile) {
            alert("An event poster is required.");
            setIsSubmitting(false);
            return;
        }

        // WARN: skipping the organizer logo
        const otherFiles = formData.eventCovers.filter((file): file is File => file !== null);
        const allFilesToUpload = [posterFile, ...otherFiles];

        let posterImageData: UploadedImage | null = null;
        let otherImagesData: UploadedImage[] = [];

        if (allFilesToUpload.length > 0) {
            try {
                setSubmissionMessage('Requesting upload permissions...');
                const presignedUrlPayload = allFilesToUpload.map(file => ({
                    contentType: file.type,
                    isPublic: true,
                    folder: 'events'
                }));

                const presignedUrlResponse = await fetch(`${API_BASE_URL}/images/upload-urls`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(presignedUrlPayload),
                });
                if (!presignedUrlResponse.ok) throw new Error('Could not get upload URLs.');

                const presignedData = await presignedUrlResponse.json();

                setSubmissionMessage('Uploading images...');
                await Promise.all(
                    presignedData.map((data: { presignedUrl: string }, index: number) => {
                        const file = allFilesToUpload[index];
                        return fetch(data.presignedUrl, {
                            method: 'PUT',
                            headers: { 'Content-Type': file.type },
                            body: file,
                        });
                    })
                );

                const allUploadedImages: UploadedImage[] = presignedData.map((data: { key: string }, index: number) => ({
                    key: data.key,
                    isPublic: true,
                    contentType: allFilesToUpload[index].type,
                }));
                posterImageData = allUploadedImages[0]; // The first image is the poster
                otherImagesData = allUploadedImages.slice(1); // The rest images

            } catch (error: any) {
                console.error('File upload process failed:', error);
                alert(`Error during file upload: ${error.message}`);
                setIsSubmitting(false);
                return;
            }
        }

        // --- Step 2: Transform and Submit Final Event Data ---
        try {
            setSubmissionMessage('Finalizing event...');

            const finalEventPayload = {
                title: formData.eventName,
                description: formData.description,
                active_start_date: formData.time.start,
                active_end_date: formData.time.end,
                sale_start_date: formData.time.start,
                sale_end_date: formData.time.end,
                city: formData.address.city,
                district: formData.address.district,
                street: formData.address.street,
                type: formData.eventType.toUpperCase(),
                // WARN: static Id
                organizationId: "685b76539bfc4952f337313c",
                tagIds: formData.tagIds,
                ticketSchema: {
                    classes: formData.tickets.map(ticket => ({
                        label: ticket.label,
                        description: ticket.description,
                        quantity: ticket.quantity,
                        price: ticket.price,
                        currency: ticket.currency,
                    })),
                },
                posterImage: posterImageData,
                images: otherImagesData,
            };

            const finalResponse = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalEventPayload),
            });

            if (!finalResponse.ok) {
                const errorData = await finalResponse.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create the event.');
            }

            alert('Event Published Successfully!');
            // TODO: Add redirection logic here
        } catch (error: any) {
            console.error('Final event submission failed:', error);
            alert(`Error during final submission: ${error.message}`);
        } finally {
            setIsSubmitting(false); // Always turn off the loading state
        }
    };

    const handleNext = () => {
        if (isStepValid && step < 3) {
            setStep(s => s + 1);
        } else if (step === 3 && isStepValid) {
            handleSubmit(formData);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(s => s - 1);
        }
    };

    const handleSaveDraft = () => {
        const draftData = { ...formData, eventPoster: null, eventCovers: [], 'organizer.logo': null };
        localStorage.setItem("draftEvent", JSON.stringify(draftData));
        alert("Draft saved!");
    };

    const updateFormData = <K extends keyof EventFormData>(
        field: K,
        value: EventFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <OrganizerLayout>
            {isSubmitting && <LoadingOverlay message={submissionMessage} />}

            <header className="bg-white border-b py-4 px-6 flex items-center justify-between sticky top-0 z-10">
                <Stepper steps={STEPS} currentStep={step} />
                <div className="flex items-center gap-3">
                    <button type="button" className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100" onClick={handleSaveDraft}>
                        Save Draft
                    </button>
                    <button type="button" onClick={handleBack} disabled={step === 1 || isSubmitting} className="px-4 py-2 rounded-md text-sm font-medium border bg-white disabled:opacity-50">
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={!isStepValid || isSubmitting}
                        className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {step < 3 ? "Continue" : "Publish Event"}
                    </button>
                </div>
            </header>

            <main className="p-10">
                {step === 1 && <Step1EventInfo formData={formData} setFormData={setFormData} />}
                {step === 2 && <Step2TimeAndTickets formData={formData} updateFormData={updateFormData} />}
                {step === 3 && <Step3Payment formData={formData} setFormData={setFormData} />}
            </main>
        </OrganizerLayout>
    );
}
