# Planning our Machine Learning Model for Image Classification

## Datasets for Training

### 1. Trash Annotations in Context Dataset (https://github.com/pedropro/TACO)
- TACO is a labeled dataset of waste taken under diverse environments: woods, roads and beaches.  
- Images are segmented according to a hierarchical taxonomy to train and evaluate object detection algorithms.
- 4.6k labeled images
- Classes that can be added (i.e. pizza box, etc.)

### 2. Review of Waste Datasets (https://github.com/AgaMiko/waste-datasets-review)
- A bunch of waste datasets, including TACO
- VERY VALUABLE RESOURCE!!!

## ML Models

## 1. DenseNet (https://pytorch.org/hub/pytorch_vision_densenet/)
- Developed by researchers at Cornell University, DenseNet connects each layer to every other layer in a feed-forward fashion.
- DenseNet-121, DenseNet-169, DenseNet-201.
- Dense connections to improve gradient flow and feature reuse.
- Reduces the number of parameters compared to traditional convolutional networks.

## 2. Mask R-CNN (https://github.com/matterport/Mask_RCNN)
- Based on Feature Pyramid Network (FPN) and a ResNet101 backbone.
- The model generates bounding boxes and segmentation masks for each instance of an object in the image. 
- Real-time object classification.