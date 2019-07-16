import axios from 'axios';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUVTJOVUk1TTBNMk9VRTJOME13T1RBNFFVTTBSVVU1TWtReFF6UkdSakpDTWtFek5EVTJOUSJ9.eyJpc3MiOiJodHRwczovL2NoaW1wdGVjaC1kZXYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDg4ODAwMCIsImF1ZCI6WyJodHRwczovL2xhYi4yNDQ2Ny5vcmcvYXBpL3YyLyIsImh0dHBzOi8vY2hpbXB0ZWNoLWRldi5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTYzMjUzOTU0LCJleHAiOjE1NjMyODk5NTQsImF6cCI6Im5mbEpEUHRxRUNnWmZlQ1NhaHc4NnRnREFPVmhCUTc0Iiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.muByZG4aXGevik6qycXGjnxQDBnaXdI7Km0sJjNj6aA3VsXyzw6LrINOdFv17wVe7lL00lEG7ft0O-0ALaayvYly_SgJEo2CTG3mcoQXPMIpwy8QZJtMxcmHUM-ccF4ttioldW79ppr8d_UU8X_EVt_P3Tx9oKxoPzD9Xnd6dD_PaF7TRfW4MGuEWW28sLDGrmjwqCZBe3xsI4PNu4u0db9QPiLsjCtx5o60Px-uaqMUmeFZpDg1yBOsehzmpDSm0eQHxMAo-KgUCtjT1ez6rswyw8AlwxdmxYnjYJrdNlOsDwVvce9aqZxnbMhWOKQJqnmKyu_7SkdGMO6aSveD3g';
const instance = axios.create({
    baseURL: 'https://api-dev-1.herokuapp.com/core/v2',
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

instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response.data;
  }, function (error) {
    return Promise.reject(error.response.data);
  });

export default instance;
