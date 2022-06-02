const { abs, compile, max, min, range } = require("mathjs");

class PlotPoits {
  x: number[];
  y: number[];

  //Take the formula and the roots or x-coordinate to get the graph points

  public constructor(formula: string, ...xValues: number[]) {
    const Expression: any = compile(formula),
      FilteredXValues = xValues
        .filter((x) => typeof x === "number" && !isNaN(x))
        .sort(),
      X_1 = FilteredXValues[0] ?? 0,
      X_2 = FilteredXValues[FilteredXValues.length - 1] ?? X_1,
      EXTRA_VALUE: number = max(2, abs(X_2 - X_1) / 5, min(abs(X_1), abs(X_2))),
      X_MIN_VALUE = X_1 - EXTRA_VALUE,
      X_MAX_VALUE = X_2 + EXTRA_VALUE,
      STEP = abs(X_MAX_VALUE - X_MIN_VALUE) / 100,
      x: number[] = range(X_MIN_VALUE, X_MAX_VALUE, STEP).toArray(),
      y: number[] = x.map((x) => Expression.evaluate({ x }));
    return { x, y };
  }
}

export default PlotPoits;
