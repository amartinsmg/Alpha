//Constatns that store elements that will be often read or changed

const AINPUT: HTMLInputElement = document.querySelector("#a-value"),
  BINPUT: HTMLInputElement = document.querySelector("#b-value"),
  CINPUT: HTMLInputElement = document.querySelector("#c-value"),
  FORM: HTMLFormElement = document.querySelector("#input-form"),
  FORMDIV: HTMLSpanElement = document.querySelector("#function-form span"),
  ROOTSDIV: HTMLSpanElement = document.querySelector("#roots span"),
  RESULTROOTSDIV: HTMLSpanElement = document.querySelector("#result-roots span"),
  COORDINATESDIV: HTMLSpanElement = document.querySelector("#coordinates span"),
  RESULTCOORDINATESDIV: HTMLSpanElement = document.querySelector("#result-coordinates span"),
  GRAPHDIV: HTMLDivElement = document.querySelector("#graph");

//Read an element's value (if empty set it to default) and check if it's valid

function testInput(...els: HTMLInputElement[]) {
  let isValid = true;
  for (let el of els){
    if (el.value.trim() === ""){
      el.value = el.defaultValue;
    }
    const VALUE = el.value.trim(),
      FractionRegEx = /^-?\d+[/]\d+$/,
      DividedByZeroRegEx = /[/]0/,
      FloatRegEx = /^-?\d*[.]\d{1,15}$/,
      IntegerRegEx = /^-?\d+$/,
      ZeroFractionRegEx = /^-?0+[/]/,
      ZeroFloatRegEx = /^-?0*[.]0+$/,
      ZeroIntegerRegEx = /^-?0+$/,
      VALIDFRACTION = FractionRegEx.test(VALUE) && !DividedByZeroRegEx.test(VALUE),
      VALIDEFLOAT = FloatRegEx.test(VALUE),
      VALIDEINTEGER = IntegerRegEx.test(VALUE),
      ParentEl = el.parentElement;
    try{
      if(el.id === "a-value" && (ZeroFractionRegEx.test(VALUE) || ZeroFloatRegEx.test(VALUE) || ZeroIntegerRegEx.test(VALUE))){
        throw "Enter a non-zero number!";
      }
      if(!(VALIDFRACTION || VALIDEFLOAT || VALIDEINTEGER)){
        throw "Enter a integer, float or fractional number!";
      }
    }catch (err){
      if (ParentEl.childElementCount === 2){
        const ErrorSpan = document.createElement("span");
        ErrorSpan.setAttribute("class", "invalid-message");
        ErrorSpan.textContent = err;
        el.style.backgroundColor = "#ff8888";
        ParentEl.appendChild(ErrorSpan);
        el.addEventListener("focus", () => {
          el.removeAttribute("style");
          ParentEl.lastElementChild.remove();
        }, {once: true});
      }
      isValid = false;
    }
  }
  return isValid;
}

//Get the value of an element and format it

function getValue (el: HTMLInputElement){
  return el.value.trim().replace("/", "dividedBy");
}

//Move focus to the next element or submit the form if there is none

function whenKeyDown(e: KeyboardEvent, nextEl?: HTMLInputElement) {
  if (e.keyCode === 13) {
    if (nextEl) {
      nextEl.focus();
      nextEl.value = "";
      e.preventDefault();
    }
  }
};

//Call the API, read its response and update the document

async function main() {
  GRAPHDIV.innerHTML = null;
  try {
    if (!testInput(AINPUT, BINPUT, CINPUT)){
      throw "Invalid input!";
    }
    const A = getValue(AINPUT),
      B = getValue(BINPUT),
      C = getValue(CINPUT),
      RESPONSE = await fetch(`http://127.0.0.1:5000/?a=${A}&b=${B}&c=${C}`);
    if (!RESPONSE.ok){
      throw await RESPONSE.text();
    }
    const {
        x1: X1,
        x2: X2,
        xVertex: XVERTEX,
        yVertex: YVERTEX,
        form: FORM,
        realRoots: REALROOTS,
        graph: GRAPH,
      }: {
        x1: string;
        x2: string;
        xVertex: string;
        yVertex: string;
        form: string;
        realRoots: number;
        graph: string;
      } = await (RESPONSE).json(),
      GRAPHSVG = document.createElement("svg");
    let roots: string;
    switch (REALROOTS) {
      case 2:
        roots = `x\u2081 = ${X1}<br>x\u2082 =  ${X2}`;
        break;
      case 1:
        roots = `x = ${X1}`;
        break;
      default:
        roots = "This quadratic function don't have any real zero.";
    }
    FORMDIV.textContent = FORM.replace("**2", "\u00b2").replace(/[*]/g, "");
    ROOTSDIV.textContent = "Roots (when y = 0):";
    RESULTROOTSDIV.innerHTML = roots
      .replace(/[*]*sqrt/g, "\u221a")
      .replace(/approx/g, "\u2248");
    COORDINATESDIV.textContent = "Vertex:";
    RESULTCOORDINATESDIV.textContent = `(${XVERTEX}, ${YVERTEX})`;
    GRAPHSVG.innerHTML = GRAPH;
    GRAPHDIV.appendChild(GRAPHSVG);
  } catch (err) {
    FORMDIV.textContent = "y = ax\u00b2 + bx + c";
    ROOTSDIV.textContent = null;
    RESULTROOTSDIV.textContent = null;
    COORDINATESDIV.textContent = null;
    RESULTCOORDINATESDIV.textContent = err.message === "Failed to fetch" ? err.message : err;
  }
  location.href = "#result";
}

//Call the main function when form is submitted

FORM.onsubmit = (e) => {
  main();
  e.preventDefault();
};

//Methods that call the testInput function for their parent objects when they lose focus

AINPUT.onblur = () => void testInput(AINPUT);
BINPUT.onblur = () => void testInput(BINPUT);
CINPUT.onblur = () => void testInput(CINPUT);

//Methods that call the whenKeyDown function when a key is downed

AINPUT.onkeydown = (e) => whenKeyDown(e, BINPUT);
BINPUT.onkeydown = (e) => whenKeyDown(e, CINPUT);
CINPUT.onkeydown = (e) => whenKeyDown(e);
