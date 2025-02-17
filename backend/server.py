from flask import Flask, request, jsonify
from flask_cors import CORS

# from object_detection import detect_objects

import classification

from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route("/upload", methods=["POST"])
def upload_file():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")

    # detected_objects = detect_objects(image)
    detected_objects = []

    if detection_graph and category_index:
        detected_objects = classification.classify(
            detection_graph, category_index, image
        )
    else:
        detected_objects = ["Error: Model not loaded."]  # Default error message

    response = jsonify({"objects": detected_objects})
    response.headers.add("Access-Control-Allow-Origin", "*")  # Explicit CORS header

    return response


if __name__ == "__main__":

    detection_graph, category_index = classification.model_setup()

    app.run(
        host="0.0.0.0",
        port=8080,
        ssl_context=("api.uara.ca-crt.pem", "api.uara.ca-key.pem"),
    )
