import  { useState } from 'react';

export default function FileUploadDetails() {
    const [file, setFile] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractedFields, setExtractedFields] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        // Reset states on new file selection
        setUploadSuccess(false);
        setExtractedFields(null);
        setErrorMessage('');
    };

    const handleProcessUpload = async () => {
        if (!file) {
            setErrorMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setErrorMessage('');

            // 1. First Call: POST to upload the file
            const uploadResponse = await fetch('http://localhost:8080/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed with status ${uploadResponse.status}`);
            }

            // Display the upload success message immediately
            setUploadSuccess(true);
            setIsExtracting(true);

            // 2. Second Call: GET the extracted data (using hardcoded ID 1 per your requirement)
            const extractResponse = await fetch('http://localhost:8080/api/extract/1', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!extractResponse.ok) {
                throw new Error(`Extraction failed with status ${extractResponse.status}`);
            }

            const backendData = await extractResponse.json();

            /* 
              Spring Boot sends back: { "outerKey": { "field1": "value1", "field2": "value2" } }
              We extract the inner map to feed directly into Object.entries()
            */
            const innerMapKey = Object.keys(backendData)[0];
            const fields = backendData[innerMapKey] || {};

            setExtractedFields(fields);

        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'An unexpected error occurred.');
        } finally {
            setIsExtracting(false);
        }
    };

    // Helper to make database keys look readable (e.g., "accountNumber" -> "Account Number")
    const formatKey = (key) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px' }}>
            <h2>Mainframe File Data Processor</h2>

            <input type="file" onChange={handleFileChange} />
            <button onClick={handleProcessUpload} style={{ marginLeft: '10px' }}>
                Upload and Process
            </button>

            {/* Status Messages */}
            {errorMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ {errorMessage}</p>}

            {uploadSuccess && (
                <p style={{ color: 'green', fontWeight: 'bold' }}>
                    ✅ File uploaded successfully!
                </p>
            )}

            {isExtracting && <p style={{ color: 'blue' }}>⏳ Processing layouts and extracting fields...</p>}

            {/* Results Table */}
            {extractedFields && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Extracted Fields</h3>
                    <table className="result-table" border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>Field</th>
                            <th>Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(extractedFields).map(([key, value]) => (
                            <tr key={key}>
                                <td className="field-key" style={{ fontWeight: '500' }}>{formatKey(key)}</td>
                                <td className="field-value">{value !== null && value !== undefined ? String(value) : '—'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}