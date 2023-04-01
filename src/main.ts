import "./css/main.css";
import QuadraticFunctionCalculator from "./ts/qfcalculator";

/**
  instantiates the QuadraticFunctionCalculator class when the web page is fully loaded.
  It ensures that all necessary resources and elements are available before the
  calculator is initialized, preventing errors that could occur if the calculator were
  initialized too early
 */

window.addEventListener(
  "load",
  () =>
    void new QuadraticFunctionCalculator(
      "#formula",
      ["#a-input", "#b-input", "#c-input"],
      "#coefficients-form",
      "#output-data",
      ".output-heading",
      "#roots",
      "#coordinates",
      "#graph",
      "#error-feedback"
    )
);
