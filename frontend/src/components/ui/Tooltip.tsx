import React from 'react';
import { FaRegQuestionCircle } from "react-icons/fa";

interface TooltipProps {
    content: React.ReactNode; // The content to display inside the tooltip
    position?: 'top' | 'bottom' | 'left' | 'right'; // Optional position, defaults to 'top'
}

/**
 * A reusable Tooltip component that shows content on hover.
 *
 * @param {React.ReactNode} content - The tip content.
 * @param {'top' | 'bottom' | 'left' | 'right'} [position='top'] - The tooltip's position.
 */
export const Tooltip = ({ content, position = 'top' }: TooltipProps) => {
    // Base classes for the tooltip bubble
    const baseBubbleClasses = 'absolute z-20 w-64 p-3 text-sm text-white bg-gray-800 rounded-md shadow-lg transition-all duration-200 ease-in-out transform';

    // Initially hidden state using group-hover. The parent needs the `group` class.
    const hiddenStateClasses = 'opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible';

    // Classes to position the tooltip bubble relative to the children
    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    // Classes for the small arrow pointing to the trigger element
    const arrowClasses = {
        top: 'absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-800',
        bottom: 'absolute left-1/2 -translate-x-1/2 -top-1 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-800',
        left: 'absolute top-1/2 -translate-y-1/2 -right-1 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-800',
        right: 'absolute top-1/2 -translate-y-1/2 -left-1 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-800',
    };

    return (
        // The `group` class on this container is what makes `group-hover` work on the child bubble.
        <div className="relative flex items-center group">
            <FaRegQuestionCircle style={{color: "blue"}} />
            <div className={`${baseBubbleClasses} ${hiddenStateClasses} ${positionClasses[position]}`}>
                {content}
                <div className={arrowClasses[position]} />
            </div>
        </div>
    );
};
