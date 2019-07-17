import axios from 'axios';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUVTJOVUk1TTBNMk9VRTJOME13T1RBNFFVTTBSVVU1TWtReFF6UkdSakpDTWtFek5EVTJOUSJ9.eyJpc3MiOiJodHRwczovL2NoaW1wdGVjaC1kZXYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDg4ODAwMCIsImF1ZCI6WyJodHRwczovL2xhYi4yNDQ2Ny5vcmcvYXBpL3YyLyIsImh0dHBzOi8vY2hpbXB0ZWNoLWRldi5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTYzMzM5MTMxLCJleHAiOjE1NjMzNzUxMzEsImF6cCI6Im5mbEpEUHRxRUNnWmZlQ1NhaHc4NnRnREFPVmhCUTc0Iiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.Idyj_wWFOoUdFXVPTlN5Nau-PSasrqTGhY1aFxtaDjmB1kVdfDXLc4K22PqJnLKJx8rTVS3OfVTzile9HHXo4xc8Y7-koH-sXIHZBS3Y0iL0Pus7oOMyiI5DsuZw9UKdNrLTwjdg8r2rn50NQHGYbNF-U2pOnujm4C5CqvWu_S_uKC2v2Vkuph3Kn-tqnYV1B6Xja2qQLvNcmIXBkh57f6fXQqkYBc0PD7ZP3vcmsyHYtcoRTZQ4t08IGGr4_PrY_8uxxtUDuJn4WgEa8UpF7aeZn9SOcPkISFi5HZWhhrAOYDMisMrSVADQWc-I5whr_aqf6wH7FCGszO9sFlDaIw';
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
