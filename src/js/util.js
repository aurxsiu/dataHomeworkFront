export async function loadComponent(url) {
  const res = await fetch(url);
  const html = await res.text();
  const fragment = document.createRange().createContextualFragment(html);
  document.body.appendChild(fragment);
}
