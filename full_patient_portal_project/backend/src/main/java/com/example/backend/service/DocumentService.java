package com.example.backend.service;

import com.example.backend.model.Document;
import com.example.backend.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    @Value("${file.upload.dir}")
    private String uploadDir;

    private final DocumentRepository repo;

    public DocumentService(DocumentRepository repo) {
        this.repo = repo;
    }

    public Document uploadFile(MultipartFile file) throws IOException {
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String sanitized = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(dir, sanitized);
        file.transferTo(dest);

        Document doc = new Document(file.getOriginalFilename(), dest.getAbsolutePath(), file.getSize());
        return repo.save(doc);
    }

    public List<Document> listAll() {
        return repo.findAll();
    }

    public Optional<Document> findById(Integer id) {
        return repo.findById(id);
    }

    public void delete(Integer id) {
        Optional<Document> od = repo.findById(id);
        if (od.isPresent()) {
            Document d = od.get();
            File f = new File(d.getFilepath());
            try { f.delete(); } catch(Exception e) {}
            repo.delete(d);
        }
    }
}
