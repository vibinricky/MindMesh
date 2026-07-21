package com.example.demo.repository;

import com.example.demo.entity.KnowledgeGraph;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeGraphRepository extends JpaRepository<KnowledgeGraph, Long> {
    
    Page<KnowledgeGraph> findByOwnerId(Long ownerId, Pageable pageable);

    Page<KnowledgeGraph> findByIsPublicTrue(Pageable pageable);

    List<KnowledgeGraph> findByIsPublicTrue();

    @Query("SELECT kg FROM KnowledgeGraph kg WHERE kg.isPublic = true")
    Page<KnowledgeGraph> findAllPublicGraphs(Pageable pageable);

    boolean existsByOwnerIdAndTitleIgnoreCase(Long ownerId, String title);
    
    @Query("SELECT kg FROM KnowledgeGraph kg WHERE (kg.isPublic = true OR kg.owner.id = :userId) AND (LOWER(kg.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(kg.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<KnowledgeGraph> searchByTitleOrDescription(String query, Long userId, Pageable pageable);
}
