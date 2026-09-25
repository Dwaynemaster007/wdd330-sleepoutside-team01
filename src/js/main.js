import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

// Create instance of ExternalServices for tents
const dataSource = new ExternalServices("tents");

// Target the HTML element where the product list will render
const listElement = document.querySelector(".product-list");

// Create instance of ProductList and initialize it
const productList = new ProductList("tents", dataSource, listElement);
productList.init();

// Ticket: "Add customizable alert to index.html"
const alert = new Alert();
alert.init();