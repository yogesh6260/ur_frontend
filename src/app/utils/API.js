import axios from "axios";

export const client = axios.create({
  baseURL: "https://ur-backend-pz7o.onrender.com",
});
