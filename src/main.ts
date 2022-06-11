import "./css/main.css";
import QuadraticFunctionCalculator from "./ts/qfcalculator";

window.onload = () =>
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
  );
