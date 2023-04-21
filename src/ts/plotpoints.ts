const { abs, compile, max, min, range } = require("mathjs");

class PlotPoits {
  x: number[];
  y: number[];

/**
  Creates an object with x and y values, both arrays of numbers, where each common index brings a coordinate to be plotted.
    @param formula - A string with a mathematical formula.
    @param xValues - Numerical values of x that must be present in the returned coordinates.
    @returns - An object with the properties x and y, both being arrays of numbers where each common index brings a coordinate to draw a graph.
*/

  public constructor(formula: string, ...xValues: (number | null)[]) {
    const Expression: any = compile(formula),
      FilteredXValues = xValues
        .filter((x) => typeof x === "number" && !isNaN(x))
        .sort((a, b) => (a as number) - (b as number)),
      X_1 = FilteredXValues[0] ?? 0,
      X_2 = FilteredXValues[FilteredXValues.length - 1] ?? X_1,
      EXTRA_VALUE: number = max(2, abs(X_2 - X_1) / 5, min(abs(X_1), abs(X_2))),
      X_MIN_VALUE = X_1 - EXTRA_VALUE,
      X_MAX_VALUE = X_2 + EXTRA_VALUE,
      STEP = abs(X_MAX_VALUE - X_MIN_VALUE) / 100;
    this.x = range(X_MIN_VALUE, X_MAX_VALUE, STEP).toArray();
    this.y = this.x.map((x) => Expression.evaluate({ x }));
  }
}

export default PlotPoits;
