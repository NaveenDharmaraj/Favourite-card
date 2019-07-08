import axios from 'axios';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUVTJOVUk1TTBNMk9VRTJOME13T1RBNFFVTTBSVVU1TWtReFF6UkdSakpDTWtFek5EVTJOUSJ9.eyJpc3MiOiJodHRwczovL2NoaW1wdGVjaC1kZXYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDk5OTAwMCIsImF1ZCI6Imh0dHBzOi8vbGFiLjI0NDY3Lm9yZy9hcGkvdjIvIiwiaWF0IjoxNTYyNTczODMzLCJleHAiOjE1NjI2MDk4MzMsImF6cCI6Im5mbEpEUHRxRUNnWmZlQ1NhaHc4NnRnREFPVmhCUTc0IiwiZ3R5IjoicGFzc3dvcmQifQ.WCEFToR-9wPEGHfvbW7n-_SzYWyesxHeRh6B5XZS1Pi8_k3cik9BpnNfq3J5BDQ0JJbpeRHXTX81lxmcGHS3_9JJjfa4uyIKZk_qcJOevu3h42IDJVcKIxpGGnhFHdOggd_uxv9Nfh_FsCw76HE0Azy2krPEAT3NvgRCw-V7dgDOD5JxlZOI-opb_ATly1FpXUGlu4_CPjeYOs55EmSMoLUnHkxZ3WgMcRDheuW6WS31D0eabsKZDRHjp8X-ZEc92qjma0zpTZ-1_HgKoVsWGwLQOlW08rhTMHJ5wP4B66ohCO18epJiZP0GDbs5OHnCjG6VsbKPCRhw82sdtd39gw';
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
