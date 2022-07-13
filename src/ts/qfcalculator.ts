import Quadratic from "./quadratic";
import Calculator from "./calculator";

declare const MathJax: any, Plotly: any;

class QFCalculator extends Calculator {
  //Call MathJax method that convert latex to an svg element and get its innerHTML

  protected static convertTexToSvg(texStr: string): string {
    return MathJax ? MathJax.tex2svg(texStr).innerHTML : texStr;
  }

  //Read an input element's value and check if it's valid

  protected static validateInputValue(els: HTMLInputElement[]): string {
    return Calculator.validateInputValue(els, true, "a");
  }

  //Format the data from an input element for use in Algebrite

  protected static formatInputsValues(els: HTMLInputElement[]): string[] {
    return els.map((el) => {
      const VALUE = QFCalculator.getInputValue(el);
      if (VALUE.match(/\d*[.]\d/)) return `${parseFloat(VALUE) * 1e17}/${1e17}`;
      else return VALUE;
    });
  }

  //Show the errors found in user input

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

    //Constatns that store elements that will be often read or changed

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
    };

    InputsElements.forEach((el, i, arr) => {
      //Method that calls the showFeedback method for their parent objects when its lose focus

      el.onblur = () => QFCalculator.showFeedback(el, Form);

      //Method that call the whenKeyDown method when a key is downed

      el.onkeydown = (e) => QFCalculator.whenKeyDown(e, arr[i + 1]);
    });
  }
}

export default QFCalculator;
