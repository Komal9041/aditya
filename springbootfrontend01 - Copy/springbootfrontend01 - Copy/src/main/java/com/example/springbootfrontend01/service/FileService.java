package com.example.springbootfrontend01.service;

import com.example.springbootfrontend01.model.DocumentType;
import com.example.springbootfrontend01.model.Image;
import com.example.springbootfrontend01.repo.imageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class FileService {

    @Autowired
    imageRepo irepo;

    private String base64Image;

    private int currentId = 1;

    public Image sendImage(int id) {
        return irepo.findById(id).orElse(null);
    }

    public List<Image> sendImages() {
        return irepo.findAll();
    }

    public void processImage(MultipartFile file, DocumentType DocumentType, String LanguageHint) throws IOException {
        System.out.println("debug06");
        Image image = new Image();
        image.setId(currentId);
        image.setOriginalFilename(file.getOriginalFilename());
        image.setContentType(file.getContentType());
        image.setDocumentType(DocumentType);
        image.setLanguageHint(LanguageHint);
        image.setImage(file.getBytes());
        irepo.save(image);
        System.out.println("debug07");
    }

 }
