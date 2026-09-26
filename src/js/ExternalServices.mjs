// Fallback to default API URL if VITE_SERVER_URL is not set in build environment
const rawBaseURL =
  import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";
// Ensure baseURL always ends with a slash
const baseURL = rawBaseURL.endsWith("/") ? rawBaseURL : `${rawBaseURL}/`;

// Parse the body first so error details from the server are available,
// then throw a custom object (not Error) so callers can read message.
async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  }
  throw { name: "servicesError", message: jsonResponse };
}

export default class ExternalServices {
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

  // Search across known categories and filter by name/brand (API is category-based).
  async searchProducts(query) {
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];

    const lists = await Promise.all(
      categories.map((cat) => this.getData(cat).catch(() => []))
    );
    const all = lists.flat();
    const seen = new Set();
    return all.filter((product) => {
      if (!product || seen.has(product.Id)) return false;
      seen.add(product.Id);
      const name = (product.Name || "").toLowerCase();
      const brand = (product.Brand?.Name || "").toLowerCase();
      const without = (product.NameWithoutBrand || "").toLowerCase();
      return name.includes(q) || brand.includes(q) || without.includes(q);
    });
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(`${baseURL}checkout`, options);
    return convertToJson(response);
  }
}
