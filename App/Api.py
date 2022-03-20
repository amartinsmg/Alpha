from flask import Flask, jsonify, request, send_file
import numpy as np
import sympy as sy
from matplotlib import pyplot as plt

app = Flask(__name__)

@app.route('/plot-graphic', methods=['GET'])
def plot_graphic():
    a = int(request.args.get('a'))
    b = int(request.args.get('b'))
    c = int(request.args.get('c'))
    delta = b ** 2 - 4 *a * c
    if delta > 0:
        x1 = (-b - np.sqrt(delta))/(2 * a)
        x2 = (-b + np.sqrt(delta))/(2 * a)
        if a < 0:
            x1,x2 = x2,x1
    else:
        x1 = -b / (2 * a)
        x2 = x1

    x = np.arange((x1 - 2), (x2 + 2), .01)
    y = a * x ** 2 + b * x + c

    fig = plt.figure()
    plt.plot(x, y)
    #plt.show()
    fig.savefig('Temp/Plot.svg')
    f = open("Temp/Plot.svg", "rb")

    response = send_file(f, mimetype = 'application/xml')
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'

    return response


@app.route('/roots-vertex')
def roots_vertex():
    a = int(request.args.get('a'))
    b = int(request.args.get('b'))
    c = int(request.args.get('c'))
    # a = 1
    # b = -1
    # c = -1
    delta = b ** 2 - 4 *a * c
    x = sy.symbols('x')
    r = sy.solve(a * x ** 2 + b * x + c)
    if delta > 0:
        x1Sym = str(r[0])
        x2Sym = str(r[1])
        x1Num = float(r[0])
        x2Num = float(r[1])
        x1NumF = str(x1Num) if len(str(x1Num)) <= len(format(x1Num, '.5f')) else format(x1Num, '.5f')
        x2NumF = str(x2Num) if len(str(x2Num)) <= len(format(x2Num, '.5f')) else format(x2Num, '.5f')
        x1 = x1Sym if x1Num % 1 == 0 else ('{} (Decimal {})').format(x1Sym, x1NumF)
        x2 = x2Sym if x2Num % 1 == 0 else ('{} (Decimal {})').format(x2Sym, x2NumF)
        noRealRoots = False
    elif delta == 0:
        xSym = str(r[0])
        xNum = float(r[0])
        xNumF = str(xNum) if len(str(xNum)) <= len(format(xNum, '.5f')) else format(xNum, '.5f')
        x1 = x2 = xSym if xNum % 1  else ('{} (Decimal {})').format(xSym, xNumF)
        noRealRoots = False
    else:
        x1 = x2 = ''
        noRealRoots = True

    xVertex = str(sy.Rational(-b/(2*a)))
    yVertex = str(sy.Rational(-delta/(4*a)))

    response = jsonify(x1=x1, x2=x2, noRealRoots=noRealRoots, xVertex=xVertex, yVertex=yVertex)
    response.mimetype = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'

    return response
    

if __name__ == '__main__':
    app.run(debug=True)