import axios from 'axios';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUVTJOVUk1TTBNMk9VRTJOME13T1RBNFFVTTBSVVU1TWtReFF6UkdSakpDTWtFek5EVTJOUSJ9.eyJpc3MiOiJodHRwczovL2NoaW1wdGVjaC1kZXYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDk5OTAwMCIsImF1ZCI6Imh0dHBzOi8vbGFiLjI0NDY3Lm9yZy9hcGkvdjIvIiwiaWF0IjoxNTYyMjIxNjU3LCJleHAiOjE1NjIyMjM0NTcsImF6cCI6Im5mbEpEUHRxRUNnWmZlQ1NhaHc4NnRnREFPVmhCUTc0IiwiZ3R5IjoicGFzc3dvcmQifQ.S1Fhn9iP-_aTmS0cFAHOBQVMAom7H5tU140DD2fi6wa-0hwydViGQekjq706pXplnINoFgvJ97lfAJiwCo16Zt5shT3-6RP1FRspQzP1YKHvJ-7zS4mpwkPNCbrHfQFMUoL_A7ZwV5GG3sTiD02VsEOUdGoORvFP9orVOj4w64mHhQvwYvw4ec9mGzRnhLR1_djzQX-8IQuhYIR8Xk5ctQofD_3leDD13mEuWccVawpqLKz60gnuT4XcLdQTkMV8-3U1hMKkHeXNWvbK0IYdrrWFEmNNgG7Gi5YLNoM0-WiI7Z0oYRpE8H2G5uzOFyvTKMeOqiOBe5q0CiAsBI4EEw';
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

instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response.data;
  }, function (error) {
    return Promise.reject(error);
  });

export default instance;
