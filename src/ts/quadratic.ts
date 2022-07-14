const { expand, float, roots: findRoots, simplify } = require("algebrite");
import PlotPoits from "./plotpoints";

class QuadraticFunction {
  readonly formula: string;
  readonly plotPoits: PlotPoits;
  readonly roots: string[];
  readonly vertex: string;

  // This constructor gets the coefficient's values and uses Algebrite to calculate the roots

  public constructor(a: string, b: string, c: string) {
    const FORMULA = expand(`${a} * x^2 + (${b}) * x + (${c})`),
      ROOTS: any = findRoots(FORMULA),
      NUMBER_ROOTS: string[] = QuadraticFunction.numberFormatRoots(ROOTS),
      DELTA_FORMULA = `(${b})^2 - 4 * (${a}) * (${c})`,
      DELTA = parseFloat(float(DELTA_FORMULA).toString()),
      VERTEX_FORMULAS = [
        `-(${b})/(2 * (${a}))`,
        `-(${DELTA_FORMULA})/(4 * (${a}))`,
      ],
      VERTEX: any[] = VERTEX_FORMULAS.map((str) => simplify(str)),
      X_1: number =
        DELTA >= 0
          ? parseFloat(NUMBER_ROOTS[0])
          : parseFloat(float(VERTEX[0]).toString()),
      X_2: number | null = DELTA > 0 ? parseFloat(NUMBER_ROOTS[1]) : null;
    this.formula = `y = ${FORMULA.toLatexString()}`;
    this.roots =
      DELTA >= 0
        ? QuadraticFunction.formatRoots(ROOTS, NUMBER_ROOTS)
        : ["\\text{This quadratic function don't have any real zero.}"];
    this.vertex = `(${VERTEX.map((obj) => obj.toLatexString()).join(", ")})`;
    this.plotPoits = new PlotPoits(FORMULA.toString(), X_1, X_2);
  }

  // This method formats the roots found by Albebrite

  private static formatRoots(rootsObj: any, numbericRoots: string[]): string[] {
    const ROOTS: string[] = rootsObj
      .toLatexString()
      .replace(/\\(begin|end){bmatrix}/g, "")
      .split("&")
      .map((str: string) => str.trim())
      .map((str: string, i: number) => {
        const NUM = numbericRoots[i];
        if (str.match(/\\/)) {
          if (NUM.match(/\.{3}/)) return `${str} \\approx ${NUM}`;
          else return `${str} = ${NUM}`;
        }
        return str;
      });
    if (ROOTS.length === 2) return ROOTS.map((e, i) => `{x}_{${i + 1}} = ${e}`);
    else if (ROOTS.length === 1) return [`x = ${ROOTS.pop()}`];
    else return [];
  }

  // This method converts the roots found by Algebrite to an Array with numeric values in string format

  private static numberFormatRoots(roots: any): string[] {
    return float(roots)
      .toString()
      .match(/-?\d*\.?\d+(\.{3})?/g);
  }
}

export default QuadraticFunction;
