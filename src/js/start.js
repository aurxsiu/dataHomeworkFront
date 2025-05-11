class StarRating extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
          .star {
            font-size: 24px;
            cursor: pointer;
            color: lightgray;
          }
          .star.selected {
            color: gold;
          }
        </style>
        <div id="stars">
          <span class="star" data-value="1">&#9733;</span>
          <span class="star" data-value="2">&#9733;</span>
          <span class="star" data-value="3">&#9733;</span>
          <span class="star" data-value="4">&#9733;</span>
          <span class="star" data-value="5">&#9733;</span>
        </div>
      `;
  }

  connectedCallback() {
    const stars = this.shadowRoot.querySelectorAll(".star");
    stars.forEach((star) => {
      star.addEventListener("click", () => {
        const value = parseInt(star.dataset.value);
        this.setRating(value);
      });
    });
  }

  setRating(value) {
    const stars = this.shadowRoot.querySelectorAll(".star");
    stars.forEach((star) => {
      star.classList.toggle("selected", parseInt(star.dataset.value) <= value);
    });
    this.dispatchEvent(new CustomEvent("change", { detail: value }));
  }
}

customElements.define("star-rating", StarRating);
