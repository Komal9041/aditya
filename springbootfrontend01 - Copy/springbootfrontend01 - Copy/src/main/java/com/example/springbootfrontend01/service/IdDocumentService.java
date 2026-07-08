// service/IdDocumentService.java
package com.example.springbootfrontend01.service;

import com.anthropic.client.AnthropicClient;
import com.anthropic.models.messages.*;
import com.example.idextractor.exception.ExtractionException;
import com.example.springbootfrontend01.model.*;
import com.example.springbootfrontend01.repo.imageRepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class IdDocumentService {
    @Autowired
    FileService fileService;
    private static final Logger log = LoggerFactory.getLogger(IdDocumentService.class);

    private final AnthropicClient client;
    private final ObjectMapper objectMapper;

    @Value("${anthropic.api.model}")
    private String model;

    @Value("${anthropic.api.max-tokens}")
    private int maxTokens;

    public IdDocumentService(AnthropicClient client) {
        this.client = client;
        this.objectMapper = new ObjectMapper();
        System.out.println("shri03");
    }


    // ── Main entry point ─────────────────────────────────────────────────────

    //    public IdExtractionResponse extractFields(int id) {
    public IdExtractionResponse extractFields(int id) {

        byte[] base64Imagebinary = fileService.sendImage(id).getImage();
        String base64Image = Base64.getEncoder().encodeToString(base64Imagebinary);

        log.debug("Starting extraction for documentType={}, mediaType={}",
                fileService.sendImage(id).getDocumentType(), fileService.sendImage(id).getContentType());

        System.out.println("shri04");
        System.out.println("before " + base64Image);
        base64Image = cleanBase64(base64Image);
        System.out.println("after " + base64Image);
        try {
            // 1. Build the image source block
            Base64ImageSource imageSource = Base64ImageSource.builder()
                    .data(base64Image)
                    .mediaType(resolveMediaType(fileService.sendImage(id).getContentType()))
                    .build();

            ImageBlockParam imageBlock = ImageBlockParam.builder()
                    .source(ImageBlockParam.Source.ofBase64Image(imageSource))
                    .build();
            System.out.println("shri05");

            // 2. Build the text/prompt block
            TextBlockParam textBlock = TextBlockParam.builder()
                    .text(buildPrompt(fileService.sendImage(id).getDocumentType(), fileService.sendImage(id).getLanguageHint()))
                    .build();
            System.out.println("shri06");
            // 3. Create the message request
            ContentBlockParam imageContent = ContentBlockParam.ofImage(imageBlock);
            ContentBlockParam textContent = ContentBlockParam.ofText(textBlock);
            System.out.println("shri07");
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(model)
                    .maxTokens(maxTokens)
                    .addUserMessageOfBlockParams(List.of(imageContent, textContent))
                    .build();
            System.out.println("shri08");
            System.out.println("model used=>" + model);
            // 4. Call Claude API
            log.debug("Calling Claude API with model={}", model);
            Message message = client.messages().create(params);

            // 5. Extract text from response
            String rawText = extractTextFromMessage(message);
            log.debug("Claude raw response: {}", rawText);
            System.out.println("shri09");

            // 6. Parse JSON fields
            Map<String, String> fields = parseJsonFields(rawText);


            // 7. Log token usage
            int inputTokens = (int) message.usage().inputTokens();
            int outputTokens = (int) message.usage().outputTokens();
            log.info("Extraction complete. Tokens — input: {}, output: {}, model: {}",
                    inputTokens, outputTokens, model);
            System.out.println("shri10");
            return IdExtractionResponse.ok(fields, model, inputTokens, outputTokens);
//            return fields;

        } catch (ExtractionException e) {
            throw e;
        } catch (Exception e) {
            log.error("Extraction failed: {}", e.getMessage(), e);
            throw new ExtractionException("Failed to extract ID fields: " + e.getMessage(), e);
        }
    }

    // ── Prompt builder ───────────────────────────────────────────────────────

    private String buildPrompt(DocumentType docType, String languageHint) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("You are an expert ID document data extractor supporting all countries and languages.\n\n");
        System.out.println("shri11");
        // Add document type hint if provided
        if (docType != null && docType != DocumentType.UNKNOWN) {
            prompt.append("Document type: ").append(docType.name()).append("\n");
        }

        // Add language hint if provided
        if (languageHint != null && !languageHint.isBlank()) {
            prompt.append("Document language hint: ").append(languageHint).append("\n");
        }

        prompt.append("""
                
                Instructions:
                - Extract ALL readable fields from this ID document image
                - The document may be in ANY language (Swedish, Dutch, Hindi, Arabic, etc.)
                - Translate all field KEYS to English (e.g. Swedish "Namn" → "full_name")
                - Keep field VALUES exactly as printed on the document
                - For MRZ lines (machine readable zone), extract character by character
                - Use null for any field that is not visible, damaged, or unreadable
                - Return ONLY a valid JSON object — no explanation, no markdown, no code fences
                
                Always extract these standard fields if present:
                {
                  "full_name": "",
                  "first_name": "",
                  "last_name": "",
                  "date_of_birth": "",
                  "id_number": "",
                  "document_number": "",
                  "expiry_date": "",
                  "issue_date": "",
                  "nationality": "",
                  "gender": "",
                  "address": "",
                  "place_of_birth": "",
                  "issuing_country": "",
                  "issuing_authority": "",
                  "personal_number": "",
                  "mrz_line1": "",
                  "mrz_line2": "",
                  "mrz_line3": ""
                }
                
                Add any additional fields found on the document that are not listed above.
                Return ONLY the JSON object.
                """);
        System.out.println("shri12");
        ;
        return prompt.toString();
    }

    // ── Helper: resolve media type string to SDK enum ────────────────────────

    private Base64ImageSource.MediaType resolveMediaType(String mediaType) {
        System.out.println("shri13");
        return switch (mediaType.toLowerCase()) {
            case "image/png" -> Base64ImageSource.MediaType.IMAGE_PNG;
            case "image/webp" -> Base64ImageSource.MediaType.IMAGE_WEBP;
            case "image/gif" -> Base64ImageSource.MediaType.IMAGE_GIF;
            default -> Base64ImageSource.MediaType.IMAGE_JPEG;
        };
    }

    // ── Helper: pull text out of the response message ────────────────────────

    private String extractTextFromMessage(Message message) {
        System.out.println("shri14");
        return message.content().stream()
                .filter(ContentBlock::isText)
                .map(block -> block.asText().text())
                .findFirst()
                .orElseThrow(() -> new ExtractionException(
                        "Claude returned no text content in the response"));

    }

    // ── Helper: parse Claude's JSON output into a Map ────────────────────────

    private Map<String, String> parseJsonFields(String rawText) {
        try {
            String cleaned = rawText
                    .replaceAll("(?s)```json\\s*", "")
                    .replaceAll("(?s)```\\s*", "")
                    .trim();
            System.out.println("shri1");
            JsonNode root = objectMapper.readTree(cleaned);

            Map<String, String> fields = new LinkedHashMap<>();

            Iterator<String> fieldNames = root.fieldNames();
            while (fieldNames.hasNext()) {
                String key = fieldNames.next();
                JsonNode valueNode = root.get(key);

                String value = (valueNode == null || valueNode.isNull())
                        ? null
                        : valueNode.asText().trim();

                fields.put(key, (value == null || value.isEmpty()) ? null : value);
            }
            System.out.println("shri6");
            log.debug("Parsed {} fields from Claude response", fields.size());
            return fields;

        } catch (Exception e) {
            throw new ExtractionException(
                    "Failed to parse Claude response as JSON. Raw: " + rawText, e);
        }
    }

    private String cleanBase64(String base64Image) {
        if (base64Image == null) return null;

        // Strip data URI prefix if present
        // e.g. "data:image/jpeg;base64,/9j/4AAQ..."
        if (base64Image.contains(",")) {
            return base64Image.substring(base64Image.indexOf(",") + 1).trim();
        }
        return base64Image.trim();
    }
}