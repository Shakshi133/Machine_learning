from flask import Flask, render_template, request
from PIL import Image
import pytesseract
import os
from werkzeug.utils import secure_filename
import logging

logging.basicConfig(level=logging.INFO)


app = Flask(__name__)
UPLOAD_FOLDER = os.path.join('static', 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

@app.route('/', methods=['GET', 'POST'])
def index():
    extracted_text = None
    image_filename = None
    error = None

    if request.method == 'POST':
        if 'image_upload' not in request.files:
            error = "No file part in the request."
            return render_template('index.html', error=error)

        file = request.files['image_upload']

        if file.filename == '':
            error = "No selected file."
            return render_template('index.html', error=error)

        if file:
            try:
                
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                image_filename = f"uploads/{filename}"
                logging.info(f"File successfully uploaded to {filepath}")

                
                img = Image.open(filepath)
                img = img.convert('L')  

                
                extracted_text = pytesseract.image_to_string(img)
                if not extracted_text.strip():
                    extracted_text = "No text was extracted. The image may not contain clear text."

            except FileNotFoundError:
                error = "Tesseract executable not found. Please verify the path in app.py."
                logging.error(error)
            except Exception as e:
                error = f"OCR failed: {e}"
                logging.error(error, exc_info=True)

    return render_template('index.html', text=extracted_text, full_filename=image_filename, error=error)


if __name__ == '__main__':
    app.run(debug=True)




