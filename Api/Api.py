from flask import Flask, jsonify, request, send_file
import numpy as np
import sympy as sy
from matplotlib import pyplot as plt
import re

app = Flask(__name__)


@app.route('/plot-graphic', methods=['GET'])
def plot_graphic():
    a = int(request.args.get('a'))
    b = int(request.args.get('b'))
    c = int(request.args.get('c'))
    delta = b**2 - 4 * a * c
    if delta > 0:
        xMin = (-b - np.sqrt(delta)) / (2 * a)
        xMax = (-b + np.sqrt(delta)) / (2 * a)
        if a < 0:
            xMin, xMax = xMin, xMax
    else:
        xMin = xMax = -b / (2 * a)

    x = np.arange((xMin - 2), (xMax + 2), .01)
    y = a * x**2 + b * x + c
    fig = plt.figure()
    plt.plot(x, y)
    fig.savefig('Temp/Plot.svg')
    response = send_file('Temp/Plot.svg', mimetype='application/xml')
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


@app.route('/roots-vertex')
def roots_vertex():
    a = int(request.args.get('a'))
    b = int(request.args.get('b'))
    c = int(request.args.get('c'))
    ax2 = 'x\u00B2' if a == 1 else '-x\u00B2' if a == -1 else ('{}x\u00B2').format(a)
    if b == 1:
        bx = '+x '
    elif b == -1:
        bx = '-x '
    elif b > 0:
        bx = ('+{}x ').format(b)
    elif b < 0:
        bx = ('{}x ').format(b)
    else:
        bx = ''
    cStr = ('+{}').format(c) if c > 0 else str(c) if c < 0 else ''
    form = ('y = {} {}{}').format(ax2, bx, cStr).strip()

    delta = b**2 - 4 * a * c
    x = sy.symbols('x')
    y = sy.solve(a * x**2 + b * x + c)
    if delta > 0:
        x1Sym = re.sub('[*]*sqrt', '\u221A', str(y[0]))
        x2Sym = re.sub('[*]*sqrt', '\u221A', str(y[1]))
        x1Num = float(y[0])
        x2Num = float(y[1])
        x1NumFormated = str(x1Num) if (x1Num * 10**5) % 1 == 0 else format(x1Num, '.5f')
        x2NumFormated = str(x2Num) if (x2Num * 10**5) % 1 == 0 else format(x2Num, '.5f')
        x1 = x1Sym if x1Num % 1 == 0 else ('{} (Decimal {})').format(x1Sym, x1NumFormated)
        x2 = x2Sym if x2Num % 1 == 0 else ('{} (Decimal {})').format(x2Sym, x2NumFormated)
        realRoots = 2
    elif delta == 0:
        xSym = str(y[0])
        xNum = float(y[0])
        xNumFormated = str(xNum) if (xNum * 10**5) % 1 == 0 else format(xNum, '.5f')
        x1 = x2 = xSym if xNum % 1 == 0 else ('{} (Decimal {})').format(xSym, xNumFormated)
        realRoots = 1
    else:
        x1 = x2 = ''
        realRoots = 0

    xVertex = str(sy.Rational(-b / (2 * a)))
    yVertex = str(sy.Rational(-delta / (4 * a)))
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