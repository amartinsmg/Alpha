class QFCalculator {

  public static main(): void {

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

    //Call the API, read its response and update the document

    async function calculate(): Promise<void> {
      GraphDiv.innerHTML = null;
      try {
        if (!QFCalculator.testInput(AInput, BInput, CInput)){
          throw "Invalid input!";
        }
        const A = QFCalculator.getValue(AInput),
          B = QFCalculator.getValue(BInput),
          C = QFCalculator.getValue(CInput),
          RESPONSE = await fetch(`http://127.0.0.1:5000/?a=${A}&b=${B}&c=${C}`),
          Data = await RESPONSE.json();
        if (!RESPONSE.ok){
          throw Data.error;
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
          } = Data,
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
      location.href = "#outputs";
    }

    //Call the main function when form is submitted

    Form.onsubmit = (e) => {
      calculate();
      e.preventDefault();
    };

    //Methods that call the testInput function for their parent objects when they lose focus

    AInput.onblur = () => void QFCalculator.testInput(AInput);
    BInput.onblur = () => void QFCalculator.testInput(BInput);
    CInput.onblur = () => void QFCalculator.testInput(CInput);

    //Methods that call the whenKeyDown function when a key is downed

    AInput.onkeydown = (e) => QFCalculator.whenKeyDown(e, BInput);
    BInput.onkeydown = (e) => QFCalculator.whenKeyDown(e, CInput);
    CInput.onkeydown = (e) => QFCalculator.whenKeyDown(e);
  }

  //Read an element's value and check if it's valid

  private static testInput(...els: HTMLInputElement[]): boolean {
    let isValid: boolean = true;
    for (let el of els){
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
        ZERONUMBER = ZeroFractionRegEx.test(VALUE) || ZeroFloatRegEx.test(VALUE) || ZeroIntegerRegEx.test(VALUE),
        ParentEl = el.parentElement;
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

  private static getValue (el: HTMLInputElement): string {
    return el.value.trim().replace("/", "dividedBy");
  }

    //Move focus to the next element or submit the form if there is none

  private static whenKeyDown(e: KeyboardEvent, nextEl?: HTMLInputElement): void {
    if (e.keyCode === 13) {
      if (nextEl) {
        nextEl.focus();
        nextEl.value = "";
        e.preventDefault();
      }
      return void 0;
    }
  };  
}

window.onload = QFCalculator.main;
