export const getHost = () =>
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:9000/"
    : 
    "https://h1b1club.com/";
