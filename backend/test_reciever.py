import requests

url = "http://127.0.0.1:5000/upload"
image_path = "/home/alexyrchk/hacked2025/recycle-it/backend/test_image_612x612.jpg"

with open(image_path, 'rb') as image_file:
    files = {'file': image_file}
    response = requests.post(url, files=files)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")