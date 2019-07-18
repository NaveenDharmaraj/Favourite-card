import axios from 'axios';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUVTJOVUk1TTBNMk9VRTJOME13T1RBNFFVTTBSVVU1TWtReFF6UkdSakpDTWtFek5EVTJOUSJ9.eyJpc3MiOiJodHRwczovL2NoaW1wdGVjaC1kZXYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDg4ODAwMCIsImF1ZCI6Imh0dHBzOi8vbGFiLjI0NDY3Lm9yZy9hcGkvdjIvIiwiaWF0IjoxNTYzNDE3MDM1LCJleHAiOjE1NjM0NTMwMzUsImF6cCI6Im5mbEpEUHRxRUNnWmZlQ1NhaHc4NnRnREFPVmhCUTc0IiwiZ3R5IjoicGFzc3dvcmQifQ.OmHkybexnQ_szBXc45uUF1iWQOwdKA3V1v9SgjiK224iTAtQFS3I4leJRcKY0mdBw032_TL8daEmL1qpRl9INaTVEdmAowQ-rviQExNvu1ZBPvbtwIDd-WWOatCyVPNV-i7dZ5GIaebkAyAUvhiOz6H27q-guCJ3I4Ax0HMbonXJmlFw0j71SrHADQCYAbE5KXMt97yLad7eJ9eYi5N2OjHJb8_Ss_vu6L_4u-3EN49aQLZL5xvsXDayegJcg74AQDVYONrsoLvsbjwxxVFhXskBeWtKvjjFMD0FTuZ2Nous1OZT1Gr-K83C0kq6q6Wfs5Cvmw2tlSiOk3oFf8H4kQ';
const instance = axios.create({
    baseURL: ' https://api.sandbox.chimp.net/core/v2',
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
