import axios from 'axios';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUVTJOVUk1TTBNMk9VRTJOME13T1RBNFFVTTBSVVU1TWtReFF6UkdSakpDTWtFek5EVTJOUSJ9.eyJpc3MiOiJodHRwczovL2NoaW1wdGVjaC1kZXYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDg4ODAwMCIsImF1ZCI6Imh0dHBzOi8vbGFiLjI0NDY3Lm9yZy9hcGkvdjIvIiwiaWF0IjoxNTYyNjQ3OTM5LCJleHAiOjE1NjI2ODM5MzksImF6cCI6Im5mbEpEUHRxRUNnWmZlQ1NhaHc4NnRnREFPVmhCUTc0IiwiZ3R5IjoicGFzc3dvcmQifQ.uLfxwMibLi1w6yTij4q4xdsWKZKLpTgrORpxbLzRNR3pmdB_x_t4Lrkgc2DTWbOGkVA8BXv5Xybts1MqpcQdLuy4vQl8-e_eR0MvRddY16EumMVwg9SKWL0knveYxwTwPoknlosakRWMDu7Ni5CtCB-ehFJp3_v3_RheuJGcBrr6ufGH2KyBT3MAA7y-WX2YvlylAV_kFEOEae7DL1mMqM5SI98rt3ywd7WpIfiqn6z6RqOwcq5NKECzqSe45qjc95yK58xOVsBLEV4NEXFiQ1FfBYS53rC3vKhmfjk9-RsfmvJFfgn9nVKyFT2EvtpPx2FDsdPDCY5f8NdcpM4hRg';
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
