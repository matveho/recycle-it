from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load TensorFlow Model
model = tf.keras.applications.MobileNetV2(weights="imagenet")

def preprocess_image(image):
    image = image.resize((224, 224))
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    return image

def decode_predictions(predictions):
    decoded = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=3)[0]
    return [label for (_, label, _) in decoded]

@app.route("/upload", methods=["POST"])
def upload_file():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")

    # Preprocess and predict
    processed_image = preprocess_image(image)
    predictions = model.predict(processed_image)
    detected_objects = decode_predictions(predictions)

    response = jsonify({"objects": detected_objects})
    response.headers.add("Access-Control-Allow-Origin", "*")  # Explicit CORS header

    return response

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8080,
        ssl_context=("api.uara.ca-crt.pem", "api.uara.ca-key.pem")
    )
