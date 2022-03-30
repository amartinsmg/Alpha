const AINPUT = document.querySelector("#aValue"),
  BINPUT = document.querySelector("#bValue"),
  CINPUT = document.querySelector("#cValue"),
  FORM = document.querySelector("#input-form");

//Function that calls the Api

async function calculate() {
  const A = parseInt(AINPUT.value),
    B = parseInt(BINPUT.value),
    C = parseInt(CINPUT.value),
    ROOTSDIV = document.querySelector("#roots span"),
    ROOTSRESULTDIV = document.querySelector("#result-roots span"),
    VERTEX = document.querySelector("#coordinates span"),
    RESULTCOORDINATES = document.querySelector("#result-coordinates span"),
    FORMDIV = document.querySelector("#function-form span"),
    GRAPHICDIV = document.querySelector("#graphic");
  GRAPHICDIV.innerHTML = null;
  try {
    if (isNaN(A) || isNaN(B) || isNaN(C)) {
      throw 'In a quadratic function "a", "b" and "c" must be numbers!';
    } else if (A === 0) {
      throw 'In a quadratic function "a" must be a number NOT equal 0!';
    }
    const { X1, X2, XVERTEX, YVERTEX, FORM, REALROOTS } = await (
        await fetch(`http://127.0.0.1:5000/roots-vertex?a=${A}&b=${B}&c=${C}`)
      ).json(),
      GRAPHICXML = await (
        await fetch(`http://127.0.0.1:5000/plot-graphic?a=${A}&b=${B}&c=${C}`)
      ).text(),
      GRAPHICSVG = document.createElement("svg");
    let roots;
    switch (REALROOTS) {
      case 2:
        roots = `x' = ${X1}<br>x" =  ${X2}`;
        break;
      case 1:
        roots = `x = ${X1}`;
        break;
      default:
        roots = "This quadratic function don't have any real zero.";
    }
    FORMDIV.textContent = FORM;
    ROOTSDIV.textContent = "Roots (when y = 0):";
    ROOTSRESULTDIV.innerHTML = roots;
    VERTEX.textContent = "Vertex:";
    RESULTCOORDINATES.textContent = `(${XVERTEX}, ${YVERTEX})`;
    GRAPHICSVG.innerHTML = GRAPHICXML;
    GRAPHICDIV.appendChild(GRAPHICSVG);
  } catch (err) {
    FORMDIV.textContent = "y = ax\u00B2 + bx + c";
    ROOTSDIV.textContent = null;
    ROOTSRESULTDIV.textContent = err;
    VERTEX.textContent = null;
    RESULTCOORDINATES.textContent = null;
  }
  location.href = "#result";
}

//Functions that change the document

function defaultValue(inputElement) {
  if (inputElement.value === "") {
    inputElement.value = "0";
  }
}

FORM.onsubmit = (e) => {
  calculate();
  e.preventDefault();
};

AINPUT.onkeydown = function (e) {
  if (e.keyCode === 13) {
    defaultValue(this);
    BINPUT.focus();
    BINPUT.value = "";
    e.preventDefault();
  }
};

BINPUT.onkeydown = function (e) {
  if (e.keyCode === 13) {
    defaultValue(this);
    CINPUT.focus();
    CINPUT.value = "";
    e.preventDefault();
  }
};

CINPUT.onkeydown = function (e) {
  if (e.keyCode === 13) {
    defaultValue(this);
    FORM.onsubmit(e);
  }
};
