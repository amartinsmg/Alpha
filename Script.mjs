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
    GRAPHICDIV = document.querySelector("#sage");
  GRAPHICDIV.innerHTML = null;
  try {
    const [ROOTS, COORDINATES, X1, X2, XVERTEX] = quadraticFunction(A, B, C);
    FORM.textContent = formQF(A, B, C);
    ROOTSDIV.textContent = "Roots (when y = 0):";
    RESULTDIV.innerHTML = ROOTS.replace(/\n/, "<br>");
    VERTEX.textContent = "Vertex:";
    RESULTCOORDINATES.textContent = `(${COORDINATES.join(", ")})`;
    if (navigator.onLine) {
      const DIVMYCELL = document.createElement("div"),
        SAGESCRIPT = document.createElement("script"),
        MINXVALUE = isNaN(X1) ? XVERTEX - 2 : Math.min(XVERTEX, X1) - 2,
        MAXXVALUE = isNaN(X2) ? XVERTEX + 2 : Math.max(XVERTEX, X2) + 2,
        WaitingMakeSageCell = new Promise((resolve) => {
          const INTERVAL = setInterval(() => {
            const BUTTON = document.querySelector(".sagecell_input button");
            if (BUTTON) {
              resolve(BUTTON);
              clearInterval(INTERVAL);
            }
          }, 1);
        });
      DIVMYCELL.id = "cell";
      SAGESCRIPT.setAttribute("type", "text/x-sage");
      SAGESCRIPT.innerHTML = `plot(${A} * x ^ 2 + (${B}) * x + (${C}), (x, ${MINXVALUE}, ${MAXXVALUE}))`;
      DIVMYCELL.appendChild(SAGESCRIPT);
      GRAPHICDIV.appendChild(DIVMYCELL);
      sagecell.makeSagecell({
        inputLocation: "#cell",
        template: sagecell.templates.minimal,
        evalButtonText: "Plot graphic",
      });
      void (async function () {
        const PLOTBUTTON = await WaitingMakeSageCell;
        PLOTBUTTON.style.display = "none";
        PLOTBUTTON.click();
      })();
    }
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
      BINPUT.value = 0;
    }
    CINPUT.focus();
    CINPUT.value = "";
    e.preventDefault();
  }
};

CINPUT.onkeydown = (e) => {
  if (e.keyCode === 13) {
    if (CINPUT.value === ""){
      CINPUT.value = 0;
    }
    FORM.onsubmit(e)
  }
};
