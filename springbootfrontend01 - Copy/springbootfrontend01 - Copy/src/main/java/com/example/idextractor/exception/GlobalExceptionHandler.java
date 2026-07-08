// exception/GlobalExceptionHandler.java
package com.example.idextractor.exception;

import com.example.springbootfrontend01.model.IdExtractionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Validation errors (e.g. blank base64Image)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<IdExtractionResponse> handleValidation(
            MethodArgumentNotValidException ex) {

        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(IdExtractionResponse.error("Validation failed: " + errors));
    }

    // Extraction-specific errors
    @ExceptionHandler(ExtractionException.class)
    public ResponseEntity<IdExtractionResponse> handleExtraction(ExtractionException ex) {
        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(IdExtractionResponse.error(ex.getMessage()));
    }

    // Catch-all
    @ExceptionHandler(Exception.class)
    public ResponseEntity<IdExtractionResponse> handleGeneral(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(IdExtractionResponse.error("Unexpected error: " + ex.getMessage()));
    }
}