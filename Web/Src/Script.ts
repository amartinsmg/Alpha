const AINPUT: HTMLInputElement = document.querySelector("#aValue"),
  BINPUT: HTMLInputElement = document.querySelector("#bValue"),
  CINPUT: HTMLInputElement = document.querySelector("#cValue"),
  FORM: HTMLFormElement = document.querySelector("#input-form");

//Function that calls the Api

async function calculate() {
  const A: number = parseInt(AINPUT.value),
    B: number = parseInt(BINPUT.value),
    C: number = parseInt(CINPUT.value),
    ROOTSDIV: HTMLSpanElement = document.querySelector("#roots span"),
    ROOTSRESULTDIV: HTMLSpanElement =
      document.querySelector("#result-roots span"),
    VERTEX: HTMLSpanElement = document.querySelector("#coordinates span"),
    RESULTCOORDINATES: HTMLSpanElement = document.querySelector(
      "#result-coordinates span"
    ),
    FORMDIV: HTMLSpanElement = document.querySelector("#function-form span"),
    GRAPHICDIV: HTMLDivElement = document.querySelector("#graphic");
  GRAPHICDIV.innerHTML = null;
  try {
    if (isNaN(A) || isNaN(B) || isNaN(C)) {
      throw 'In a quadratic function "a", "b" and "c" must be numbers!';
    } else if (A === 0) {
      throw 'In a quadratic function "a" must be a number NOT equal 0!';
    }
    const {
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
      GRAPHICSVG: HTMLElement = document.createElement("svg");
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
    FORMDIV.textContent = FORM.replace(/[*][*]2/, "\u00b2").replace(/[*]/g, "");
    ROOTSDIV.textContent = "Roots (when y = 0):";
    ROOTSRESULTDIV.innerHTML = roots
      .replace(/[*]*sqrt/g, "\u221a")
      .replace(/approx/g, "\u2248");
    VERTEX.textContent = "Vertex:";
    RESULTCOORDINATES.textContent = `(${XVERTEX}, ${YVERTEX})`;
    GRAPHICSVG.innerHTML = GRAPHIC;
    GRAPHICDIV.appendChild(GRAPHICSVG);
  } catch (err) {
    FORMDIV.textContent = "y = ax\u00b2 + bx + c";
    ROOTSDIV.textContent = null;
    ROOTSRESULTDIV.textContent = null;
    VERTEX.textContent = null;
    RESULTCOORDINATES.textContent = err;
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

FORM.onsubmit = function (e: SubmitEvent) {
  calculate();
  if (e) {
    e.preventDefault();
  }
};

AINPUT.onblur = defaultValue.bind(AINPUT, "1");
BINPUT.onblur = defaultValue.bind(BINPUT, "0");
CINPUT.onblur = defaultValue.bind(CINPUT, "0");
AINPUT.onkeydown = (e) => whenKeyDown.apply(AINPUT, [BINPUT, e]);
BINPUT.onkeydown = (e) => whenKeyDown.apply(BINPUT, [CINPUT, e]);
CINPUT.onkeydown = (e) => whenKeyDown.apply(CINPUT, [FORM, e]);
