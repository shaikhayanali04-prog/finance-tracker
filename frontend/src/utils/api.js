export const getAuthToken = () => {
    try {
        const stored = JSON.parse(localStorage.getItem("finance-tracker-auth"));
        return stored?.token || "";
    } catch {
        return "";
    }
};

export const apiFetch = async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };
    
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
        // Handle global unauthorized redirect inside robust systems
        console.warn("Unauthorized access detected. Token may be expired.");
    }
    
    return response;
};
