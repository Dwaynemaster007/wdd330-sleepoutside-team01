// Fallback to default API URL if VITE_SERVER_URL is not set in build environment
const rawBaseURL = import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";
// Ensure baseURL always ends with a slash
const baseURL = rawBaseURL.endsWith("/") ? rawBaseURL : `${rawBaseURL}/`;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status}`);
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
  }

  async getData(category = this.category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}