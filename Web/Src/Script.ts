interface APIData {
  x1?: string;
  x2?: string;
  vertex?: string[];
  form?: string;
  realRoots?: number;
  graph?: string;
  error?: string;
}

function main() {
  
  //Constatns that store elements that will be often read or changed

  const AInput: HTMLInputElement = document.querySelector("#a-value"),
    BInput: HTMLInputElement = document.querySelector("#b-value"),
    CInput: HTMLInputElement = document.querySelector("#c-value"),
    Form: HTMLFormElement = document.querySelector("#input-form"),
    FormDiv: HTMLDivElement = document.querySelector("#function-form"),
    RootsDiv: HTMLDivElement = document.querySelector("#label-roots"),
    ResultRootsDiv: HTMLDivElement = document.querySelector("#roots"),
    CoordinatesDiv: HTMLDivElement = document.querySelector("#label-coordinates"),
    ResultCoordinatesDiv: HTMLDivElement = document.querySelector("#coordinates"),
    GraphDiv: HTMLDivElement = document.querySelector("#graph")

  
  //Call the API, read its response and update the document

  async function calculate(): Promise<void> {
    GraphDiv.innerHTML = null;
    try {
      try {
        testInput([AInput, BInput, CInput]);
      } catch {
        throw "Invalid input!";
      }
      const A = getValue(AInput),
        B = getValue(BInput),
        C = getValue(CInput),
        RESPONSE = await fetch(`http://127.0.0.1:5000/?a=${A}&b=${B}&c=${C}`),
        Data: APIData = await RESPONSE.json(),
        GraphSvg = document.createElement("svg");
      let roots: string;
      if (!RESPONSE.ok) {
        throw Data.error;
      }
      switch (Data.realRoots) {
        case 2:
          roots = `x\u2081 = ${Data.x1}<br>x\u2082 =  ${Data.x2}`;
          break;
        case 1:
          roots = `x = ${Data.x1}`;
          break;
        default:
          roots = "This quadratic function don't have any real zero.";
      }
      FormDiv.textContent = Data.form
        .replace("**2", "\u00b2")
        .replace(/[*]/g, "");
      RootsDiv.textContent = "Roots (when y = 0):";
      ResultRootsDiv.innerHTML = roots
        .replace(/[*]*sqrt/g, "\u221a")
        .replace(/approx/g, "\u2248");
      CoordinatesDiv.textContent = "Vertex:";
      ResultCoordinatesDiv.textContent = `(${Data.vertex.join(", ")})`;
      GraphSvg.innerHTML = Data.graph;
      GraphDiv.appendChild(GraphSvg);
    } catch (err) {
      FormDiv.textContent = "y = ax\u00b2 + bx + c";
      RootsDiv.textContent = null;
      ResultRootsDiv.textContent = null;
      CoordinatesDiv.textContent = null;
      ResultCoordinatesDiv.textContent =
        err instanceof Error ? err.message : err;
    }
    location.href = "#output";
  }

  //Call the main function when form is submitted

  Form.onsubmit = e => {
    calculate();
    e.preventDefault();
  };

  //Methods that call the testInput function for their parent objects when they lose focus

  AInput.onblur = () => testInput([AInput], displayMessage);
  BInput.onblur = () => testInput([BInput], displayMessage);
  CInput.onblur = () => testInput([CInput], displayMessage);

  //Methods that call the whenKeyDown function when a key is downed

  AInput.onkeydown = e => whenKeyDown(e, BInput);
  BInput.onkeydown = e => whenKeyDown(e, CInput);
  CInput.onkeydown = e => whenKeyDown(e);
}

//Read an element's value and check if it's valid

function testInput(els: HTMLInputElement[], catchEroor?: Function): void {
  for (let el of els) {
    const VALUE = getValue(el),
      FractionRegEx = /^-?\d+dividedBy\d+$/,
      DividedByZeroRegEx = /dividedBy0/,
      FloatRegEx = /^-?\d*[.]\d{1,15}$/,
      IntegerRegEx = /^-?\d+$/,
      ZeroFractionRegEx = /^-?0+dividedBy/,
      ZeroFloatRegEx = /^-?0*[.]0+$/,
      ZeroIntegerRegEx = /^-?0+$/,
      VALIDFRACTION =
        FractionRegEx.test(VALUE) && !DividedByZeroRegEx.test(VALUE),
      VALIDEFLOAT = FloatRegEx.test(VALUE),
      VALIDEINTEGER = IntegerRegEx.test(VALUE),
      ZERONUMBER =
        ZeroFractionRegEx.test(VALUE) ||
        ZeroFloatRegEx.test(VALUE) ||
        ZeroIntegerRegEx.test(VALUE);
    try {
      if (el.id === "a-value" && ZERONUMBER) {
        throw "Enter a non-zero number!";
      }
      if (!(VALIDFRACTION || VALIDEFLOAT || VALIDEINTEGER)) {
        throw "Enter a integer, float or fractional number!";
      }
    } catch (err) {
      if (catchEroor) {
        catchEroor(el, err);
      } else {
        throw err;
      }
    }
  }
}

function displayMessage(el: HTMLElement, message: string): void {
  const ParentEl = el.parentElement;
  if (ParentEl.childElementCount === 2) {
    const InvalidMessageDiv = document.createElement("div");
    el.classList.add("invalid-input");
    InvalidMessageDiv.classList.add("invalid-message");
    InvalidMessageDiv.textContent = message;
    ParentEl.appendChild(InvalidMessageDiv);
    el.addEventListener(
      "focus",
      () => {
        el.classList.remove("invalid-input");
        InvalidMessageDiv.remove();
      },
      { once: true }
    );
  }
}

//Get the value of an element and format it

function getValue(el: HTMLInputElement): string {
  return el.value.trim().replace("/", "dividedBy");
}

//Move focus to the next element or submit the form if there is none

function whenKeyDown(e: KeyboardEvent, nextEl?: HTMLInputElement): void {
  if (e.keyCode === 13) {
    if (nextEl) {
      nextEl.focus();
      nextEl.value = "";
      e.preventDefault();
    }
    return void 0;
  }
}

main();
