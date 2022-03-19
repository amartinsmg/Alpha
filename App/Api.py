from flask import Flask, request, send_file
import numpy as np
from matplotlib import pyplot as plt
from distutils.debug import DEBUG

app = Flask(__name__)
app.config["DEBUG"] = True

@app.route('/plot-graphic', methods=['GET'])
def plot_graphic():
    a = request.args.get('a')
    b = request.args.get('b')
    c = request.args.get('c')
    delta = b ** 2 - 4 *a * c
    if delta > 0:
        x1 = (-b - np.sqrt(delta))/(2 * a)
        x2 = (-b + np.sqrt(delta))/(2 * a)
    else:
        x1 = -b / (2 * a)
        x2 = x1

    x = np.arange((x1 - 2), (x2 + 2), .1)
    y = a * x ** 2 + b * x + c

    fig = plt.figure()
    plt.plot(x, y)
    #plt.show()
    fig.savefig("plot.svg")

    return send_file("plot.svg", mimetype='image/svg')
