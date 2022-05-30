import QuadraticFunction from "./qudratic";
import "./main.css";
require("mathjax/es5/tex-svg.js");
const Plotly = require("plotly.js/dist/plotly-basic.min.js");

declare const MathJax: any;

class QFCalculator {
  //Call MathJax method that convert latex to an svg element and get its innerHTML

  public static convertTexToSvg(texStr: string): string {
    return MathJax.tex2svg(texStr).innerHTML;
  }

  //Get the value of an element and format it

  private static getValue(el: HTMLInputElement): string {
    return el.value.trim().replace(",", ".");
  }

  //Read an element's value and check if it's valid

  private static testInputGetValue(
    els: HTMLInputElement[],
    catchError?: Function,
    parentForm?: HTMLFormElement
  ): string[] {
    const VALUES: string[] = els.map((el) => {
      let value: string = QFCalculator.getValue(el);
      const FractionRegEx = /^-?\d+[/]\d+$/,
        DividedByZeroRegEx = /[/]0/,
        FloatRegEx = /^-?\d*[.]\d{1,15}$/,
        IntegerRegEx = /^-?\d+$/,
        ZeroFractionRegEx = /^-?0+[/]/,
        ZeroFloatRegEx = /^-?0*[.]0+$/,
        ZeroIntegerRegEx = /^-?0+$/,
        VALID_NUMBER =
          (FractionRegEx.test(value) && !DividedByZeroRegEx.test(value)) ||
          FloatRegEx.test(value) ||
          IntegerRegEx.test(value),
        ZERO_NUMBER =
          ZeroFractionRegEx.test(value) ||
          ZeroFloatRegEx.test(value) ||
          ZeroIntegerRegEx.test(value);
      if (value.match(FloatRegEx))
        value = `${parseFloat(value) * 1e15}/${1e15}`;
      try {
        if (!VALID_NUMBER) throw "Enter a integer, float or fractional number!";
        if (el.name === "a" && ZERO_NUMBER) throw "Enter a non-zero number!";
      } catch (err) {
        if (catchError) catchError(el, err, parentForm);
        else throw "Invalid input!";
      }
      return value;
    });
    return VALUES;
  }

  //Show the errors found in user input

  private static showFeedback(
    el: HTMLElement,
    message: string,
    parentForm: HTMLFormElement
  ): void {
    const ParentEl = el.parentElement;
    if (ParentEl.childElementCount === 2) {
      const InvalidMessageDiv = document.createElement("div"),
        removeInvalidMessage = () => {
          el.classList.remove("invalid-input");
          InvalidMessageDiv.remove();
        },
        once = true;
      el.classList.add("invalid-input");
      InvalidMessageDiv.classList.add("invalid-feedback");
      InvalidMessageDiv.textContent = message;
      ParentEl.appendChild(InvalidMessageDiv);
      el.addEventListener("input", removeInvalidMessage, { once });
      parentForm.addEventListener("reset", removeInvalidMessage, { once });
    }
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

    const FormulaDiv: HTMLDivElement = document.querySelector("#formula"),
      AInput: HTMLInputElement = document.querySelector("#a-input"),
      BInput: HTMLInputElement = document.querySelector("#b-input"),
      CInput: HTMLInputElement = document.querySelector("#c-input"),
      InputsElements = [AInput, BInput, CInput],
      Form: HTMLFormElement = document.querySelector("#coeficients-form"),
      OutputElement: HTMLOutputElement = document.querySelector("#output-data"),
      OutputHeadings: NodeListOf<HTMLHeadingElement> =
        document.querySelectorAll(".output-heading"),
      RootsDiv: HTMLDivElement = document.querySelector("#roots"),
      CoordinatesDiv: HTMLDivElement = document.querySelector("#coordinates"),
      GraphFig: HTMLElement = document.querySelector("#graph"),
      ErrorFeedbackDiv: HTMLDivElement =
        document.querySelector("#error-feedback");

    //Call the API, read its response and update the document when form is submitted

    Form.onsubmit = (e) => {
      e.preventDefault();
      try {
        const [A, B, C] = QFCalculator.testInputGetValue(InputsElements);
        const { formula, plotPoits, roots, vertex } = new QuadraticFunction(
          A,
          B,
          C
        );
        OutputHeadings.forEach((el) => el.classList.remove("non-display"));
        FormulaDiv.innerHTML = QFCalculator.convertTexToSvg(formula);
        RootsDiv.innerHTML = roots
          .map((str) => QFCalculator.convertTexToSvg(str))
          .join("");
        CoordinatesDiv.innerHTML = QFCalculator.convertTexToSvg(vertex);
        Plotly.newPlot(GraphFig, [{ ...plotPoits, mode: "line" }]);
      } catch (err) {
        FormulaDiv.innerHTML =
          QFCalculator.convertTexToSvg("y = ax^2 + bx + c");
        OutputHeadings.forEach((el) => el.classList.add("non-display"));
        RootsDiv.innerHTML = null;
        CoordinatesDiv.innerHTML = null;
        GraphFig.innerHTML = null;
        ErrorFeedbackDiv.textContent = err instanceof Error ? err.message : err;
        Form.addEventListener(
          "submit",
          () => (ErrorFeedbackDiv.textContent = null)
        );
        throw err;
      }
      OutputElement.scrollIntoView();
    };

    for (let [i, el] of InputsElements.entries()) {
      //Method that calls the testInputGetValue method for their parent objects when its lose focus

      el.onblur = () =>
        void QFCalculator.testInputGetValue(
          [el],
          QFCalculator.showFeedback,
          Form
        );

      //Method that call the whenKeyDown method when a key is downed

      el.onkeydown = (e) => QFCalculator.whenKeyDown(e, InputsElements[i + 1]);
    }
  }
}

window.addEventListener("load", QFCalculator.main);
