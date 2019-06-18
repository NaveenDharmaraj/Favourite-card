import axios from 'axios';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUVTJOVUk1TTBNMk9VRTJOME13T1RBNFFVTTBSVVU1TWtReFF6UkdSakpDTWtFek5EVTJOUSJ9.eyJpc3MiOiJodHRwczovL2NoaW1wdGVjaC1kZXYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDg4ODAwMCIsImF1ZCI6WyJodHRwczovL2xhYi4yNDQ2Ny5vcmcvYXBpL3YyLyIsImh0dHBzOi8vY2hpbXB0ZWNoLWRldi5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTYwODQzNTExLCJleHAiOjE1NjA4NDUzMTEsImF6cCI6Im5mbEpEUHRxRUNnWmZlQ1NhaHc4NnRnREFPVmhCUTc0Iiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.a9QsrCwU7bWW4EHHgYsrKqNBsQy7lt-pKHgtYZC40hjUSm-pLECVHbXLHnhn4zsl2D0gryUopJ-yIPWqn9oSyGcQmdhdA7GKjQ8J5OA2L_GOTy-DC_JCW529EELxlGJ2FcWkKHvkL18zC-iKyDnD3TGKpKDir85uE1HqRa4kPwZeDvZYPvDjw-4ov3xryl4WW4TkkT4DsBL1XTQiBloOHBvq7eD0BEpcLE7UEh4QqqURQjsxfFZNZOBe0Oh-ceVJefnQh0e2-50KLk0aHcXhOyYNreq99IKBJeSJrlrwcDK4kLKecq3LpTOpZwLBv9fWzRRN4q-rgerQlAQTRPBQzQ';
const instance = axios.create({
    baseURL: 'https://api.dev.chimp.net/core/v2',
    headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
    },
});
instance.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default instance;
