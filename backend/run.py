from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib, pandas

app = Flask(__name__)
CORS(app)

model = joblib.load(r"data = ")
model_columns = joblib.load(str())

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json()

    if not data:
        return jsonify({"m": "No data is transferred."})
    
    X_new = pandas.DataFrame([data])



    return None