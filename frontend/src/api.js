const BASE_URL = import.meta.env.VITE_API_URL;

// GET requests
export async function apiGet(path) {
    const response = await fetch(`${BASE_URL}${path}`);
    if (!response.ok) {
        throw new Error(`GET ${path} failed: ${response.statusText}`);
    }
    return response.json();
}

// POST requests
export async function apiPost(path, data) {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`POST ${path} failed: ${response.statusText}`);
    }
    return response.json();
}

