package com.example.springbootfrontend01.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Entity
@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Image {
    @Id
    private int id;
    private String OriginalFilename;
    private String ContentType;
    private DocumentType DocumentType;
    private String LanguageHint;
    @Lob
    private byte[] Image;
}
