import { loadComponent } from "/src/js/util";
import { init as mark_title_component_init } from "/src/component/mark_component/mark_title_component";
await loadComponent("/src/component/mark_component/mark_title_component.html");
mark_title_component_init();

const frame = document.getElementById("mark-titles-frame");
const content_search_tip = document.getElementById("mark_titles_tip");
let mapName = null;
let filter = "";

let titles = [];

setMapName(null);
setTips([]);

export function setTips(tips) {
  if (tips.length != 0) {
    let tipStr = "你可能想搜: ";
    tips.forEach((item) => {
      tipStr += '"' + item + '" ';
    });
    content_search_tip.innerHTML = tipStr;
  } else {
    content_search_tip.innerHTML = "";
  }
}

export function setMapName(name) {
  mapName = name;
  fetch("http://localhost:8080/map/getMarkTitles", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mapName: mapName,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      titles = data;
      setFilter(filter);
    });
}

export function setFilter(search_content) {
  filter = search_content;
  frame.innerHTML = "";
  titles.forEach((item) => {
    if (item.title.includes(filter)) {
      const markTitle = document.createElement("mark-title");
      frame.appendChild(markTitle);
      markTitle.init(item.title, item.rate, item.click);
    }
  });
  if (filter != "") {
    filterInContent();
  }
}

async function filterInContent() {
  return await fetch("http://localhost:8080/map/filter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: filter,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setTips(data);
    });
}
