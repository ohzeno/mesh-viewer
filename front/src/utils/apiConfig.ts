export const getBackendBaseURL = () => {
  if (process.env.NODE_ENV === "dev") {
    return process.env.REACT_APP_BACKEND_API_URL_DEV;
  }
  return process.env.REACT_APP_BACKEND_API_URL_PROD;
};
