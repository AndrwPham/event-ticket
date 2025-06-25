import React, { useState, useMemo } from "react";
import { registerLicense } from '@syncfusion/ej2-base';

// import { EventFormData, Ticket } from "@/types/event";
import { EventFormData } from "@/types/event";
import { Stepper } from "@/components/event-creation/Stepper";
import { OrganizerLayout } from "@/components/layout/OrganizerLayout";
import { Step1EventInfo } from "@/components/event-creation/Step1EventInfo";
import { Step2TimeAndTickets } from "@/components/event-creation/Step2TimeAndTickets";
import { Step3Payment } from "@/components/event-creation/Step3Payment";

// registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);
registerLicense('YOUR_LICENSE');

const STEPS = ["Event information", "Show time & Ticket", "Payment"];

const initialFormData: EventFormData = {
    eventName: "",
    eventType: "online",
    venueName: "",
    address: { city: "", district: "", ward: "", street: "" },
    category: "",
    description: "<p>Tell your audience about the event!</p>",
    organizer: { name: "", info: "", logo: null },
    time: { start: "", end: "" },
    tickets: [],
    payment: { accountOwner: "", accountNumber: "", bank: "", branch: "" },
    eventLogo: null,
    eventCover: null,
};

export default function CreateEvent() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<EventFormData>(initialFormData);

    // IMPROVEMENT: Derived state using useMemo for better performance and readability.
    const isStepValid = useMemo(() => {
        switch (step) {
            case 1:
                const { eventName, eventType, address, category, organizer } = formData;
                const isAddressValid = eventType === 'online' || (address.city && address.district && address.street);
                return !!(eventName && isAddressValid && category && organizer.name && organizer.info);
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

    const handleSaveDraft = () => {
        // NOTE: Saving File objects to localStorage is not possible.
        // You would typically upload them and save the URL.
        // For this example, we'll save without the files.
        const draftData = { ...formData, eventLogo: null, eventCover: null, 'organizer.logo': null };
        localStorage.setItem("draftEvent", JSON.stringify(draftData));
        alert("Draft saved!");
        console.log("Draft Data:", draftData);
    };

    const handleNext = () => {
        if (isStepValid && step < 3) {
            setStep(s => s + 1);
        } else if (step === 3 && isStepValid) {
            // Final submission logic would go here
            console.log("FINAL SUBMISSION:", formData);
            alert("Event Submitted!");
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(s => s - 1);
        }
    };

    // Helper function to update nested state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFormData = (field: keyof EventFormData, value: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    return (
        <OrganizerLayout>
            <header className="bg-white border-b py-4 px-6 flex items-center justify-between sticky top-0 z-10">
                <Stepper steps={STEPS} currentStep={step} />
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100" onClick={handleSaveDraft}>
                        Save Draft
                    </button>
                    <button type="button" onClick={handleBack} disabled={step === 1} className="px-4 py-2 rounded-md text-sm font-medium border bg-white disabled:opacity-50">
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={!isStepValid}
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
