import numpy as np

# import pandas as pd
import tensorflow as tf
from PIL import Image
from matplotlib import pyplot as plt
from tensorflow.python.util import compat
from tensorflow.core.protobuf import saved_model_pb2
from google.protobuf import text_format

# import pprint
import json
import os

from object_detection.utils import visualization_utils as vis_util
from object_detection.utils import dataset_util, label_map_util
from object_detection.protos import string_int_label_map_pb2

DATA_DIR = ".\data"
ANNOTATIONS_FILE = os.path.join(DATA_DIR, "annotations.json")
NCLASSES = 60


# reconstruct frozen graph
def reconstruct(pb_path):
    if not os.path.isfile(pb_path):
        print("Error: %s not found" % pb_path)

    print("Reconstructing Tensorflow model")
    detection_graph = tf.Graph()
    with detection_graph.as_default():
        od_graph_def = tf.compat.v1.GraphDef()
        with tf.io.gfile.GFile(pb_path, "rb") as fid:
            serialized_graph = fid.read()
            od_graph_def.ParseFromString(serialized_graph)
            tf.import_graph_def(od_graph_def, name="")
    print("Success!")
    return detection_graph


# visualize detection
def image2np(image):
    (w, h) = image.size
    return np.array(image.getdata()).reshape((h, w, 3)).astype(np.uint8)


def image2tensor(image):
    npim = image2np(image)
    return np.expand_dims(npim, axis=0)


# %matplotlib inline
def detect(detection_graph, category_index, img: Image, max_size=1024):
    with detection_graph.as_default():
        gpu_options = tf.compat.v1.GPUOptions(per_process_gpu_memory_fraction=0.01)
        with tf.compat.v1.Session(
            graph=detection_graph,
            config=tf.compat.v1.ConfigProto(gpu_options=gpu_options),
        ) as sess:
            image_tensor = detection_graph.get_tensor_by_name("image_tensor:0")
            detection_boxes = detection_graph.get_tensor_by_name("detection_boxes:0")
            detection_scores = detection_graph.get_tensor_by_name("detection_scores:0")
            detection_classes = detection_graph.get_tensor_by_name(
                "detection_classes:0"
            )
            num_detections = detection_graph.get_tensor_by_name("num_detections:0")

            # image = Image.open(test_image_path)
            # image = image.resize((1200,1200),Image.LANCZOS)
            # Resize image if larger than max_size while maintaining aspect ratio
            if img.width > max_size or img.height > max_size:
                width, height = img.size
                if width > height:
                    new_width = max_size
                    new_height = int(height * (max_size / width))
                else:
                    new_height = max_size
                    new_width = int(width * (max_size / height))
                img = img.resize((new_width, new_height), Image.LANCZOS)
            (boxes, scores, classes, num) = sess.run(
                [detection_boxes, detection_scores, detection_classes, num_detections],
                feed_dict={image_tensor: image2tensor(img)},
            )

            # npim = image2np(image)
            # vis_util.visualize_boxes_and_labels_on_image_array(
            #     npim,
            #     np.squeeze(boxes),
            #     np.squeeze(classes).astype(np.int32),
            #     np.squeeze(scores),
            #     category_index,
            #     use_normalized_coordinates=True,
            #     line_thickness=15,
            # )
            # plt.figure(figsize=(12, 8))
            # plt.imshow(npim)
            # plt.show()
            # print(f"Classes: {classes}")
            # print(f"Scores: {scores}")
            return np.squeeze(classes).astype(np.int32), np.squeeze(scores)


def model_setup():
    with open(ANNOTATIONS_FILE) as json_file:
        data = json.load(json_file)
    categories = data["categories"]

    print("Building label map from examples")

    labelmap = string_int_label_map_pb2.StringIntLabelMap()
    for idx, category in enumerate(categories):
        item = labelmap.item.add()
        # label map id 0 is reserved for the background label
        item.id = int(category["id"]) + 1
        item.name = category["name"]

    with open("./labelmap.pbtxt", "w") as f:
        f.write(text_format.MessageToString(labelmap))

    print("Label map witten to labelmap.pbtxt")

    # with open('./labelmap.pbtxt') as f:
    #     pprint.pprint(f.readlines())

    label_map = label_map_util.load_labelmap("labelmap.pbtxt")
    categories = label_map_util.convert_label_map_to_categories(
        label_map, max_num_classes=NCLASSES, use_display_name=True
    )
    category_index = label_map_util.create_category_index(categories)

    detection_graph = reconstruct(".\models\ssd_mobilenet_v2_taco_2018_03_29.pb")

    return detection_graph, category_index


def classify(detection_graph, category_index, img):
    """"""
    classes, scores = detect(detection_graph, img, max_size=1200)
    # if scores[0] < 0.02:
    #     return "No object detected!", 400

    # if scores[1] < 0.05:
    #     predicted_class = category_index[classes[0]]["name"]
    #     predicted_score = scores[0]
    #     return (
    #         f"Predicted class: {predicted_class}, Predicted score: {predicted_score}",
    #         200,
    #     )
    # else:
    #     predicted_classes = [category_index[c]["name"] for c in classes[0:3]]
    #     predicted_scores = scores[0:3]
    #     return (
    #         f"Predicted classes: {predicted_classes}, Predicted scores: {predicted_scores}",
    #         200,
    #     )
    if scores[0] > 0.7:
        return [f"This appears to be a {category_index[classes[0]]["name"]}."]
    elif scores[0] > 0.4:
        return [
            f"This looks somewhat like a {category_index[classes[0]]["name"]}, but it's not certain."
        ]
    elif scores[0] < 0.02:
        return ["No object detected!"]
    else:
        return [category_index[c]["name"] for c in classes[0:3]]
