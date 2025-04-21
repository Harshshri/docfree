document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadStatus = document.getElementById('downloadStatus');
    let uploadedFile = null;

    // Function to validate ZIP file
    function isValidZipFile(file) {
        // Check if file exists
        if (!file) return false;
        
        // Check file type
        const validTypes = [
            'application/zip',
            'application/x-zip-compressed',
            'application/x-zip',
            'application/octet-stream'
        ];
        
        // Check file extension
        const validExtensions = ['.zip'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        return validTypes.includes(file.type) || validExtensions.includes(fileExtension);
    }

    // Handle file upload
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        
        if (isValidZipFile(file)) {
            try {
                // Store the file in localStorage
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64String = e.target.result.split(',')[1];
                    localStorage.setItem('uploadedZipFile', base64String);
                    localStorage.setItem('uploadedZipFileName', file.name);
                    
                    // Update UI
                    uploadedFile = file;
                    downloadStatus.textContent = `File ready: ${file.name}`;
                    downloadBtn.disabled = false;
                    
                    // Automatically trigger download
                    downloadFile();
                };
                reader.onerror = function() {
                    alert('Error reading file. Please try again.');
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error storing file:', error);
                alert('Error storing file. Please try again.');
            }
        } else {
            alert('Please upload a valid ZIP file. The file must have a .zip extension.');
            fileInput.value = ''; // Clear the file input
        }
    });

    // Handle manual download button click
    downloadBtn.addEventListener('click', () => {
        if (uploadedFile) {
            downloadFile();
        }
    });

    // Function to handle file download
    function downloadFile() {
        const storedFile = localStorage.getItem('uploadedZipFile');
        const fileName = localStorage.getItem('uploadedZipFileName');
        
        if (storedFile && fileName) {
            try {
                // Convert base64 to blob
                const byteCharacters = atob(storedFile);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/zip' });
                
                // Create download link
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading file:', error);
                alert('Error downloading file. Please try again.');
            }
        }
    }

    // Check if there's a file in localStorage on page load
    const checkForStoredFile = () => {
        const storedFile = localStorage.getItem('uploadedZipFile');
        const fileName = localStorage.getItem('uploadedZipFileName');
        
        if (storedFile && fileName) {
            downloadStatus.textContent = `File ready: ${fileName}`;
            downloadBtn.disabled = false;
            downloadFile();
        }
    };

    // Check for stored file on page load
    checkForStoredFile();
}); 