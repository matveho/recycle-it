import numpy as np
import tensorflow as tf
from PIL import Image
from mrcnn import model as modellib, utils
from mrcnn.config import Config
import json
import os

DATA_DIR = "./data"
ANNOTATIONS_FILE = os.path.join(DATA_DIR, "annotations.json")
NCLASSES = 60

class InferenceConfig(Config):
    NAME = "object"
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1
    NUM_CLASSES = NCLASSES + 1  # Background + objects

def load_class_mapping():
    with open(ANNOTATIONS_FILE) as json_file:
        data = json.load(json_file)
    categories = data["categories"]
    return {int(category["id"]): category["name"] for category in categories}

class MaskRCNNClassifier:
    def __init__(self, model_path):
        self.config = InferenceConfig()
        self.model = modellib.MaskRCNN(mode="inference", config=self.config, model_dir=model_path)
        self.model.load_weights("weights.h5", by_name=True)
        self.class_mapping = load_class_mapping()

    def image2np(self, image):
        (w, h) = image.size
        return np.array(image.getdata()).reshape((h, w, 3)).astype(np.uint8)

    def classify(self, img):
        np_img = self.image2np(img)
        results = self.model.detect([np_img], verbose=0)
        r = results[0]
        if not r['class_ids'].any():
            return ["No object detected!"]
        top_class_id = r['class_ids'][0]
        confidence = r['scores'][0]
        class_name = self.class_mapping.get(top_class_id, "Unknown")
        if confidence > 0.7:
            return [f"This appears to be a {class_name}."]
        elif confidence > 0.4:
            return [f"This looks somewhat like a {class_name}, but it's not certain."]
        else:
            return [class_name for class_name in [self.class_mapping.get(cid, "Unknown") for cid in r['class_ids'][:3]]]

# Example usage
# classifier = MaskRCNNClassifier("path/to/mask_rcnn_weights.h5")
# result = classifier.classify(Image.open("test.jpg"))
# print(result)