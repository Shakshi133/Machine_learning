let selectedFile = null;

// Handle file input
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        selectedFile = file;
        displayImagePreview(file);
        processImage(file);
    }
});

// Drag & Drop
const uploadSection = document.getElementById('uploadSection');
uploadSection.addEventListener('dragover', e => {
    e.preventDefault();
    uploadSection.style.borderColor = '#7366ff';
});
uploadSection.addEventListener('dragleave', e => {
    e.preventDefault();
    uploadSection.style.borderColor = '#cbd5e0';
});
uploadSection.addEventListener('drop', e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        selectedFile = files[0];
        document.getElementById('imageInput').files = files;
        displayImagePreview(files[0]);
        processImage(files[0]);
    }
});

// Preview
function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('imagePreview');
        const img = document.getElementById('previewImg');
        img.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Process (connect to Flask)
function processImage(file) {
    const textOutput = document.getElementById('textOutput');
    textOutput.value = 'Processing image...';

    const formData = new FormData();
    formData.append('image', file);

    fetch('/extract-text', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        textOutput.value = data.extracted_text || 'No text found.';
    })
    .catch(err => {
        textOutput.value = 'Error processing image.';
        console.error(err);
    });
}

// Copy text
function copyText() {
    const textOutput = document.getElementById('textOutput');
    textOutput.select();
    document.execCommand('copy');
    alert("Copied to clipboard!");
}
