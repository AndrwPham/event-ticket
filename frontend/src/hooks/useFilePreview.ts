import { useState, useEffect } from 'react';

export function useFilePreview(file: File | null) {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Free memory when the component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return preview;
}
