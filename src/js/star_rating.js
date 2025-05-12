import { loadComponent } from "/src/js/util";
import { init as component_init } from "/src/component/star_rating_component/star_rating_component";

await loadComponent("/src/component/star_rating_component/star_rating.html");
component_init();

const star_rating = document.getElementById("star-rating");
const over_rate = document.getElementById("over_rating");
star_rating.hidden = true;

const user_id = localStorage.getItem("userId");

let map_name;

export function set_map(name) {
  map_name = name;
  star_rating.hidden = false;

  get_over_rate();
}

function get_over_rate() {
  fetch("http://localhost:8080/map/getRate", {
    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({
      mapName: map_name,
    }),
  })
    .then((response) => response.text())
    /* data:rate */
    .then((data) => {
      if (data == "") {
        over_rate.textContent = "尚未有评价";
      } else {
        over_rate.textContent = "总评: " + data;
      }
    });
}

star_rating.set_click((rate) => {
  fetch("http://localhost:8080/map/addRate", {
    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({
      userId: user_id,
      mapName: map_name,
      rate: rate,
    }),
  })
    .then((response) => response.text())
    /* data:rate */
    .then((data) => {
      over_rate.textContent = "总评: " + data;
    });
});
