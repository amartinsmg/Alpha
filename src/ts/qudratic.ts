const { expand, float, roots: findRoots, simplify } = require("algebrite");
const { abs, compile, max, min, range } = require("mathjs");

interface IPlotPoints {
  x: number[];
  y: number[];
}

class QuadraticFunction {
  readonly formula: string;
  readonly plotPoits: IPlotPoints;
  readonly roots: string[];
  readonly vertex: string;

  //Gets the coefficient's values and uses Algebrite to calculate the roots

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
      X_2: number = DELTA > 0 ? parseFloat(NUMBER_ROOTS[1]) : null;
    this.formula = `y = ${FORMULA.toLatexString()}`;
    this.roots =
      DELTA >= 0
        ? QuadraticFunction.formatRoots(ROOTS, NUMBER_ROOTS)
        : ["\\text{This quadratic function don't have any real zero.}"];
    this.vertex = `(${VERTEX.map((obj) => obj.toLatexString()).join(", ")})`;
    this.plotPoits = QuadraticFunction.getPlotPoints(
      FORMULA.toString(),
      X_1,
      X_2
    );
  }

  //Format the roots found by Albebrite

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
    else return null;
  }

  //Convert the roots found by Algebrite into an Array with theirs numeric values in string format

  private static numberFormatRoots(roots: any): string[] {
    return float(roots)
      .toString()
      .match(/-?\d*\.?\d+(\.{3})?/g);
  }

  //Take the formula and the roots or x-coordinate of the vertex to get the graph points

  private static getPlotPoints(
    formula: string,
    x1: number,
    x2: number
  ): IPlotPoints {
    const Expression = compile(formula);
    let xMinValue: number, xMaxValue: number;
    if (x2 !== null) {
      if (x1 > x2) [x1, x2] = [x2, x1];
      const EXTRA_VALUE = max(2, abs(x2 - x1) / 5, min(abs(x1), abs(x2)));
      xMinValue = x1 - EXTRA_VALUE;
      xMaxValue = x2 + EXTRA_VALUE;
    } else {
      const EXTRA_VALUE = max(2, abs(x1));
      xMinValue = x1 - EXTRA_VALUE;
      xMaxValue = x1 + EXTRA_VALUE;
    }
    const STEP = abs(xMaxValue - xMinValue) / 100,
      x: number[] = range(xMinValue, xMaxValue, STEP).toArray(),
      y: number[] = x.map((x) => Expression.evaluate({ x }));
    return { x, y };
  }
}

export default QuadraticFunction;
