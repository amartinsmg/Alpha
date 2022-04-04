from flask import Flask, jsonify, make_response, request
from io import StringIO
from math import sqrt
from matplotlib import pyplot as plt
from numpy import arange
from re import sub as re_sub
from sympy import Rational as rational, solve, symbols


app = Flask(__name__)


@app.route('/plot-graphic', methods=['GET'])
def plot_graphic():
    a = int(request.args.get('a'))
    b = int(request.args.get('b'))
    c = int(request.args.get('c'))
    delta = b**2 - 4 * a * c
    if delta > 0:
        xMin = (-b - sqrt(delta)) / (2 * a)
        xMax = (-b + sqrt(delta)) / (2 * a)
        if a < 0:
            xMin, xMax = xMin, xMax
    else:
        xMin = xMax = -b / (2 * a)
    xMin -= 2
    xMax += 2
    x = arange(xMin, xMax, .01)
    y = a * x**2 + b * x + c
    fig = plt.figure()
    plt.plot(x, y)
    img_data = StringIO()
    fig.savefig(img_data, format='svg')
    img_data.seek(0)
    data = img_data.getvalue()
    response = make_response(data)
    response.mimetype='application/xml'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


@app.route('/roots-vertex')
def roots_vertex():
    a = int(request.args.get('a'))
    b = int(request.args.get('b'))
    c = int(request.args.get('c'))
    delta = b**2 - 4 * a * c
    x = symbols('x')
    y = a * x**2 + b * x + c
    form = str(y)
    root = solve(y)
    if delta > 0:
        x1Sym = str(root[0])
        x2Sym = str(root[1])
        x1Num = float(root[0])
        x2Num = float(root[1])
        x1NumFormated = f'= {x1Num}' if (x1Num * 10**5) % 1 == 0 else 'approx {:.5f}'.format(x1Num)
        x2NumFormated = f'= {x2Num}' if (x2Num * 10**5) % 1 == 0 else 'approx {:.5f}'.format(x2Num)
        x1 = x1Sym if x1Num % 1 == 0 else f'{x1Sym} {x1NumFormated}'
        x2 = x2Sym if x2Num % 1 == 0 else f'{x2Sym} {x2NumFormated}'
        realRoots = 2
    elif delta == 0:
        xSym = str(root[0])
        xNum = float(root[0])
        xNumFormated = f'= {xNum}' if (xNum * 10**5) % 1 == 0 else '\u2248 {:.5f}...'.format(xNum)
        x1 = x2 = xSym if xNum % 1 == 0 else f'{xSym} {xNumFormated}'
        realRoots = 1
    else:
        x1 = x2 = ''
        realRoots = 0

    xVertex = str(rational(-b, (2 * a)))
    yVertex = str(rational(-delta, (4 * a)))
    response = jsonify(FORM=form,
                       X1=x1,
                       X2=x2,
                       REALROOTS=realRoots,
                       XVERTEX=xVertex,
                       YVERTEX=yVertex)
    response.mimetype = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


if __name__ == '__main__':
    app.run(debug=True)