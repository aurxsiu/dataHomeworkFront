class StarRating extends HTMLElement {
  constructor() {
    super();
    this.stars = null;
    this.currentRating = 0;
    const template = document.getElementById("star-rating-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
  }

  connectedCallback() {
    this.stars = this.querySelectorAll("#rating span");

    const stars = this.stars;

    stars.forEach((star) => {
      star.addEventListener("mouseover", () => {
        clearHover();
        const value = parseInt(star.dataset.value);
        this.highlightStars(value, "hover");
      });

      star.addEventListener("mouseout", () => {
        clearHover();
      });

      star.addEventListener("click", () => {
        //TODO:修改实际内容
        this.currentRating = parseInt(star.dataset.value);
        this.highlightStars(this.currentRating, "selected");

        console.log("star click");
      });
    });

    this.querySelector("#rating").addEventListener("mouseleave", resetSelected);

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
      if (this.currentRating > 0) {
        this.highlightStars(this.currentRating, "selected");
      }
    }
  }

  highlightStars(rating, className) {
    this.stars.forEach((star) => {
      if (parseInt(star.dataset.value) <= rating) {
        star.classList.add(className);
      } else {
        star.classList.remove(className);
      }
    });
  }

  set_click(click_function) {
    if (typeof click_function !== "function") {
      throw new TypeError("参数必须是函数");
    }
    if (click_function.length !== 1) {
      throw new Error("传入的函数必须只接受一个参数");
    }

    this.stars.forEach((star) => {
      star.addEventListener("click", () => {
        this.currentRating = parseInt(star.dataset.value);
        this.highlightStars(this.currentRating, "selected");

        click_function(this.currentRating);
      });
    });
  }
}

export function init() {
  customElements.define("star-rating", StarRating);
}
