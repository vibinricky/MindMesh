package com.example.demo.service;

import com.example.demo.dto.GraphDto;
import com.example.demo.entity.KnowledgeGraph;
import java.util.List;
import com.example.demo.entity.SystemAccount;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.KnowledgeGraphRepository;
import com.example.demo.repository.SystemAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class GraphService {

    @Autowired
    private KnowledgeGraphRepository knowledgeGraphRepository;

    @Autowired
    private SystemAccountRepository systemAccountRepository;

    public Page<KnowledgeGraph> getMyGraphs(Pageable pageable) {
        SystemAccount currentUser = getCurrentUser();
        return knowledgeGraphRepository.findByOwnerId(currentUser.getId(), pageable);
    }

    public Page<KnowledgeGraph> getPublicGraphs(Pageable pageable) {
        return knowledgeGraphRepository.findAllPublicGraphs(pageable);
    }

    public List<KnowledgeGraph> getAll() {
        return knowledgeGraphRepository.findAll();
    }

    public KnowledgeGraph getGraphById(Long id) {
        return knowledgeGraphRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public KnowledgeGraph createGraph(GraphDto graphDto) {
        SystemAccount currentUser = getCurrentUser();
        KnowledgeGraph graph = new KnowledgeGraph();
        graph.setTitle(graphDto.getTitle());
        graph.setDescription(graphDto.getDescription());
        graph.setDomain(graphDto.getDomain());
        graph.setIsPublic(graphDto.getIsPublic() != null ? graphDto.getIsPublic() : false);
        graph.setOwner(currentUser);
        return knowledgeGraphRepository.save(graph);
    }

    public KnowledgeGraph updateGraph(Long id, GraphDto graphDto) {
        KnowledgeGraph graph = getGraphById(id);
        graph.setTitle(graphDto.getTitle());
        graph.setDescription(graphDto.getDescription());
        graph.setDomain(graphDto.getDomain());
        graph.setIsPublic(graphDto.getIsPublic() != null ? graphDto.getIsPublic() : graph.getIsPublic());
        return knowledgeGraphRepository.save(graph);
    }

    public void deleteGraph(Long id) {
        KnowledgeGraph graph = getGraphById(id);
        knowledgeGraphRepository.delete(graph);
    }

    public KnowledgeGraph save(KnowledgeGraph entity) {
        return knowledgeGraphRepository.save(entity);
    }

    public void delete(Long id) {
        knowledgeGraphRepository.deleteById(id);
    }
    
    public Page<KnowledgeGraph> searchGraphs(String query, Pageable pageable) {
        SystemAccount currentUser = getCurrentUser();
        return knowledgeGraphRepository.searchByTitleOrDescription(query, currentUser.getId(), pageable);
    }

    public SystemAccount getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return systemAccountRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
