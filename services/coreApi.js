import axios from 'axios';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUVTJOVUk1TTBNMk9VRTJOME13T1RBNFFVTTBSVVU1TWtReFF6UkdSakpDTWtFek5EVTJOUSJ9.eyJpc3MiOiJodHRwczovL2NoaW1wdGVjaC1kZXYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDg4ODAwMCIsImF1ZCI6Imh0dHBzOi8vbGFiLjI0NDY3Lm9yZy9hcGkvdjIvIiwiaWF0IjoxNTYyNjYxOTkxLCJleHAiOjE1NjI2OTc5OTEsImF6cCI6Im5mbEpEUHRxRUNnWmZlQ1NhaHc4NnRnREFPVmhCUTc0IiwiZ3R5IjoicGFzc3dvcmQifQ.oKaX-ZvwKriF9v7kT2ChAElFUvfqRjV-d1Nb01mTQRBV52zgangrq-qkDwqwE7aY_mMrIplFSCWSxujmUNrapesMDnnLxvoQ2AsXPliV7FZYF7n0KKcW_Fucq7zxHeGRlKtLOC7PXrS5YbLc-WBsQeldXiJZIxTDhg5hMeDeeTE5Xc-eUMd-4lRLiaIIKGQ3xYwzWBGTQxLQ1ZeXgyB48NKcChkBHflXReU_uGDrHcbQA9tuKxwfaVyf9qIrhTJo2JUuz--uhVXEGOIHhJ5j_sKlKb0Yy0i1Zbdy9AIfP6C3wPWx7GJD6_Aw2r4lp4-gNVkbm43Z2B-DFfbSxccBbQ';
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
