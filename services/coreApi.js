import axios from 'axios';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUVTJOVUk1TTBNMk9VRTJOME13T1RBNFFVTTBSVVU1TWtReFF6UkdSakpDTWtFek5EVTJOUSJ9.eyJpc3MiOiJodHRwczovL2NoaW1wdGVjaC1kZXYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDg4ODAwMCIsImF1ZCI6WyJodHRwczovL2xhYi4yNDQ2Ny5vcmcvYXBpL3YyLyIsImh0dHBzOi8vY2hpbXB0ZWNoLWRldi5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTYyMTQ1NDMzLCJleHAiOjE1NjIxNDcyMzMsImF6cCI6Im5mbEpEUHRxRUNnWmZlQ1NhaHc4NnRnREFPVmhCUTc0Iiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.HD9AuEMMQ8koK2AiDDO1n5N1FOeO7wfNB-JgUP6Dx12zu1oF7rgXwOvdOEcIZSKxmYMar9N-nR6EtqqxbOLNRYxR-SspqWc_BDxmG-Q8q-W9FGUJ02A7z1TrUq4ceaVYQ0mgIQBYfU7Uti96hwvWuzq_KmGo3SGUn4qe_cpBfk1VIBAFyCRXEWMBdcGeYUvtWcjAA28WaxIVSlkVIYX0bz43_xolmkBFicJQgPSagZ0mr41keXBLYlprk8-3Sd99sfjWqfM-zf9hYq2TIyx5Z_bvF7Lx42fIfJ97QlH643rT62t1cjgm10B_mXS50TPH70yc-50sdt8LY9RX0XcHQw';
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
