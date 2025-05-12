var is_init = false;

export async function init() {
  is_init = true;

  class StarRating extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById("star-rating-template");
      const content = template.content.cloneNode(true);
      this.appendChild(content);
    }

    connectedCallback() {
      const stars = this.querySelectorAll("#rating span");
      let currentRating = 0;

      stars.forEach((star) => {
        star.addEventListener("mouseover", () => {
          clearHover();
          const value = parseInt(star.dataset.value);
          highlightStars(value, "hover");
        });

        star.addEventListener("mouseout", () => {
          clearHover();
        });

        star.addEventListener("click", () => {
          //TODO:修改实际内容
          currentRating = parseInt(star.dataset.value);
          highlightStars(currentRating, "selected");

          console.log("star click");
        });
      });

      this.querySelector("#rating").addEventListener(
        "mouseleave",
        resetSelected
      );

      function highlightStars(rating, className) {
        stars.forEach((star) => {
          if (parseInt(star.dataset.value) <= rating) {
            star.classList.add(className);
          } else {
            star.classList.remove(className);
          }
        });
      }

      function clearHover() {
        stars.forEach((star) => {
          star.classList.remove("hover");
        });
      }

      // 初始化已评分状态
      function resetSelected() {
        stars.forEach((star) => {
          star.classList.remove("selected");
        });
        if (currentRating > 0) {
          highlightStars(currentRating, "selected");
        }
      }
    }
  }

  customElements.define("star-rating", StarRating);
}
