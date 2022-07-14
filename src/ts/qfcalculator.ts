import Quadratic from "./quadratic";
import Calculator from "./calculator";

declare const MathJax: any, Plotly: any;

class QFCalculator extends Calculator {
  // This method calls the MathJax tex2svg method to convert latex to an SVG element and get its innerHTML

  protected static convertTexToSvg(texStr: string): string {
    return MathJax ? MathJax.tex2svg(texStr).innerHTML : texStr;
  }

  // This method reads the value of an input element and checks if it's valid

  protected static validateInputValue(els: HTMLInputElement[]): string {
    return Calculator.validateInputValue(els, true, "a");
  }

  // This method  formats the data from an input element to be used in Algebrite

  protected static formatInputsValues(els: HTMLInputElement[]): string[] {
    return els.map((el) => {
      const VALUE = QFCalculator.getInputValue(el);
      if (VALUE.match(/\d*[.]\d/)) return `${parseFloat(VALUE) * 1e17}/${1e17}`;
      else return VALUE;
    });
  }

  // This method displays the errors found in user input above the input element

  protected static showFeedback(
    el: HTMLInputElement,
    parentForm: HTMLFormElement
  ): void {
    Calculator.showFeedback(el, parentForm, QFCalculator);
  }

  public constructor(
    formulaSelector: string,
    inputsSelectors: string[],
    formSelector: string,
    outputSelector: string,
    outputHsSelctor: string,
    rootsDivSelector: string,
    coordinatesDivSelector: string,
    graphDivSelector: string,
    errorFeedbackDivSelector: string
  ) {
    super();

    // Constants that store elements that are to be read or changed

    const FormulaDiv = document.querySelector(formulaSelector) as HTMLElement,
      InputsElements = inputsSelectors.map(
        (selector) => document.querySelector(selector) as HTMLInputElement
      ),
      Form = document.querySelector(formSelector) as HTMLFormElement,
      OutputElement = document.querySelector(outputSelector) as HTMLElement,
      OutputHeadings = document.querySelectorAll(
        outputHsSelctor
      ) as NodeListOf<HTMLElement>,
      RootsDiv = document.querySelector(rootsDivSelector) as HTMLElement,
      CoordinatesDiv = document.querySelector(
        coordinatesDivSelector
      ) as HTMLElement,
      GraphDiv = document.querySelector(graphDivSelector) as HTMLElement,
      ErrorFeedbackDiv = document.querySelector(
        errorFeedbackDivSelector
      ) as HTMLElement;

    // This function gets the data from user input when the form is submitted and uses it to
    // instantiate QuadraticFunction class. Then it reads the returned data and updates the document


    Form.addEventListener("submit", (e) => {
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
        if (Plotly)
          Plotly.newPlot(
            GraphDiv,
            [
              {
                ...plotPoits,
                mode: "line",
              },
            ],
            {
              margin: {
                l: 60,
                r: 5,
                b: 20,
                t: 5,
              },
            }
          );
      } catch (err) {
        FormulaDiv.innerHTML =
          QFCalculator.convertTexToSvg("y = ax^2 + bx + c");
        OutputHeadings.forEach((el) => el.classList.add("non-display"));
        RootsDiv.innerHTML = "";
        CoordinatesDiv.innerHTML = "";
        GraphDiv.innerHTML = "";
        ErrorFeedbackDiv.textContent =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "Error";
        Form.addEventListener(
          "submit",
          () => (ErrorFeedbackDiv.textContent = null)
        );
        throw err;
      }
      OutputElement.scrollIntoView();
    });

    InputsElements.forEach((el, i, arr) => {
      // This method calls the showFeedback method for its parent object when it loses focus

      el.addEventListener("blur", () => QFCalculator.showFeedback(el, Form));

      // This method calls the whenKeyDown method when a key is downed

      el.addEventListener("keydown", (e) => QFCalculator.whenKeyDown(e, arr[i + 1]));
    });
  }
}

export default QFCalculator;
