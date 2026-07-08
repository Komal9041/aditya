package com.example.springbootfrontend01.repo;

import com.example.springbootfrontend01.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface imageRepo extends JpaRepository<Image,Integer> {
}
