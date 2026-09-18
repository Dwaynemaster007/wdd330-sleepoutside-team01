// Reads a list of announcements from alerts.json and renders one <p> per
// alert into a <section class="alert-list">, which is prepended to <main>.
// Each alert controls its own message + colors, so editing alerts.json is
// all that's needed to add/change/remove an announcement -- no code changes.
export default class Alert {
  constructor(path = "/json/alerts.json") {
    this.path = path;
  }

  async init() {
    const alerts = await this.getAlerts();

    if (Array.isArray(alerts) && alerts.length > 0) {
      this.renderAlerts(alerts);
    }
  }

  async getAlerts() {
    try {
      const response = await fetch(this.path);
      if (!response.ok) {
        throw new Error(`Failed to load alerts: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  renderAlerts(alerts) {
    const main = document.querySelector("main");
    if (!main) return;

    const section = document.createElement("section");
    section.className = "alert-list";

    alerts.forEach((alert) => {
      const p = document.createElement("p");
      p.textContent = alert.message;
      p.style.backgroundColor = alert.background;
      p.style.color = alert.color;
      section.appendChild(p);
    });

    main.prepend(section);
  }
}
