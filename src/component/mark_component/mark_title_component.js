class MarkTitle extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });

    const template = document.getElementById("mark-title-template");
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);
    this.titleContent = null;
    this.titleInfo = null;
  }
  connectedCallback() {
    this.titleContent = this.shadowRoot.querySelector(".mark-title-content");
    this.titleInfo = this.shadowRoot.querySelector(".mark-title-info");
  }
  init(title, rate, click) {
    this.titleContent.href = "./mark.html?title=" + title;

    this.titleContent.textContent = title;

    this.titleInfo.innerHTML =
      (rate == null ? "暂无评价 " : "总评: " + rate + " ") +
      "&#9;&#9;" +
      "click: " +
      click;
  }
}

export function init() {
  customElements.define("mark-title", MarkTitle);
}
