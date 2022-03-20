import { form as formQF, core as quadraticFunction } from "./Calc.mjs";

const AINPUT = document.querySelector("#aValue"),
  BINPUT = document.querySelector("#bValue"),
  CINPUT = document.querySelector("#cValue"),
  FORM = document.querySelector("#input-form");

//Function that calls the others

function calculate() {
  const A = parseInt(AINPUT.value),
    B = parseInt(BINPUT.value),
    C = parseInt(CINPUT.value),
    ROOTSDIV = document.querySelector("#roots span"),
    RESULTDIV = document.querySelector("#result-roots span"),
    VERTEX = document.querySelector("#coordinates span"),
    RESULTCOORDINATES = document.querySelector("#result-coordinates span"),
    FORM = document.querySelector("#function-form"),
    GRAPHICDIV = document.querySelector("#graphic");
  GRAPHICDIV.innerHTML = null;
  try {
    const [ROOTS, COORDINATES] = quadraticFunction(A, B, C);
    FORM.textContent = formQF(A, B, C);
    ROOTSDIV.textContent = "Roots (when y = 0):";
    RESULTDIV.innerHTML = ROOTS.replace(/\n/, "<br>");
    VERTEX.textContent = "Vertex:";
    RESULTCOORDINATES.textContent = `(${COORDINATES.join(", ")})`;
    void (async function (){
      const GRAPHICXML = await (await fetch(`http://127.0.0.1:5000/plot-graphic?a=${A}&b=${B}&c=${C}`)).text(),
        GRAPHICSVG = document.createElement("svg");
      GRAPHICSVG.innerHTML = GRAPHICXML;
      GRAPHICDIV.appendChild(GRAPHICSVG);
    })()
  } catch (err) {
    FORM.textContent = "y = ax\u00B2 + bx + c";
    ROOTSDIV.textContent = "This is NOT a Quadratic Function";
    RESULTDIV.textContent = err;
    VERTEX.textContent = null;
    RESULTCOORDINATES.textContent = null;
  }
  location.href = "#result";
}

//Functions that change the document

FORM.onsubmit = (e) => {
  calculate();
  e.preventDefault();
};

AINPUT.onkeydown = (e) => {
  if (e.keyCode === 13) {
    BINPUT.focus();
    BINPUT.value = "";
    e.preventDefault();
  }
};

BINPUT.onkeydown = (e) => {
  if (e.keyCode === 13) {
    if (BINPUT.value === ""){
      BINPUT.value = "0";
    }
    CINPUT.focus();
    CINPUT.value = "";
    e.preventDefault();
  }
};

CINPUT.onkeydown = (e) => {
  if (e.keyCode === 13) {
    if (CINPUT.value === ""){
      CINPUT.value = "0";
    }
    FORM.onsubmit(void e)
  }
};
