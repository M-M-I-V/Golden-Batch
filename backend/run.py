from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib, pandas

app = Flask(__name__)
CORS(app)

model = joblib.load(r"data = ")
model_columns = joblib.load(str())

@app.route("/predict", methods=["POST"])
def predict():
    """ Sent data should be a JSON
    {
    "Temperature": 0,       -> int
    "Pressure": 0.0,        -> float/double
    "Speed": 0              -> int
    }
    """

    data = request.json()

    if not data:
        return jsonify({"m": "No data is transferred."})
    
    X_new = pandas.DataFrame([data])

    predicted = model.predict(X_new)

    if predicted == 0:
        return "Failed"
    elif predicted == 1:
        return "Passed"
    else:
        return "Something wrong."