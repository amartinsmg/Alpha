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
    step = (x_max_value - x_min_value) / 250
    x = arange(x_min_value, x_max_value, step)
    y = a * x**2 + b * x + c
    fig = plt.figure()
    plt.plot(x, y)
    img_data = StringIO()
    fig.savefig(img_data, format='svg')
    img_data.seek(0)
    data = img_data.getvalue()
    return data

#Convert the input value to an integer or rational value

def convert_into_number(num):
    num = num.replace('dividedBy', '/')
    if num.find('/') == -1:
        num = float(num)
        num = int(num) if num % 1 == 0 else rational((num * 10**15), 10**15)
    else:
        num = sympify(num)

    return num

#Get the arguments, process the response items and send it in JSON format

@app.route('/')
def quadratic_function():
    try:
        a = convert_into_number(request.args.get('a'))
        b = convert_into_number(request.args.get('b'))
        c = convert_into_number(request.args.get('c'))
        delta = b**2 - 4 * a * c
        x = symbols('x')
        y = a * x**2 + b * x + c
        data = {'form': f'y = {y}'}
        root = solve(y)
        data['graph'] = plot_graph(a, b, c, delta)
        if delta > 0:
            x1_symbolic = str(root[0])
            x2_symbolic = str(root[1])
            x1_numeric = float(root[0])
            x2_numeric = float(root[1])
            x1_numeric_formated = f'= {x1_numeric}'if (x1_numeric * 10**5) % 1 == 0 else 'approx {:.5f}'.format(x1_numeric)
            x2_numeric_formated = f'= {x2_numeric}' if (x2_numeric * 10**5) % 1 == 0 else 'approx {:.5f}'.format(x2_numeric)
            data['x1'] = x1_symbolic if x1_numeric % 1 == 0 else f'{x1_symbolic} {x1_numeric_formated}'
            data['x2'] = x2_symbolic if x2_numeric % 1 == 0 else f'{x2_symbolic} {x2_numeric_formated}'
            data['realRoots'] = 2
        elif delta == 0:
            x_symbolic = str(root[0])
            x_numeric = float(root[0])
            x_numeric_formated = f'= {x_numeric}' if (x_numeric * 10**5) % 1 == 0 else 'approx {:.5f}'.format(x_numeric)
            data['x1'] = data['x2'] = x_symbolic if x_numeric % 1 == 0 else f'{x_symbolic} {x_numeric_formated}'
            data['realRoots'] = 1
        else:
            data['x1'] = data['x2'] = ''
            data['realRoots'] = 0
        data['xVertex'] = str(rational(-b, (2 * a)))
        data['yVertex'] = str(rational(-delta, (4 * a)))
        response = jsonify(data)
        response.mimetype = 'application/json'
        response.status = 200
    except Exception as e:
        response = jsonify(error = str(e).capitalize())
        response.status = 400

    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

if __name__ == '__main__':
    app.run(debug=True)