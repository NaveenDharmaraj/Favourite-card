import axios from 'axios';

const token = ' eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUVTJOVUk1TTBNMk9VRTJOME13T1RBNFFVTTBSVVU1TWtReFF6UkdSakpDTWtFek5EVTJOUSJ9.eyJpc3MiOiJodHRwczovL2NoaW1wdGVjaC1kZXYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDg4ODAwMCIsImF1ZCI6WyJodHRwczovL2xhYi4yNDQ2Ny5vcmcvYXBpL3YyLyIsImh0dHBzOi8vY2hpbXB0ZWNoLWRldi5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTYzMTY5MzIxLCJleHAiOjE1NjMyMDUzMjEsImF6cCI6Im5mbEpEUHRxRUNnWmZlQ1NhaHc4NnRnREFPVmhCUTc0Iiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.A9inNY6xZ40AyXqYG-uQelZmi906UcahUlbFBr699jpXicBksGbV0kdYDLrMvV0WHg4lFnscffWrIBzwqcwmHifJgSiXIrCBCPgTYVxX-VLFAFIBz-0c9GhH66uqj8ew9q5eHrTWj9ftsPsu20E5553l4D3ADSp0dfqrdaTMgjjApkwKGEy60lOlfEHig2QvgdZmYKBrliIPpSnMUoQIcvgFPRru8Dqz1MVIqcpvXe0f9sZdjygvF_oEfoL3fbeY5PO1bNbaAnqlBdNLsZ6S-fY0UcrmGEfNiXg8XCgmnPcX8c25XKlXFaDxwHDZBvon_0mHDXVi8wry0in9CRX-Sg';
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
