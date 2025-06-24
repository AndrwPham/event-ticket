import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
    return (
        <div className="flex items-center gap-12">
            {steps.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;

                return (
                    <div key={label} className="flex items-center gap-3">
                        <div
                            className={`w-8 h-8 rounded-full text-base flex items-center justify-center transition-all duration-300 ${
isActive ? "bg-primary text-white scale-110" : isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
}`}
                        >
                            {isCompleted ? '✔' : stepNumber}
                        </div>
                        <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-gray-500"}`}>
                            {label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
