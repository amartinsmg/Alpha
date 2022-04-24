from flask import Flask, jsonify, request
from io import StringIO
from math import sqrt
from matplotlib import pyplot as plt
from numpy import arange
from sympy import Rational as rational, solve, symbols, sympify

app = Flask(__name__)

#Plot the quadratic function

def plot_graph(a, b, c, delta):
    if delta > 0:
        x_min_value = (-b - sqrt(delta)) / (2 * a)
        x_max_value = (-b + sqrt(delta)) / (2 * a)
        if a < 0:
            x_min_value, x_max_value = x_max_value, x_min_value
        extra_value = max(2, (abs(x_max_value - x_min_value)/5), min(abs(x_min_value), abs(x_max_value)))
    else:
        x_min_value = x_max_value = -b / (2 * a)
        extra_value = max(2, abs(x_max_value))
    x_min_value -= extra_value
    x_max_value += extra_value
    step = abs(x_max_value - x_min_value) / 250
    x = arange(x_min_value, x_max_value, step)
    y = a * x**2 + b * x + c
    fig = plt.figure()
    plt.plot(x, y)
    img_data = StringIO()
    fig.savefig(img_data, format='svg')
    img_data.seek(0)
    data = img_data.getvalue()
    return data

#Get the value of a parameter and convert it to an integer or rational value

def convert_args_to_number(parameter):
    s = request.args.get(parameter)
    try:
        num = float(s)
        num = int(num) if num % 1 == 0 else rational((num * 10**15), 10**15)
    except:
        s = s.replace('dividedBy', '/')
        num = sympify(s)

    return num

#Convert a sympy data to a formatted string

def format_root(symbolic):
    numeric = float(symbolic)

    if numeric % 1 == 0:
        return str(symbolic)
    elif (numeric * 10**5) % 1 == 0:
        return f'{symbolic} = {numeric}'
    else:
        return '{} approx {:.5f}'.format(symbolic, numeric)

#Get the arguments, process data and send it in JSON format

@app.route('/')
def quadratic_function():
    try:
        a = convert_args_to_number('a')
        b = convert_args_to_number('b')
        c = convert_args_to_number('c')
        delta = b**2 - 4 * a * c
        x = symbols('x')
        y = a * x**2 + b * x + c
        data = {'form': f'y = {y}'}
        root = solve(y)
        data['graph'] = plot_graph(a, b, c, delta)
        if delta > 0:
            data['x1'] = format_root(root[0])
            data['x2'] = format_root(root[1])
            data['realRoots'] = 2
        elif delta == 0:
            data['x1'] = data['x2'] = format_root(root[0])
            data['realRoots'] = 1
        else:
            data['x1'] = data['x2'] = ''
            data['realRoots'] = 0
        data['xVertex'] = str(rational(-b, (2 * a)))
        data['yVertex'] = str(rational(-delta, (4 * a)))
        response = jsonify(data)
        response.status = 200
    except Exception as e:
        response = jsonify(error = str(e).capitalize())
        response.status = 400

    response.mimetype = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

if __name__ == '__main__':
    app.run(debug=True)