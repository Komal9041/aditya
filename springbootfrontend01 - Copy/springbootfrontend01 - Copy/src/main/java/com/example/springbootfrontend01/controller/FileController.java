package com.example.springbootfrontend01.controller;

import com.example.springbootfrontend01.model.DocumentType;
import com.example.springbootfrontend01.model.IdExtractionRequest;
import com.example.springbootfrontend01.model.IdExtractionResponse;
import com.example.springbootfrontend01.model.Image;
import com.example.springbootfrontend01.service.FileService;
import com.example.springbootfrontend01.service.IdDocumentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(originPatterns = "http://localhost:[*]")
public class FileController {

    @Autowired
    FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<?> receiveImage(@RequestParam("file") MultipartFile file,
                                          @RequestParam("documentType") DocumentType documentType,
                                          @RequestParam("language") String language) {
        System.out.println("debug01");
        try {
            if (file.isEmpty()) {
                System.out.println("debug02");
                return ResponseEntity.badRequest().body("File is empty");
            }
            System.out.println("debug03");
            fileService.processImage(file,documentType,language);
            System.out.println("debug04");
            return ResponseEntity.ok(Map.of("message", "File uploaded successfully"));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Processing failed: " + e.getMessage());
        }
    }

    @GetMapping("/image/{id}")
    public Image sendImage(@PathVariable int id) {
        return fileService.sendImage(id);
    }

    @GetMapping("/images")
    public List<Image> sendImages() {
        return fileService.sendImages();
    }

    @Autowired
    IdDocumentService idDocumentService;


//    @GetMapping("/extract/{id}")
//    public ResponseEntity<IdExtractionResponse> extract(@PathVariable int id) {
//        System.out.println("shri01");
//        IdExtractionResponse response = service.extractFields(id);
//        System.out.println("shri02");
//        return ResponseEntity.ok(response);
//    }


    @GetMapping("/extract/{id}")
    public IdExtractionResponse extract(@PathVariable int id) {
        System.out.println("shri01");
        IdExtractionResponse response = idDocumentService.extractFields(id);;
        System.out.println("shri02");
        return response;
    }
}
