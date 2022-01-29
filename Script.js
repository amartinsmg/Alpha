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
    FORM = document.querySelector(".function-form");
  try {
    const [Y0, COORDINATES] = quadraticFunction(A, B, C);
    FORM.innerHTML = formQF(A, B, C);
    YZERO.innerHTML = "When y = 0:";
    RESULTDIV.innerHTML = Y0;
    VERTEX.innerHTML = "Vertex Coordinates:";
    RESULTCOORDINATES.innerHTML = COORDINATES;
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
