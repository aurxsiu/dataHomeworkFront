import { insertTextAtCursor } from "/src/js/text_area_util";
import { marked } from "marked";

class MarkEditor extends HTMLElement {
  constructor() {
    super();

    this.popup = null;
    this.upload_button = null;
    this.editor = null;
    this.saveBtn = null;
    this.mark_show = null;
    this.mdTitle = null;
    const template = document.getElementById("mark-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
  }

  connectedCallback() {
    this.upload_button = this.querySelector(".md-upload");
    this.popup = this.querySelector("#editor-popup");
    this.editor = this.querySelector(".md-input");
    this.saveBtn = this.querySelector("#save-btn");
    this.mdTitle = this.querySelector("#title");
    const editor = this.editor;
    const mark_show = this.querySelector(".md-preview");
    const mark_frame = this.querySelector(".md-show");
    const popup = this.popup;
    const closeBtn = this.querySelector("#close-editor-btn");

    this.mark_show = mark_show;

    closeBtn.addEventListener("click", () => {
      popup.style.display = "none";
    });

    let oldValue = editor.value;
    setInterval(() => {
      if (editor.value !== oldValue) {
        oldValue = editor.value;
        mark_show.innerHTML = marked.parse(oldValue);
      }
    }, 500);

    let fontSize = 14;

    const minSize = 5;
    const maxSize = 28;
    let mark_show_scale = 1;
    const scaleStep = 0.05;
    editor.addEventListener("wheel", (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();

      if (e.deltaY < 0) {
        fontSize = Math.min(fontSize + 1, maxSize);
      } else {
        fontSize = Math.max(fontSize - 1, minSize);
      }

      // 缩放同步更新
      editor.style.fontSize = `${fontSize}px`;
      editor.style.letterSpacing = `${(fontSize * 0.01).toFixed(2)}px`;
      editor.style.lineHeight = `${(fontSize * 0.05 + 1).toFixed(2)}`;
    });
    mark_show.addEventListener("wheel", (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();

      if (e.deltaY < 0) {
        mark_show_scale = Math.min(mark_show_scale + scaleStep, 3); // 放大
      } else {
        mark_show_scale = Math.max(mark_show_scale - scaleStep, 0.5); // 缩小
      }
      mark_show.style.transform = `scale(${mark_show_scale})`;
    });
  }

  set_trigger(trigger_button) {
    if (trigger_button instanceof HTMLElement) {
      trigger_button.addEventListener("click", (event) => {
        this.popup.style.display = "flex";
      });
    }
  }

  set_upload_function(upload_function) {
    if (typeof upload_function !== "function" || upload_function.length != 1) {
      throw Error("错误参数");
    }

    this.upload_button.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const url = await upload_function(file);
        let markDown = "";
        if (file.type.startsWith("image/")) {
          markDown = `![Image](${url})`;
        } else {
          markDown = `[${file.name}](${url})`;
        }
        insertTextAtCursor(this.editor, markDown);
      } catch (err) {
        alert("Upload failed.");
      }
    });
  }

  set_save(save_function) {
    if (typeof save_function !== "function" || save_function.length != 2) {
      throw Error("错误参数");
    }

    this.saveBtn.addEventListener("click", async () => {
      if (this.mdTitle.value == "") {
        alert("标题!");
        return;
      }

      const mdTitle = this.mdTitle.value;

      if (mdTitle.includes("/") || mdTitle.includes("\\")) {
        alert("标题使用了不寻常的符号!");
        return;
      }
      const content = this.editor.value;
      const result = await save_function(content, mdTitle);
      if (result) {
        this.editor.value = "";
        this.mark_show.innerHTML = "";
        this.popup.style.display = "none";
      }
    });
  }
}

export function init() {
  customElements.define("mark-editor", MarkEditor);
}
