import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", "#order-summary");
checkout.init();
// Show tax + shipping + order total as soon as the page loads
checkout.calculateOrderTotal();

const zipInput = document.querySelector("#zip");
if (zipInput) {
  const updateTotals = () => {
    if (zipInput.value.trim() !== "") {
      checkout.calculateOrderTotal();
    }
  };
  zipInput.addEventListener("blur", updateTotals);
  zipInput.addEventListener("input", () => {
    if (zipInput.value.trim().length >= 5) {
      checkout.calculateOrderTotal();
    }
  });
}

const form = document.querySelector("#checkout-form");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    checkout.calculateOrderTotal();

    try {
      const result = await checkout.checkout(form);
      console.log("Order submitted successfully:", result);
      alert(
        "Order submitted successfully! Check the console for the server response."
      );
    } catch (err) {
      console.error("Checkout failed:", err);
      alert(
        "There was a problem submitting your order. See console for details."
      );
    }
  });
}