package com.example.springbootfrontend01.model;

// model/IdExtractionResponse.java

import java.time.LocalDateTime;
import java.util.Map;

public class IdExtractionResponse {

    private boolean success;
    private Map<String, String> fields;
    private String errorMessage;
    private String modelUsed;
    private LocalDateTime extractedAt;
    private int inputTokens;
    private int outputTokens;

    // Static factory — success
    public static IdExtractionResponse ok(Map<String, String> fields,
                                          String modelUsed,
                                          int inputTokens,
                                          int outputTokens) {
        IdExtractionResponse r = new IdExtractionResponse();
        r.success = true;
        r.fields = fields;
        r.modelUsed = modelUsed;
        r.inputTokens = inputTokens;
        r.outputTokens = outputTokens;
        r.extractedAt = LocalDateTime.now();
        return r;
    }

    // Static factory — error
    public static IdExtractionResponse error(String message) {
        IdExtractionResponse r = new IdExtractionResponse();
        r.success = false;
        r.errorMessage = message;
        r.extractedAt = LocalDateTime.now();
        return r;
    }

    // Getters
    public boolean isSuccess() { return success; }
    public Map<String, String> getFields() { return fields; }
    public String getErrorMessage() { return errorMessage; }
    public String getModelUsed() { return modelUsed; }
    public LocalDateTime getExtractedAt() { return extractedAt; }
    public int getInputTokens() { return inputTokens; }
    public int getOutputTokens() { return outputTokens; }
}