import "./css/main.css";
import QuadraticFunctionCalculator from "./ts/qfcalculator";

// Instantiates the QuadraticFunctionCalculator class when the web page is fully loaded.

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
