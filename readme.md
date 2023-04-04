# Quadratic Function Calculator

This is a personal project for a quadratic function calculator that can take user input and calculate and display the results and graph.

## How it works
The calculator gets the coefficients from input elements and instantiates the QuadraticFunction class. The constructor of this class uses Algebrite, a Javascript library for symbolic computation, to calculate the function's roots and vertex coordinates. MathJs, a math library, is used to calculate the plot points.

Plotly, a library for data visualization, uses the plot points to plot the function. The other data is formatted using MathJax, a Javascript library for converting Latex to SVG and other formats, and displayed to the user.

## How to run the project
To build and run the project, follow these steps:

1. Clone this repository.
2. Install the dependencies by running `npm install`.
3. Build the project by running `npm run build`.

After the build process is complete, you can open the index.html file located in the 'dist' directory in your web browser to use the calculator.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.

## Contributing
Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.
