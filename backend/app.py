from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

# Initialize Flask App
app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing)
# This allows your React App (port 5173) to talk to this Python App (port 5000)
CORS(app)

# Load the trained model
# We check if the file exists to avoid crashing if you forgot to run train_model.py
model_path = 'model.pkl'
if os.path.exists(model_path):
    model = joblib.load(model_path)
    print("✅ Model loaded successfully.")
else:
    print("⚠️  WARNING: model.pkl not found. Run 'python train_model.py' first!")
    model = None

@app.route('/')
def home():
    """Simple health check route"""
    return jsonify({
        "status": "online", 
        "message": "Golden Batch API is running. POST to /predict to use."
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Expects JSON input:
    {
        "temperature": 185,
        "pressure": 25
    }
    """
    if not model:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.json
        
        # Extract inputs
        temp = float(data.get('temperature'))
        pressure = float(data.get('pressure'))
        
        # Make prediction
        # The model expects a list of rows, so we wrap inputs in [[]]
        prediction = model.predict([[temp, pressure]])[0]
        
        # Interpret result (0 or 1)
        result = "Pass" if prediction == 1 else "Fail"
        
        return jsonify({
            "input": {
                "temperature": temp,
                "pressure": pressure
            },
            "prediction": result,
            "is_golden_batch": bool(prediction == 1)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)