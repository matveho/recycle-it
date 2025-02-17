import tensorflow as tf
import numpy as np

from PIL import Image

# Load TensorFlow Model
model = tf.keras.applications.MobileNetV2(weights="imagenet")


def crop_center(image, crop_fraction=0.5):
    """Crop the center of the image to focus on the main object."""
    width, height = image.size
    new_width, new_height = int(width * crop_fraction), int(height * crop_fraction)

    left = (width - new_width) // 2
    top = (height - new_height) // 2
    right = left + new_width
    bottom = top + new_height

    return image.crop((left, top, right, bottom))


def preprocess_image(image):
    image = crop_center(image)
    image = image.resize((224, 224))
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    return image


def detect_objects(image):
    processed_image = preprocess_image(image)
    predictions = model.predict(processed_image)
    # detected_objects = decode_predictions(predictions)
    decoded = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=3)[
        0
    ]

    top_label, top_confidence = decoded[0][1], decoded[0][2]

    # Genertae the result in string array format
    if top_confidence > 0.7:
        return [f"This appears to be a {top_label}."]
    elif top_confidence > 0.4:
        return [f"This looks somewhat like a {top_label}, but it's not certain."]
    else:
        return [label for (_, label, _) in decoded]  # Always return a string array
