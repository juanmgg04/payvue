import os
from datetime import datetime


UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def save_file(file):
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    return filename
