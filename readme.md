# Quadratic Function Calculator

Hello,

This is a personal project for creating a quadratic function calculator.
It contains two main parts, the API that process the Web Page's input data, which shows its output data.

The front-end application takes the user's input and uses the Fetch API to send the http request to the server.

The server gets the data from the request and uses the sympy, a python library for symbolic computation, to calculate the function's roots and vertex coordinates. The server uses numpy, a library for numeric computation, to calculate the plot poits and matplotlib, a library for data visualization, to obtains the plot in svg format. The server uses Flask, a micro-framework for web development, to receive the request and send the response, which is sent in JSON format.

When the front-end app receive the JSON data, it's formatted using MathJax, a Javascript library for convert Latex to svg and other formats, and displayed to the user.

<figure>
<img src="assets/index.png">
<figcaption>Webpage open in browser</figcaption>
</figure>

<figure>
<img src="assets/result_1.png">
<figcaption>Example of evaluating an expression: inputs, roots and vertex</figcaption>
</figure>

<figure>
<img src="assets/result_2.png">
<figcaption>Example of evaluating an expression: vertex and graph</figcaption>
</figure>