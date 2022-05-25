from flask import Flask, jsonify, request
from quadratic import calculate, convert_args

app = Flask(__name__)

# Get the arguments, process data and send it in JSON format


@app.route('/', methods=["GET"])
def quadratic_f_calculator():
    try:
        a, b, c = [convert_args(c, request.args.get(c)) for c in ['a', 'b', 'c']]
    except Exception as e:
        response = jsonify(error=str(e))
        response.status = 400
    else:
        try:
            data = calculate(a, b, c)
            response = jsonify(data)
            response.status = 200
        except Exception as e:
            print(str(e))
            response = jsonify(error='Internal error!')
            response.status = 500

    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


if __name__ == '__main__':
    app.run(debug=True)
