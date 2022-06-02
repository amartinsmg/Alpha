const { abs, compile, max, min, range } = require("mathjs");

class PlotPoits {
  x: number[];
  y: number[];

  //Take the formula and the roots or x-coordinate to get the graph points

  public constructor(formula: string, ...xValues: number[]) {
    const Expression = compile(formula),
      FilteredXValues = xValues
        .filter((x) => typeof x === "number" && !isNaN(x))
        .sort(),
      X_1 = FilteredXValues[0] ?? 0,
      X_2 = FilteredXValues[FilteredXValues.length - 1] ?? null;
    let xMinValue: number, xMaxValue: number;
    if (X_2 === 0 || X_2) {
      const EXTRA_VALUE = max(2, abs(X_2 - X_1) / 5, min(abs(X_1), abs(X_2)));
      xMinValue = X_1 - EXTRA_VALUE;
      xMaxValue = X_2 + EXTRA_VALUE;
    } else {
      const EXTRA_VALUE = max(2, abs(X_1));
      xMinValue = X_1 - EXTRA_VALUE;
      xMaxValue = X_1 + EXTRA_VALUE;
    }
    const STEP = abs(xMaxValue - xMinValue) / 100,
      x: number[] = range(xMinValue, xMaxValue, STEP).toArray(),
      y: number[] = x.map((x) => Expression.evaluate({ x }));
    return { x, y };
  }
}

export default PlotPoits;
