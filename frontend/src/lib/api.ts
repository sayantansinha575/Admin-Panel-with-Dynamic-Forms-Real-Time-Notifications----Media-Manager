import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL + '/api' });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only retry once
        if (error.response?.status === 401 && !originalRequest._retry && localStorage.getItem('token')) {
            originalRequest._retry = true;

            try {
                // Use the same instance for refresh
                const refreshResponse = await api.post('/refresh');
                const newToken = refreshResponse.data.token;

                // Update token in localStorage and axios headers
                localStorage.setItem('token', newToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);


export default api;
