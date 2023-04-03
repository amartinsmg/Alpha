# Quadratic Function Calculator

This is a personal project for a quadratic function calculator that can take user input and calculate and display the results and graph.

## How it works
The calculator gets the coefficients from input elements and instantiates the QuadraticFunction class. The constructor of this class uses Algebrite, a Javascript library for symbolic computation, to calculate the function's roots and vertex coordinates. MathJs, a math library, is used to calculate the plot points.

Plotly, a library for data visualization, uses the plot points to plot the function. The other data is formatted using MathJax, a Javascript library for converting Latex to SVG and other formats, and displayed to the user.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.

## Contributing
Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.
