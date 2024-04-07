export function openLink(link: string): void {
  const $a: HTMLElement = document.createElement("a");
  $a.setAttribute("href", link);
  $a.setAttribute("target", "_blank");
  $a.setAttribute("rel", "noreferrer noopener");
  $a.setAttribute("id", "external");
  const external = document.querySelector("#external");
  external && document.body.removeChild(external);
  document.body.appendChild($a);
  $a.click();
  $a.remove();
}
