const API_URL = 'https://46e8-175-107-221-11.ngrok-free.app/api';

export const api = {
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return await response.json();
        } catch (error) {
            console.error(`API POST error (${endpoint}):`, error);
            return { success: false, message: 'Network error or server unreachable' };
        }
    },

    async get(endpoint, token) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            console.error(`API GET error (${endpoint}):`, error);
            return { success: false, message: 'Network error or server unreachable' };
        }
    },

    async patch(endpoint, data, token) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return await response.json();
        } catch (error) {
            console.error(`API PATCH error (${endpoint}):`, error);
            return { success: false, message: 'Network error or server unreachable' };
        }
    }
};
