import { loadComponent } from "/src/js/util";
import { init as mark_title_component_init } from "/src/component/mark_component/mark_title_component";
await loadComponent("/src/component/mark_component/mark_title_component.html");
mark_title_component_init();

const frame = document.getElementById("mark-titles-frame");

fetch("http://localhost:8080/map/getMarkTitles", {
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.forEach((item) => {
      const markTitle = document.createElement("mark-title");
      frame.appendChild(markTitle);
      markTitle.init(item.title, item.rate, item.click);
    });
  });
