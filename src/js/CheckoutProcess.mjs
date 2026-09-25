import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice),
    quantity: item.Quantity || 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.itemCount = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    console.log("[Checkout] cart key:", this.key, "items:", this.list);
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemCount = this.list.reduce(
      (sum, item) => sum + (item.Quantity || 1),
      0
    );
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + Number(item.FinalPrice) * (item.Quantity || 1),
      0
    );

    const subtotalEl =
      document.querySelector(`${this.outputSelector} #subtotal`) ||
      document.querySelector("#subtotal");

    if (subtotalEl) {
      subtotalEl.innerText = `$${this.itemTotal.toFixed(2)}`;
    } else {
      console.warn("[Checkout] #subtotal element not found in the DOM");
    }
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    const count = this.itemCount || 0;
    this.shipping = count > 0 ? 10 + Math.max(0, count - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxEl =
      document.querySelector(`${this.outputSelector} #tax`) ||
      document.querySelector("#tax");
    const shippingEl =
      document.querySelector(`${this.outputSelector} #shipping`) ||
      document.querySelector("#shipping");
    const orderTotalEl =
      document.querySelector(`${this.outputSelector} #order-total`) ||
      document.querySelector("#order-total");

    if (taxEl) taxEl.innerText = `$${this.tax.toFixed(2)}`;
    if (shippingEl) shippingEl.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotalEl)
      orderTotalEl.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const formData = formDataToJSON(form);
    const order = {
      ...formData,
      orderDate: new Date().toISOString(),
      orderTotal: this.orderTotal.toFixed(2),
      tax: this.tax.toFixed(2),
      shipping: this.shipping,
      items: packageItems(this.list),
    };

    const services = new ExternalServices();
    return services.checkout(order);
  }
}