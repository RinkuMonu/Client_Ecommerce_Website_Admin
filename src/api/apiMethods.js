// /src/api/apiMethods.js
import { axiosInstance } from "./axiosInstance";

function apiGet(url, params = {}) {
  return axiosInstance.get(url, { params });
}

function apiPost(url, body) {
  let headers = {};
  // const headers = {
  //   "Content-Type": contentType,
  // };
  if (body instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  } else {
    headers["Content-Type"] = "application/json";
  }
  return axiosInstance.post(url, body);
}

function apiPut(url, body) {
  const headers = {};
  if (body instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  } else {
    headers["Content-Type"] = "application/json";
  }
  return axiosInstance.put(url, body, { headers });
}
function apiPatch(url, body) {
  return axiosInstance.patch(url, body);
}

function apiDelete(url) {
  return axiosInstance.delete(url);
}

export { apiGet, apiPost, apiPut, apiPatch, apiDelete };
