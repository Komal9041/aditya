import {useState} from 'react'
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom'
import './App.css'

// ── Constants ─────────────────────────────────────────────────────
const DOCUMENT_TYPES = [
    {value: 'UNKNOWN', label: 'Select Document Type'},
    {value: 'PASSPORT', label: '🛂 Passport'},
    {value: 'NATIONAL_ID', label: '🪪 National ID'},
    {value: 'DRIVING_LICENSE', label: '🚗 Driving License'},
    {value: 'RESIDENCE_PERMIT', label: '🏠 Residence Permit'},
]

const LANGUAGES = [
    {value: '', label: 'Select Language (Optional)'},
    {value: 'Afrikaans', label: 'Afrikaans'},
    {value: 'Albanian', label: 'Albanian'},
    {value: 'Amharic', label: 'Amharic'},
    {value: 'Arabic', label: 'Arabic'},
    {value: 'Armenian', label: 'Armenian'},
    {value: 'Azerbaijani', label: 'Azerbaijani'},
    {value: 'Basque', label: 'Basque'},
    {value: 'Belarusian', label: 'Belarusian'},
    {value: 'Bengali', label: 'Bengali'},
    {value: 'Bosnian', label: 'Bosnian'},
    {value: 'Bulgarian', label: 'Bulgarian'},
    {value: 'Catalan', label: 'Catalan'},
    {value: 'Chinese (Simplified)', label: 'Chinese (Simplified)'},
    {value: 'Chinese (Traditional)', label: 'Chinese (Traditional)'},
    {value: 'Croatian', label: 'Croatian'},
    {value: 'Czech', label: 'Czech'},
    {value: 'Danish', label: 'Danish'},
    {value: 'Dutch', label: 'Dutch'},
    {value: 'English', label: 'English'},
    {value: 'Estonian', label: 'Estonian'},
    {value: 'Finnish', label: 'Finnish'},
    {value: 'French', label: 'French'},
    {value: 'Galician', label: 'Galician'},
    {value: 'Georgian', label: 'Georgian'},
    {value: 'German', label: 'German'},
    {value: 'Greek', label: 'Greek'},
    {value: 'Gujarati', label: 'Gujarati'},
    {value: 'Haitian Creole', label: 'Haitian Creole'},
    {value: 'Hebrew', label: 'Hebrew'},
    {value: 'Hindi', label: 'Hindi'},
    {value: 'Hungarian', label: 'Hungarian'},
    {value: 'Icelandic', label: 'Icelandic'},
    {value: 'Indonesian', label: 'Indonesian'},
    {value: 'Irish', label: 'Irish'},
    {value: 'Italian', label: 'Italian'},
    {value: 'Japanese', label: 'Japanese'},
    {value: 'Kannada', label: 'Kannada'},
    {value: 'Kazakh', label: 'Kazakh'},
    {value: 'Khmer', label: 'Khmer'},
    {value: 'Korean', label: 'Korean'},
    {value: 'Kurdish', label: 'Kurdish'},
    {value: 'Kyrgyz', label: 'Kyrgyz'},
    {value: 'Lao', label: 'Lao'},
    {value: 'Latvian', label: 'Latvian'},
    {value: 'Lithuanian', label: 'Lithuanian'},
    {value: 'Luxembourgish', label: 'Luxembourgish'},
    {value: 'Macedonian', label: 'Macedonian'},
    {value: 'Malay', label: 'Malay'},
    {value: 'Malayalam', label: 'Malayalam'},
    {value: 'Maltese', label: 'Maltese'},
    {value: 'Marathi', label: 'Marathi'},
    {value: 'Mongolian', label: 'Mongolian'},
    {value: 'Nepali', label: 'Nepali'},
    {value: 'Norwegian', label: 'Norwegian'},
    {value: 'Pashto', label: 'Pashto'},
    {value: 'Persian', label: 'Persian'},
    {value: 'Polish', label: 'Polish'},
    {value: 'Portuguese', label: 'Portuguese'},
    {value: 'Punjabi', label: 'Punjabi'},
    {value: 'Romanian', label: 'Romanian'},
    {value: 'Russian', label: 'Russian'},
    {value: 'Serbian', label: 'Serbian'},
    {value: 'Sinhala', label: 'Sinhala'},
    {value: 'Slovak', label: 'Slovak'},
    {value: 'Slovenian', label: 'Slovenian'},
    {value: 'Somali', label: 'Somali'},
    {value: 'Spanish', label: 'Spanish'},
    {value: 'Swahili', label: 'Swahili'},
    {value: 'Swedish', label: 'Swedish'},
    {value: 'Tagalog', label: 'Tagalog'},
    {value: 'Tajik', label: 'Tajik'},
    {value: 'Tamil', label: 'Tamil'},
    {value: 'Telugu', label: 'Telugu'},
    {value: 'Thai', label: 'Thai'},
    {value: 'Turkish', label: 'Turkish'},
    {value: 'Turkmen', label: 'Turkmen'},
    {value: 'Ukrainian', label: 'Ukrainian'},
    {value: 'Urdu', label: 'Urdu'},
    {value: 'Uzbek', label: 'Uzbek'},
    {value: 'Vietnamese', label: 'Vietnamese'},
    {value: 'Welsh', label: 'Welsh'},
    {value: 'Xhosa', label: 'Xhosa'},
    {value: 'Yoruba', label: 'Yoruba'},
    {value: 'Zulu', label: 'Zulu'},
]

// ── Home Page ─────────────────────────────────────────────────────
function HomePage() {
    const navigate = useNavigate()
    return (
        <section id="home-page">
            <p className="welcome-banner">
                <strong>Welcome to ID Detection and Reading Process</strong>
            </p>
            <button className="proceed-btn" onClick={() => navigate('/upload')}>
                Click here to proceed
            </button>
        </section>
    )
}

// ── Upload Page ───────────────────────────────────────────────────
function UploadPage() {
    const navigate = useNavigate()
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [documentType, setDocumentType] = useState('UNKNOWN')
    const [language, setLanguage] = useState('')

    const handleFileChange = (e) => {
        const selected = e.target.files[0]
        if (!selected) return
        setFile(selected)
        setPreview(URL.createObjectURL(selected))
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)
        formData.append('documentType', documentType)
        formData.append('language', language)

        try {
            setLoading(true)
            setError(null)

            const response = await fetch('http://localhost:8080/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) throw new Error(`Server error: ${response.status}`)

            try {
                // 3. Fire the second call (GET request)
                const extractResponse = await fetch(`http://localhost:8080/api/extract/1`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                if (!extractResponse.ok) throw new Error(`Server error: ${extractResponse.status}`)

                const rawBackendData = await extractResponse.json();
                console.log('Extraction data fetched successfully:', rawBackendData);

                // Route optimization: Pass clean data directly down to the state object
                navigate('/result', { state: { rawBackendData } })

            } catch (error) {
                console.error('Failed to fetch extraction data:', error);
                setError(`Extraction extraction phase failed: ${error.message}`)
            }

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="upload-page">
            <button className="back-btn" onClick={() => navigate('/')}>← Back</button>

            <h1>Upload ID Image</h1>
            <p className="subtitle">Select an image file of your ID document to begin processing.</p>

            <form className="upload-form" onSubmit={handleSubmit}>
                <label className="file-drop-zone" htmlFor="id-file">
                    {preview ? (
                        <img src={preview} alt="Preview" className="preview-img"/>
                    ) : (
                        <>
                            <span className="upload-icon">📂</span>
                            <span>Click to browse or drag &amp; drop</span>
                            <span className="file-hint">PNG, JPG, JPEG, WEBP accepted</span>
                        </>
                    )}
                    <input
                        id="id-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{display: 'none'}}
                    />
                </label>

                {file && (
                    <p className="file-name">
                        Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                    </p>
                )}

                <div className="form-group">
                    <label htmlFor="document-type">Document Type</label>
                    <select
                        id="document-type"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="form-select"
                    >
                        {DOCUMENT_TYPES.map(dt => (
                            <option key={dt.value} value={dt.value}>{dt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="language">Document Language</label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="form-select"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={!file || loading}
                >
                    {loading ? 'Processing...' : 'Upload & Process'}
                </button>

                {error && <p className="error-msg">❌ {error}</p>}
            </form>
        </section>
    )
}

// ── Result Page ───────────────────────────────────────────────────
function ResultPage() {
    const navigate = useNavigate()
    const {state} = useLocation()

    // Safety check if user directly visits /result route
    if (!state?.rawBackendData) {
        return (
            <section id="result-page">
                <p>No result found.</p>
                <button onClick={() => navigate('/upload')}>Go Back</button>
            </section>
        )
    }

    const rawData = state.rawBackendData;

    /*
      Map-of-Map Handler:
      If Spring Boot wraps our response payload inside an outer tracking key,
      we extract the real map object details contextually.
    */
    const outerKey = Object.keys(rawData)[0];
    const extractedData = rawData.success ? rawData : (rawData[outerKey] || {});

    const formatKey = (key) =>
        key.split('_')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')

    // Safe extraction fallback defaults to protect mapping loops
    const fields = extractedData.fields || {};
    const modelUsed = extractedData.modelUsed || 'N/A';
    const inputTokens = extractedData.inputTokens || 0;
    const outputTokens = extractedData.outputTokens || 0;

    return (
        <section id="result-page">
            <button className="back-btn" onClick={() => navigate('/upload')}>
                ← Back
            </button>

            <h1>Extracted ID Fields</h1>

            {extractedData.success !== false ? (
                <>
                    <div className="result-card">
                        <table className="result-table">
                            <thead>
                            <tr>
                                <th>Field</th>
                                <th>Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(fields).map(([key, value]) => (
                                <tr key={key}>
                                    <td className="field-key">{formatKey(key)}</td>
                                    <td className="field-value">{value !== null && value !== undefined ? String(value) : '—'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="token-info">
                        <small>
                            Model: <strong>{modelUsed}</strong> &nbsp;|&nbsp;
                            Tokens: <strong>{inputTokens + outputTokens}</strong>
                        </small>
                    </div>
                </>
            ) : (
                <p className="error-msg">❌ {extractedData.errorMessage || 'Unknown Extraction Failure'}</p>
            )}


            <button className="proceed-btn" onClick={() => navigate('/autofill', { state: { extractedData } })}>
                Click here to proceed to Auto Fill
            </button>
        </section>


    )
}


// ── AutoFill Page ─────────────────────────────────────────────────
function AutoFillPage() {
    const navigate = useNavigate()
    const { state } = useLocation()

    const rawData = state?.extractedData
    const outerKey = rawData ? Object.keys(rawData)[0] : null
    const extractedData = rawData?.success ? rawData : (rawData?.[outerKey] || {})
    const fields = extractedData.fields || {}

    // ✅ Hooks always called unconditionally, before any early return
    const [formValues, setFormValues] = useState(
        Object.fromEntries(
            Object.entries(fields).map(([k, v]) => [k, v !== null && v !== undefined ? String(v) : ''])
        )
    )
    const [submitted, setSubmitted] = useState(false)

    // Early return AFTER all hooks
    if (!rawData) {
        return (
            <section id="autofill-page">
                <p>No data found.</p>
                <button onClick={() => navigate('/upload')}>Go Back</button>
            </section>
        )
    }

    const formatKey = (key) =>
        key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

    const handleChange = (key, value) => {
        setFormValues(prev => ({ ...prev, [key]: value }))
    }

    const handleReset = () => {
        setFormValues(
            Object.fromEntries(
                Object.entries(fields).map(([k, v]) => [k, v !== null && v !== undefined ? String(v) : ''])
            )
        )
        setSubmitted(false)
    }

    const handleSubmit = () => {
        console.log('Submitted values:', formValues)
        setSubmitted(true)
    }

    return (
        <section id="autofill-page">
            <button className="back-btn" onClick={() => navigate('/result', { state })}>
                ← Back
            </button>
            <h1>Auto Fill</h1>
            <p className="subtitle">Review and edit the extracted fields before submitting.</p>
            <div className="autofill-form">
                <div className="autofill-grid">
                    {Object.entries(formValues).map(([key, value]) => (
                        <div className="form-group" key={key}>
                            <label htmlFor={`field-${key}`}>{formatKey(key)}</label>
                            <input
                                id={`field-${key}`}
                                type="text"
                                className="form-input"
                                value={value}
                                onChange={(e) => handleChange(key, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <div className="form-actions">
                    <button className="reset-btn" onClick={handleReset}>Reset</button>
                    <button className="autofill-submit-btn" onClick={handleSubmit}>Confirm & Submit</button>
                </div>
                {submitted && <p className="autofill-success-msg">✅ Form submitted successfully.</p>}
            </div>
        </section>
    )
}

// ── App Routes ────────────────────────────────────────────────────
function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/upload" element={<UploadPage/>}/>
            <Route path="/result" element={<ResultPage/>}/>
            <Route path="/autofill" element={<AutoFillPage/>}/>
        </Routes>
    )
}

export default App