import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const productId = getParam("product");
const category = getParam("category") || "tents";

const dataSource = new ExternalServices(category);
const product = new ProductDetails(productId, dataSource);

product.init();