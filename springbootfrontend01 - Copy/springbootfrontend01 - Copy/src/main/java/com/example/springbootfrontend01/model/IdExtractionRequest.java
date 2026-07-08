// model/IdExtractionRequest.java
package com.example.springbootfrontend01.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.stereotype.Component;

@Component
public class IdExtractionRequest {

    // Pure base64 string — no "data:image/jpeg;base64," prefix
    @NotBlank(message = "base64Image must not be blank")
    private String base64Image;

    // Supported: image/jpeg, image/png, image/webp, image/gif
    @NotBlank(message = "mediaType must not be blank")
    @Pattern(
            regexp = "image/(jpeg|png|webp|gif)",
            message = "mediaType must be one of: image/jpeg, image/png, image/webp, image/gif"
    )
    private String mediaType = "image/jpeg";

    // Optional hint to improve extraction accuracy
    private DocumentType documentType = DocumentType.UNKNOWN;

    // Optional: hint about document language
    private String languageHint;

    // Getters and Setters
    public String getBase64Image() { return base64Image; }
    public void setBase64Image(String base64Image) { this.base64Image = base64Image; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public DocumentType getDocumentType() { return documentType; }
    public void setDocumentType(DocumentType documentType) { this.documentType = documentType; }

    public String getLanguageHint() { return languageHint; }
    public void setLanguageHint(String languageHint) { this.languageHint = languageHint; }
}