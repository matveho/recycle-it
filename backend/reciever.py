from flask import Flask, request, jsonify
import os

app = Flask(__name__)
UPLOAD_FOLDER = '/home/alexyrchk/hacked2025/recycle-it/backend/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = file.filename
        # NOTE: We won't save it later, we just need to process it.
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        # ============================
        return jsonify({"message": "Success"}), 200

if __name__ == '__main__':
    app.run(debug=True)