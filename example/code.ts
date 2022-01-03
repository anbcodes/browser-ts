import helloWorld from "./helloworld.ts";

export default function code() {
  console.log("Importing helloworld.ts from code.ts!");

  helloWorld("Hello");
}
