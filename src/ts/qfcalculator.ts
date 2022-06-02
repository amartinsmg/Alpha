import Quadratic from "./qudratic";
import "./css/main.css";
import "mathjax/es5/tex-svg.js";
const Plotly = require("plotly.js/dist/plotly-basic.min.js");

declare const MathJax: any;

class QFCalculator {
  //Call MathJax method that convert latex to an svg element and get its innerHTML

  private static convertTexToSvg(texStr: string): string {
    return MathJax.tex2svg(texStr).innerHTML;
  }

  //Get the value of an input element

  private static getInputValue(el: HTMLInputElement): string {
    return el.value.trim().replace(",", ".");
  }

  //Read an input element's value and check if it's valid

  private static validateInputValue(els: HTMLInputElement[]): string {
    for (let el of els) {
      const VALUE: string = QFCalculator.getInputValue(el),
        FractionRegEx = /^-?\d+[/]\d+$/,
        DividedByZeroRegEx = /[/]0/,
        FloatRegEx = /^-?\d*[.]\d{1,15}$/,
        IntegerRegEx = /^-?\d+$/,
        ZeroFractionRegEx = /^-?0+[/]/,
        ZeroFloatRegEx = /^-?0*[.]0+$/,
        ZeroIntegerRegEx = /^-?0+$/,
        VALID_NUMBER =
          (FractionRegEx.test(VALUE) && !DividedByZeroRegEx.test(VALUE)) ||
          FloatRegEx.test(VALUE) ||
          IntegerRegEx.test(VALUE),
        ZERO_NUMBER =
          ZeroFractionRegEx.test(VALUE) ||
          ZeroFloatRegEx.test(VALUE) ||
          ZeroIntegerRegEx.test(VALUE);
      if (!VALID_NUMBER) return "Enter a integer, float or fractional number!";
      if (el.name === "a" && ZERO_NUMBER) return "Enter a non-zero number!";
    }
    return "valid";
  }

  //Format the data from an input element for use in Algebrite

  private static formatInputsValues(els: HTMLInputElement[]): string[] {
    return els.map((el) => {
      const VALUE = QFCalculator.getInputValue(el);
      if (VALUE.match(/\d*[.]\d/)) return `${parseFloat(VALUE) * 1e15}/${1e15}`;
      else return VALUE;
    });
  }

  //Show the errors found in user input

  private static showFeedback(
    el: HTMLInputElement,
    parentForm: HTMLFormElement
  ): void {
    const FEEDBACK = QFCalculator.validateInputValue([el]),
      ParentEl = el.parentElement;
    if (FEEDBACK !== "valid" && ParentEl.childElementCount === 2) {
      const InvalidMessageDiv = document.createElement("div"),
        removeInvalidMessage = () => {
          el.classList.remove("invalid-input");
          InvalidMessageDiv.remove();
        },
        once = true;
      el.classList.add("invalid-input");
      InvalidMessageDiv.classList.add("invalid-feedback");
      InvalidMessageDiv.textContent = FEEDBACK;
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

    const FormulaDiv = document.querySelector("#formula"),
      AInput: HTMLInputElement = document.querySelector("#a-input"),
      BInput: HTMLInputElement = document.querySelector("#b-input"),
      CInput: HTMLInputElement = document.querySelector("#c-input"),
      InputsElements = [AInput, BInput, CInput],
      Form: HTMLFormElement = document.querySelector("#coefficients-form"),
      OutputElement = document.querySelector("#output-data"),
      OutputHeadings = document.querySelectorAll(".output-heading"),
      RootsDiv = document.querySelector("#roots"),
      CoordinatesDiv = document.querySelector("#coordinates"),
      GraphFig = document.querySelector("#graph"),
      ErrorFeedbackDiv = document.querySelector("#error-feedback");

    //Instantiate QuadraticFunction class, read its data and update the document when form is submitted

    Form.onsubmit = (e) => {
      e.preventDefault();
      try {
        if (QFCalculator.validateInputValue(InputsElements) !== "valid")
          throw "Invalid input";
        const [A, B, C] = QFCalculator.formatInputsValues(InputsElements),
          { formula, plotPoits, roots, vertex } = new Quadratic(A, B, C);
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
      //Method that calls the validateAndGetInputValue method for their parent objects when its lose focus

      el.onblur = () => QFCalculator.showFeedback(el, Form);

      //Method that call the whenKeyDown method when a key is downed

      el.onkeydown = (e) => QFCalculator.whenKeyDown(e, InputsElements[i + 1]);
    }
  }
}

window.addEventListener("load", QFCalculator.main);
