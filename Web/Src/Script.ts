const AINPUT: HTMLInputElement = document.querySelector("#aValue"),
  BINPUT: HTMLInputElement = document.querySelector("#bValue"),
  CINPUT: HTMLInputElement = document.querySelector("#cValue"),
  FORM: HTMLFormElement = document.querySelector("#input-form"),
  FORMDIV: HTMLSpanElement = document.querySelector("#function-form span"),
  ROOTSDIV: HTMLSpanElement = document.querySelector("#roots span"),
  RESULTROOTSDIV: HTMLSpanElement = document.querySelector("#result-roots span"),
  COORDINATESDIV: HTMLSpanElement = document.querySelector("#coordinates span"),
  RESULTCOORDINATESDIV: HTMLSpanElement = document.querySelector("#result-coordinates span"),
  GRAPHICDIV: HTMLDivElement = document.querySelector("#graphic");

function testAndGetInput(el: HTMLInputElement) :string {
  const FractionRegEx = /^-?\d+[/]\d+$/,
    FloatRegEx = /^-?\d*[.]\d{1,6}$/,
    IntegerRegEx = /^-?\d+$/,
    DivideByZeroRegEx = /[/]0/,
    INPUT = el.value.trim(),
    VALIDFRACTION = FractionRegEx.test(INPUT) && !DivideByZeroRegEx.test(INPUT),
    VALIDEFLOAT = FloatRegEx.test(INPUT),
    VALIDEINTEGER = IntegerRegEx.test(INPUT),
    ParentEl = el.parentElement;
  try{
    if(el.id === "aValue" && (/^-?0+[/]/.test(INPUT) || /^-?0+[.]0+$/.test(INPUT))){
      throw "Please, enter a non-zero number!";
    }
    if(VALIDFRACTION || VALIDEFLOAT || VALIDEINTEGER){
      return INPUT.replace("/", "dividedBy");
    }else {
      throw "Please, enter a integer, float or fractional number!";
    }
  }catch (err){
    const ErrorSpan = document.createElement("span");
    ErrorSpan.setAttribute("class", "invalid-message")
    ErrorSpan.textContent = err;
    ParentEl.setAttribute("class", "invalid-input")
    ParentEl.appendChild(ErrorSpan)
    el.addEventListener("focus", () => {
      ParentEl.removeAttribute("class");
      ParentEl.lastElementChild.remove();
    }, {once: true});
    throw "Invalid Input!"
  }
  
}

//Function that calls the Api

async function calculate() {
  GRAPHICDIV.innerHTML = null;
  try {
    const A = testAndGetInput(AINPUT),
      B = testAndGetInput(BINPUT),
      C = testAndGetInput(CINPUT),
      {
        X1,
        X2,
        XVERTEX,
        YVERTEX,
        FORM,
        REALROOTS,
        GRAPHIC,
      }: {
        X1: string;
        X2: string;
        XVERTEX: string;
        YVERTEX: string;
        FORM: string;
        REALROOTS: number;
        GRAPHIC: string;
      } = await (
        await fetch(`http://127.0.0.1:5000/?a=${A}&b=${B}&c=${C}`)
      ).json(),
      GRAPHICSVG = document.createElement("svg");
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
    GRAPHICSVG.innerHTML = GRAPHIC;
    GRAPHICDIV.appendChild(GRAPHICSVG);
  } catch (err) {
    FORMDIV.textContent = "y = ax\u00b2 + bx + c";
    ROOTSDIV.textContent = null;
    RESULTROOTSDIV.textContent = null;
    COORDINATESDIV.textContent = null;
    RESULTCOORDINATESDIV.textContent = err.message === "Failed to fetch" ? err.message : err;
  }
  location.href = "#result";
}

//Functions that provides reactivity to document

const defaultValue = function (value: string) {
    if (this.value === "") {
      this.value = value;
    }
  },
  whenKeyDown = function (nextEl: HTMLElement, e: KeyboardEvent) {
    if (e.keyCode === 13) {
      this.onblur();
      if (nextEl instanceof HTMLFormElement) {
        nextEl.submit();
      } else if (nextEl instanceof HTMLInputElement) {
        nextEl.focus();
        nextEl.value = "";
        e.preventDefault();
      }
    }
  };

FORM.onsubmit = function (e) {
  calculate();
  if (e) {
    e.preventDefault();
  }
};

AINPUT.onblur = defaultValue.bind(AINPUT, "1");
BINPUT.onblur = defaultValue.bind(BINPUT, "0");
CINPUT.onblur = defaultValue.bind(CINPUT, "0");
AINPUT.onkeydown = (e) => whenKeyDown.call(AINPUT, BINPUT, e);
BINPUT.onkeydown = (e) => whenKeyDown.call(BINPUT, CINPUT, e);
CINPUT.onkeydown = (e) => whenKeyDown.call(CINPUT, FORM, e);
