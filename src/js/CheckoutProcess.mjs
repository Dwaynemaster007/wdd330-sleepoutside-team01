import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Convert form element to a plain object keyed by input name attributes
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

// Simplify cart items into the shape the checkout API expects
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.Quantity || 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    // Sum dollar amount of items in the cart and count total quantity
    const itemCount = this.list.reduce(
      (sum, item) => sum + (item.Quantity || 1),
      0
    );
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + Number(item.FinalPrice) * (item.Quantity || 1),
      0
    );

    const subtotalEl = document.querySelector(
      `${this.outputSelector} #subtotal`
    );
    if (subtotalEl) {
      subtotalEl.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    // Store item count for shipping calculation
    this.itemCount = itemCount;
  }

  calculateOrderTotal() {
    // Tax: 6% of subtotal
    this.tax = this.itemTotal * 0.06;

    // Shipping: $10 for the first item + $2 for each additional item
    const count = this.itemCount || 0;
    this.shipping = count > 0 ? 10 + Math.max(0, count - 1) * 2 : 0;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxEl = document.querySelector(`${this.outputSelector} #tax`);
    const shippingEl = document.querySelector(
      `${this.outputSelector} #shipping`
    );
    const orderTotalEl = document.querySelector(
      `${this.outputSelector} #order-total`
    );

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