type Hello = string;

export default function helloworld(str: Hello) {
  console.log("Running helloworld!");
  document.body.innerHTML = `<h1>${str} world!</h1>`;
}
