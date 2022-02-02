import { form as formQF, core as quadraticFunction } from "./Calc.mjs";

const AINPUT = document.querySelector("#aValue"),
  BINPUT = document.querySelector("#bValue"),
  CINPUT = document.querySelector("#cValue"),
  FORM = document.querySelector("form");

//Function that calls the others

function calculate() {
  const A = parseInt(AINPUT.value),
    B = parseInt(BINPUT.value),
    C = parseInt(CINPUT.value),
    YZERO = document.querySelector("#y-zero"),
    RESULTDIV = document.querySelector("#result-yzero"),
    VERTEX = document.querySelector("#coordinates"),
    RESULTCOORDINATES = document.querySelector("#result-coordinates"),
    FORM = document.querySelector(".function-form"),
    GRAPHICSDIV = document.querySelector("#sage");
  GRAPHICSDIV.innerHTML = "";
  try {
    const [ZEROS, X1, X2, COORDINATES, VERTEXX] = quadraticFunction(A, B, C);
    FORM.innerHTML = formQF(A, B, C);
    YZERO.innerHTML = "Zeros:";
    RESULTDIV.innerHTML = ZEROS.replace(/\n/, "<br>");
    VERTEX.innerHTML = "Vertex:";
    RESULTCOORDINATES.innerHTML = `(${COORDINATES.join(", ")})`;
    if (navigator.onLine) {
      const DIVMYCELL = document.createElement("div"),
        SAGESCRIPT = document.createElement("script"),
        MINXVALUE = isNaN(X1) ? VERTEXX - 2 : Math.min(VERTEXX, X1) - 2,
        MAXXVALUE = isNaN(X2) ? VERTEXX + 2 : Math.max(VERTEXX, X2) + 2;
      DIVMYCELL.setAttribute("id", "cell");
      SAGESCRIPT.setAttribute("type", "text/x-sage");
      SAGESCRIPT.innerHTML = `plot(${A} * x ^ 2 + (${B}) * x + (${C}), (x, ${MINXVALUE}, ${MAXXVALUE}))`;
      DIVMYCELL.appendChild(SAGESCRIPT);
      GRAPHICSDIV.appendChild(DIVMYCELL);
      sagecell.makeSagecell({
        inputLocation: "#cell",
        template: sagecell.templates.minimal,
        evalButtonText: "Plot graphic",
      });
      const PLOTBUTTON = document.querySelector(".sagecell_input button");
      PLOTBUTTON.style.padding = "4px 10px";
      PLOTBUTTON.style.fontSize = ".9em";
      PLOTBUTTON.style.fontFamily = 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif';
      PLOTBUTTON.style.color = "#242424";
      PLOTBUTTON.style.backgroudColor = "#f0f0f0";
    }
    location.href = "#result";
  } catch (e) {
    FORM.innerHTML = "y = ax\u00B2 + bx + c";
    YZERO.innerHTML = "This is NOT a Quadratic Function";
    RESULTDIV.innerHTML = e;
    VERTEX.innerHTML = null;
    RESULTCOORDINATES.innerHTML = null;
  }
}

//Functions that change the document

FORM.onsubmit = () => {
  calculate();
  return false;
};

AINPUT.onkeydown = (e) => {
  if (e.keyCode == 13) {
    BINPUT.focus();
    BINPUT.value = "";
    return false;
  }
};

BINPUT.onkeydown = (e) => {
  if (e.keyCode == 13) {
    CINPUT.focus();
    CINPUT.value = "";
    return false;
  }
};

CINPUT.onkeydown = (e) => {
  if (e.keyCode == 13) {
    return true;
  }
};

//Test function

/* void (function (a, b, c) {
  try {
    console.log(`${formQF(a, b, c)}\n${quadraticFunction(a, b, c)[0]}`);
  } catch (e) {
    console.warn(e);
  }
})(-2, -8, 16); //Ok */
