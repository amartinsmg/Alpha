# Quadratic Function Calculator

This is a personal project for a web quadratic function calculator. It can take data from user input and calculates and displays the result. and the graph

The page gets the coefficients from the input elements and instantiates the QuadraticFunction class. Its constructor uses Algebrite, a Javascript library for symbolic computation, to calculate the function's roots and vertex coordinates and MathJs, a math library, to calculate the plot points.

Plotly, a library for data visualization, uses the plot points to plot the function. The other data is formatted using MathJax, a Javascript library for converting Latex to SVG and other formats, and displayed to the user.

To build this project, clone this repository and run these commands:

```sh
npm install
npm run build
```
