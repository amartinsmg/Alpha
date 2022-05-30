const Algebrite = require("algebrite");
const math = require("mathjs");

interface IPlotPoints {
  x: number[];
  y: number[];
}

class QuadraticFunction {
  readonly formula: string;
  readonly plotPoits: IPlotPoints;
  readonly roots: string[];
  readonly vertex: string;

  constructor(a: string, b: string, c: string) {
    const FORMULA = Algebrite.expand(`${a} * x^2 + (${b}) * x + (${c})`),
      ROOTS: any = Algebrite.roots(FORMULA),
      NUMBER_ROOTS: string[] = QuadraticFunction.numberFormatRoots(ROOTS),
      DELTA_FORMULA = `(${b})^2 - 4 * (${a}) * (${c})`,
      DELTA = parseFloat(Algebrite.float(DELTA_FORMULA).toString()),
      VERTEX_FORMULAS = [
        `-(${b})/(2 * (${a}))`,
        `-(${DELTA_FORMULA})/(4 * (${a}))`,
      ],
      VERTEX = VERTEX_FORMULAS.map((str) => Algebrite.simplify(str)),
      X_1: number =
        DELTA >= 0
          ? parseFloat(NUMBER_ROOTS[0])
          : parseFloat(VERTEX[0].toString()),
      X_2: number = DELTA > 0 ? parseFloat(NUMBER_ROOTS[1]) : null;
    this.formula = `y = ${FORMULA.toLatexString()}`;
    this.roots =
      DELTA >= 0
        ? QuadraticFunction.formatRoots(ROOTS)
        : ["\\text{This quadratic function don't have any real zero.}"];
    this.vertex = `(${VERTEX.map((obj) => obj.toLatexString()).join(", ")})`;
    this.plotPoits = QuadraticFunction.findPlotPoints(
      FORMULA.toString(),
      DELTA,
      X_1,
      X_2
    );
  }

  private static formatRoots(rootsObj: any): string[] {
    let numbericRoots = QuadraticFunction.numberFormatRoots(rootsObj),
      roots: string[] = rootsObj
        .toLatexString()
        .replace("\\begin{bmatrix} ", "")
        .replace(" \\end{bmatrix}", "")
        .split(" & ");
    roots = roots.map((str, i) => {
      let num = numbericRoots[i];
      if (str.match("\\\\")) {
        if (num.match("...")) return `${str} \\approx ${num}`;
        else return `${str} = ${num}`;
      }
      return str;
    });
    if (roots.length === 2)
      roots = roots.map((e, i) => `{x}_{${i + 1}} = ${e}`);
    else if (roots.length === 1) roots = [`x = ${roots.pop()}`];
    return roots;
  }

  private static numberFormatRoots(roots: any): string[] {
    return Algebrite.float(roots)
      .toString()
      .replace("[", "")
      .replace("]", "")
      .split(",");
  }

  private static findPlotPoints(
    formula: string,
    delta: number,
    x1: number,
    x2?: number
  ): IPlotPoints {
    const expression = math.compile(formula);
    let extraValue: number, xMinValue: number, xMaxValue: number, step: number;
    if (delta > 0) {
      if (x1 > x2) [x1, x2] = [x2, x1];
      extraValue = math.max(
        2,
        math.abs(x2 - x1) / 5,
        math.min(math.abs(x1), math.abs(x2))
      );
      xMinValue = x1 - extraValue;
      xMaxValue = x2 + extraValue;
    } else {
      extraValue = math.max(2, math.abs(x1));
      xMinValue = x1 - extraValue;
      xMaxValue = x1 + extraValue;
    }
    step = math.abs(xMaxValue - xMinValue) / 100;
    let x: number[] = math.range(xMinValue, xMaxValue, step).toArray(),
      y: number[] = x.map((x) => expression.evaluate({ x }));
    return { x, y };
  }
}

export default QuadraticFunction;
