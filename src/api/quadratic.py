from io import StringIO
from matplotlib import pyplot as plt
from numpy import arange, sqrt
from sympy import Rational as rational, solve, symbols, sympify

# Calculate function roots and vertex coordinates

def calculate(a, b, c):
    delta = b**2 - 4 * a * c
    x = symbols('x')
    y = a * x**2 + b * x + c
    # Dictionary that stores the function data
    f = {'form': f'y = {y}'}
    roots = solve(y)
    f['graph'] = plot_graph(float(a), float(b), float(c), float(delta))
    if delta > 0:
        f['roots'] = [format_root(roots[0]), format_root(roots[1])]
    elif delta == 0:
        f['roots'] = [format_root(roots[0])]
    else:
        f['roots'] = []
    xVertex = str(sympify(f'{-b}/{2 * a}', rational=True))
    yVertex = str(sympify(f'{-delta}/{4 * a}', rational=True))
    f['vertex'] = [xVertex, yVertex]
    return f

# Plot the quadratic function

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
    graph = img_data.getvalue()
    return graph

# Get the value of a parameter and convert it to an integer or rational value

def convert_args_to_number(parameter, value):
    try:
        num = float(value)
        num = int(num) if num % 1 == 0 else rational((num * 10**15), 10**15)
    except:
        value = value.replace('dividedBy', '/')
        num = sympify(value)
        try:
            float(num)
        except:
            raise Exception(f'{parameter} must be a real number')
    if parameter == 'a' and num == 0:
        raise Exception('a must be a non-zero number')
    return num

# Convert a sympy data to a formatted string

def format_root(symbolic):
    numeric = float(symbolic)
    if numeric % 1 == 0:
        return str(symbolic)
    elif (numeric * 10**5) % 1 == 0:
        return f'{symbolic} = {numeric}'
    else:
        return '{} approx {:.5f}'.format(symbolic, numeric)
