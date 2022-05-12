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
    roots = solve(y) if delta >= 0 else []
    f['graph'] = plot_graph(*list(map(float, [a, b, c, delta, *roots])))
    f['roots'] = list(map(format_root, roots))
    xVertex = str(sympify(f'({-b})/({2 * a})', rational=True))
    yVertex = str(sympify(f'({-delta})/({4 * a})', rational=True))
    f['vertex'] = [xVertex, yVertex]
    return f


# Plot the quadratic function


def plot_graph(a, b, c, delta, x_1=None, x_2=None):
    plt.switch_backend('svg')
    if delta > 0:
        if x_1 > x_2:
            x_1, x_2 = x_2, x_1
        extra_value = max(2, (abs(x_2 - x_1) / 5), min(abs(x_1), abs(x_2)))
        x_min_value = x_1 - extra_value
        x_max_value = x_2 + extra_value
    else:
        x_vertex = -b / (2 * a)
        extra_value = max(2, abs(x_vertex))
        x_min_value = x_vertex - extra_value
        x_max_value = x_vertex + extra_value

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


# Get the value of a argument and convert it to an integer or rational value


def convert_args(name, value):
    try:
        num = float(value)
        num = int(num) if num % 1 == 0 else rational((num * 10**15), 10**15)
    except:
        value = value.replace('dividedBy', '/')
        num = sympify(value)
        try:
            float(num)
        except:
            raise Exception(f'{name} must be a real number')
    if name == 'a' and num == 0:
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
