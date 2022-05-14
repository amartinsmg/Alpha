require("mathjax/es5/tex-svg.js");

declare let MathJax: any;

interface IAPIDataSucess {
  readonly roots: string[];
  readonly vertex: string[];
  readonly formula: string;
  readonly graph: string;
}

interface IAPIDataError {
  readonly error: string;
}

type APIData = IAPIDataSucess | IAPIDataError;

class QFCalculator {
  readonly roots: string;
  readonly vertex: string;
  readonly formula: string;
  readonly graph: string;

  private constructor({ roots, vertex, formula, graph }: IAPIDataSucess) {
    const convertTexToSvg = QFCalculator.convertTexToSvg;
    switch (roots.length) {
      case 2:
        this.roots = roots
          .map((e, i) => convertTexToSvg(`{x}_{${i + 1}} = ${e}`))
          .join("");
        break;
      case 1:
        this.roots = convertTexToSvg(`x = ${roots.pop()}`);
        break;
      default:
        this.roots = "This quadratic function don't have any real zero.";
    }
    this.vertex = convertTexToSvg(`(${vertex.join(", ")})`);
    this.formula = QFCalculator.convertTexToSvg(formula);
    this.graph = graph;
  }

  //Read an element's value and check if it's valid

  private static testInput(
    els: HTMLInputElement[],
    catchEroor?: Function
  ): void {
    for (let el of els) {
      const VALUE = QFCalculator.getValue(el),
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
        VALIDENUMBER = VALIDFRACTION || VALIDEFLOAT || VALIDEINTEGER,
        ZERONUMBER =
          ZeroFractionRegEx.test(VALUE) ||
          ZeroFloatRegEx.test(VALUE) ||
          ZeroIntegerRegEx.test(VALUE);
      try {
        if (el.name === "a" && ZERONUMBER) throw "Enter a non-zero number!";
        if (!VALIDENUMBER) throw "Enter a integer, float or fractional number!";
      } catch (err) {
        if (catchEroor) catchEroor(el, err);
        else throw "Invalid input!";
      }
    }
  }

  private static showFeedback(el: HTMLElement, message: string): void {
    const ParentEl = el.parentElement;
    if (ParentEl.childElementCount === 2) {
      const InvalidMessageDiv = document.createElement("div");
      el.classList.add("invalid-input");
      InvalidMessageDiv.classList.add("invalid-feedback");
      InvalidMessageDiv.textContent = message;
      ParentEl.appendChild(InvalidMessageDiv);
      el.addEventListener(
        "keydown",
        () => {
          el.classList.remove("invalid-input");
          InvalidMessageDiv.remove();
        },
        { once: true }
      );
    }
  }

  //Get the value of an element and format it

  private static getValue(el: HTMLInputElement): string {
    return el.value.trim().replace("/", "dividedBy").replace(",", ".");
  }

  private static convertTexToSvg(texStr: string): string {
    return MathJax.tex2svg(texStr).innerHTML;
  }

  //Move focus to the next element or submit the form if there is none

  private static whenKeyDown(
    e: KeyboardEvent,
    nextEl?: HTMLInputElement
  ): void {
    if (e.keyCode === 13) {
      if (nextEl) {
        nextEl.focus();
        nextEl.value = "";
        e.preventDefault();
      }
      return void 0;
    }
  }

  public static main(): void {
    //Constatns that store elements that will be often read or changed

    const showFeedback = QFCalculator.showFeedback,
      getValue = QFCalculator.getValue,
      testInput = QFCalculator.testInput,
      whenKeyDown = QFCalculator.whenKeyDown,
      FormulaDiv: HTMLDivElement = document.querySelector("#formula"),
      AInput: HTMLInputElement = document.querySelector("#a-input"),
      BInput: HTMLInputElement = document.querySelector("#b-input"),
      CInput: HTMLInputElement = document.querySelector("#c-input"),
      Form: HTMLFormElement = document.querySelector("#input-form"),
      OutputElement: HTMLOutputElement = document.querySelector("#output"),
      OutputHeadings: NodeListOf<HTMLHeadingElement> =
        document.querySelectorAll(".output-heading"),
      RootsDiv: HTMLDivElement = document.querySelector("#roots"),
      CoordinatesDiv: HTMLDivElement = document.querySelector("#coordinates"),
      GraphFig: HTMLElement = document.querySelector("#graph"),
      ErrorFeedbackDiv: HTMLDivElement =
        document.querySelector("#error-feedback");

    //Call the API, read its response and update the document when form is submitted

    Form.onsubmit = async (e) => {
      e.preventDefault();
      GraphFig.innerHTML = null;
      try {
        testInput([AInput, BInput, CInput]);
        const A = getValue(AInput),
          B = getValue(BInput),
          C = getValue(CInput),
          RESPONSE = await fetch(
            `http://${location.hostname}:5000/?a=${A}&b=${B}&c=${C}`
          ),
          Data: APIData = await RESPONSE.json();
        if ("error" in Data) throw Data.error;
        const QuadraticFunction = new QFCalculator(Data);
        OutputHeadings.forEach((el) => el.classList.remove("non-display"));
        FormulaDiv.innerHTML = QuadraticFunction.formula;
        RootsDiv.innerHTML = QuadraticFunction.roots;
        CoordinatesDiv.innerHTML = QuadraticFunction.vertex;
        GraphFig.innerHTML = QuadraticFunction.graph;
      } catch (err) {
        FormulaDiv.innerHTML = MathJax.tex2svg("y = ax^2 + bx + c").innerHTML;
        OutputHeadings.forEach((el) => el.classList.add("non-display"));
        RootsDiv.innerHTML = null;
        CoordinatesDiv.innerHTML = null;
        ErrorFeedbackDiv.textContent = err instanceof Error ? err.message : err;
        Form.addEventListener(
          "submit",
          () => (ErrorFeedbackDiv.textContent = null)
        );
      }
      OutputElement.scrollIntoView();
    };

    //Methods that call the testInput method for their parent objects when they lose focus

    AInput.onblur = () => testInput([AInput], showFeedback);
    BInput.onblur = () => testInput([BInput], showFeedback);
    CInput.onblur = () => testInput([CInput], showFeedback);

    //Methods that call the QFCalculator.whenKeyDown function when a key is downed

    AInput.onkeydown = (e) => whenKeyDown(e, BInput);
    BInput.onkeydown = (e) => whenKeyDown(e, CInput);
    CInput.onkeydown = (e) => whenKeyDown(e);
  }
}

window.addEventListener("load", QFCalculator.main);
