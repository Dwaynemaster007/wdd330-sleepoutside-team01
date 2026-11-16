# ⛺ SleepOutside

An e-commerce storefront for outdoor camping gear, built as the team project for **WDD 330: Web Frontend Development II** (BYU-Pathway Worldwide / BYU-Idaho).

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

**Project board:** [Trello](https://trello.com/b/gGwuGle4/sleep-outside-team-1)

## Features

- **Product listings** by category (tents, backpacks, sleeping bags, hammocks) loaded from the course API
- **Product search**
- **Product detail pages** with discount pricing
- **Shopping cart** saved in `localStorage`, with a cart item count badge
- **Checkout** that calculates subtotal, tax, shipping and order total, validates the form and submits the order to the backend
- **Alerts** banner driven by `alerts.json`
- Shared header and footer partials loaded with JavaScript
- Modular ES classes: `ProductList`, `ProductDetails`, `CheckoutProcess`, `ExternalServices` and `Alert`

## Project structure

```
src/
  index.html             # Home page
  product_listing/       # Category listing page
  product_pages/         # Product detail page
  cart/                  # Shopping cart
  checkout/              # Checkout form and success page
  js/                    # ES modules (utils, product, cart and checkout logic)
  css/                   # Styles
  public/                # Images, JSON data and header/footer partials
```

## Getting started

**You need:** Node.js 18+.

```bash
git clone https://github.com/Dwaynemaster007/wdd330-sleepoutside-team01.git
cd wdd330-sleepoutside-team01
npm install
cp src/.env.sample src/.env   # sets VITE_SERVER_URL for the product API
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` / `npm start` | Starts the Vite dev server |
| `npm run build` | Builds production files into `dist/` |
| `npm run lint` | Runs ESLint |
| `npm run format` | Formats code with Prettier |

## Credits

The starter code came from the [BYU-Idaho WDD 330 course](https://byui-cse.github.io/wdd330-ww-course/). Feature development by **Thubelihle Dlamini** ([GitHub](https://github.com/Dwaynemaster007) · [LinkedIn](https://linkedin.com/in/thubelihledlamini)).
