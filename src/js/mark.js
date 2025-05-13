import { marked } from "marked";
import { loadComponent } from "/src/js/util";
import { init as mark_component_init } from "/src/component/mark_component/mark_component";
import { post } from "jquery";

await loadComponent("/src/component/mark_component/mark.html");
mark_component_init();

const mark_view = document.getElementById("editor");
const trigger_button = document.getElementById("mark_editor_trigger");
let userId = null;
let mapName = null;
trigger_button.hidden = true;
mark_view.set_trigger(trigger_button);

const files_upload = [];

async function upload_file(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);
  formData.append("mapName", mapName);

  const response = await fetch("http://localhost:8080/map/uploadFile", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed: " + response.statusText);
  }

  const fileId = await response.text();
  const result = "http://localhost:8080/map/file/" + fileId;
  files_upload.push(fileId);

  return result;
}

mark_view.set_upload_function(upload_file);
mark_view.set_save((content) => {
  fetch("http://localhost:8080/map/saveMark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      markContent: content,
      filesUploaded: files_upload,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw Error("网络错误");
    }
    files_upload.splice(0, files_upload.length);
  });
});
export function set_trigger(map_name) {
  trigger_button.hidden = false;
  userId = localStorage.getItem("userId");
  mapName = map_name;
}
