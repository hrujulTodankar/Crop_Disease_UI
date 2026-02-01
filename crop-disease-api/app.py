from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import os

app = Flask(__name__)

# Load models ONCE when server starts
try:
    tomato_model = tf.keras.models.load_model("models/tomato_model.keras", compile=False)
    mango_model = tf.keras.models.load_model("models/mango_model.keras", compile=False)
except Exception as e:
    print(f"Error loading models: {e}")
    tomato_model = None
    mango_model = None

@app.route("/")
def home():
    return jsonify({"status": "API is running"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Validate request
        if "crop" not in request.form:
            return jsonify({"error": "Missing 'crop' parameter"}), 400
        if "image" not in request.files:
            return jsonify({"error": "Missing 'image' file"}), 400
        
        crop = request.form["crop"]
        file = request.files["image"]
        
        if crop not in ["tomato", "mango"]:
            return jsonify({"error": "Crop must be 'tomato' or 'mango'"}), 400
        
        # Check if models are loaded
        model = tomato_model if crop == "tomato" else mango_model
        if model is None:
            return jsonify({"error": "Model not loaded"}), 500
        
        # Process image
        img = Image.open(file).convert("RGB").resize((224, 224))
        img = np.array(img) / 255.0
        img = np.expand_dims(img, axis=0)
        
        # Make prediction
        pred = model.predict(img)
        result = int(np.argmax(pred))
        confidence = float(np.max(pred))
        
        return jsonify({
            "prediction_index": result,
            "confidence": confidence,
            "crop": crop
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
