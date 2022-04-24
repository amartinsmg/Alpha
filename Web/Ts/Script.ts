//Constatns that store elements that will be often read or changed

const AInput: HTMLInputElement = document.querySelector("#a-value"),
  BInput: HTMLInputElement = document.querySelector("#b-value"),
  CInput: HTMLInputElement = document.querySelector("#c-value"),
  Form: HTMLFormElement = document.querySelector("#input-form"),
  FormDiv: HTMLDivElement = document.querySelector("#function-form"),
  RootsDiv: HTMLDivElement = document.querySelector("#roots"),
  ResultRootsDiv: HTMLDivElement = document.querySelector("#result-roots"),
  CoordinatesDiv: HTMLDivElement = document.querySelector("#coordinates"),
  ResultCoordinatesDiv: HTMLDivElement = document.querySelector("#result-coordinates"),
  GraphDiv: HTMLDivElement = document.querySelector("#graph");

//Read an element's value and check if it's valid

function testInput(...els: HTMLInputElement[]): boolean {
  let isValid: boolean = true;
  for (let el of els){
    const VALUE: string = el.value.trim(),
      FractionRegEx: RegExp = /^-?\d+[/]\d+$/,
      DividedByZeroRegEx: RegExp = /[/]0/,
      FloatRegEx: RegExp = /^-?\d*[.]\d{1,15}$/,
      IntegerRegEx: RegExp = /^-?\d+$/,
      ZeroFractionRegEx: RegExp = /^-?0+[/]/,
      ZeroFloatRegEx: RegExp = /^-?0*[.]0+$/,
      ZeroIntegerRegEx: RegExp = /^-?0+$/,
      VALIDFRACTION: boolean = FractionRegEx.test(VALUE) && !DividedByZeroRegEx.test(VALUE),
      VALIDEFLOAT: boolean = FloatRegEx.test(VALUE),
      VALIDEINTEGER: boolean = IntegerRegEx.test(VALUE),
      ZERONUMBER: boolean = ZeroFractionRegEx.test(VALUE) || ZeroFloatRegEx.test(VALUE) || ZeroIntegerRegEx.test(VALUE),
      ParentEl: HTMLElement = el.parentElement;
    try{
      if(el.id === "a-value" && ZERONUMBER){
        throw "Enter a non-zero number!";
      }
      if(!(VALIDFRACTION || VALIDEFLOAT || VALIDEINTEGER)){
        throw "Enter a integer, float or fractional number!";
      }
    }catch (err){
      if (ParentEl.childElementCount === 2){
        const InvalidMessageDiv = document.createElement("div");
        el.classList.add("invalid-input");
        InvalidMessageDiv.classList.add("invalid-message");
        InvalidMessageDiv.textContent = err;
        ParentEl.appendChild(InvalidMessageDiv);
        el.addEventListener("focus", () => {
          el.classList.remove("invalid-input");
          InvalidMessageDiv.remove();
        }, {once: true});
      }
      isValid = false;
    }
  }
  return isValid;
}

//Get the value of an element and format it

function getValue (el: HTMLInputElement): string {
  return el.value.trim().replace("/", "dividedBy");
}

//Call the API, read its response and update the document

async function main(): Promise<void> {
  GraphDiv.innerHTML = null;
  try {
    if (!testInput(AInput, BInput, CInput)){
      throw "Invalid input!";
    }
    const A: string = getValue(AInput),
      B: string = getValue(BInput),
      C: string = getValue(CInput),
      RESPONSE: Response = await fetch(`http://127.0.0.1:5000/?a=${A}&b=${B}&c=${C}`);
    if (!RESPONSE.ok){
      throw (await RESPONSE.json()).error;
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
      GraphSvg = document.createElement("svg");
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
    FormDiv.textContent = FORM.replace("**2", "\u00b2").replace(/[*]/g, "");
    RootsDiv.textContent = "Roots (when y = 0):";
    ResultRootsDiv.innerHTML = roots
      .replace(/[*]*sqrt/g, "\u221a")
      .replace(/approx/g, "\u2248");
    CoordinatesDiv.textContent = "Vertex:";
    ResultCoordinatesDiv.textContent = `(${XVERTEX}, ${YVERTEX})`;
    GraphSvg.innerHTML = GRAPH;
    GraphDiv.appendChild(GraphSvg);
  } catch (err) {
    FormDiv.textContent = "y = ax\u00b2 + bx + c";
    RootsDiv.textContent = null;
    ResultRootsDiv.textContent = null;
    CoordinatesDiv.textContent = null;
    ResultCoordinatesDiv.textContent = err instanceof Error ? err.message : err;
  }
  location.href = "#output";
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
};

//Call the main function when form is submitted

Form.onsubmit = (e): void => {
  main();
  e.preventDefault();
};

//Methods that call the testInput function for their parent objects when they lose focus

AInput.onblur = (): void => void testInput(AInput);
BInput.onblur = (): void => void testInput(BInput);
CInput.onblur = (): void => void testInput(CInput);

//Methods that call the whenKeyDown function when a key is downed

AInput.onkeydown = (e): void => whenKeyDown(e, BInput);
BInput.onkeydown = (e): void => whenKeyDown(e, CInput);
CInput.onkeydown = (e): void => whenKeyDown(e);
