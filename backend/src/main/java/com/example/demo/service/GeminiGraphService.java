package com.example.demo.service;

import com.example.demo.dto.ConceptNodeDto;
import com.example.demo.dto.GraphDetailDto;
import com.example.demo.dto.SemanticEdgeDto;
import com.example.demo.entity.ActivityLog;
import com.example.demo.entity.ConceptNode;
import com.example.demo.entity.KnowledgeGraph;
import com.example.demo.entity.SemanticEdge;
import com.example.demo.entity.SystemAccount;
import com.example.demo.event.GraphCreatedEvent;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.repository.ActivityLogRepository;
import com.example.demo.repository.ConceptNodeRepository;
import com.example.demo.repository.KnowledgeGraphRepository;
import com.example.demo.repository.SemanticEdgeRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.*;

@Service
public class GeminiGraphService {

    @Value("${gemini.api.key:}")
    private String configuredKey;

    @Value("${gemini.model:gemini-3.6-flash}")
    private String configuredModel;

    @Autowired
    private KnowledgeGraphRepository knowledgeGraphRepository;

    @Autowired
    private ConceptNodeRepository conceptNodeRepository;

    @Autowired
    private SemanticEdgeRepository semanticEdgeRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private GraphService graphService;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public GraphDetailDto generateKnowledgeGraph(String prompt, Boolean isPublic) {
        if (prompt == null || prompt.trim().isBlank()) {
            throw new IllegalArgumentException("Prompt cannot be empty");
        }

        String apiKey = resolveApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            throw new BusinessValidationException(
                "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file or environment variables."
            );
        }

        String model = resolveModel();

        // Call Gemini API
        String geminiJson = callGeminiGenerateContent(prompt.trim(), apiKey, model);

        // Parse & Validate
        return processAndPersistGraph(prompt.trim(), geminiJson, isPublic);
    }

    private String callGeminiGenerateContent(String prompt, String apiKey, String model) {
        try {
            Map<String, Object> requestMap = new HashMap<>();

            Map<String, Object> textPart = Map.of(
                "text",
                "Generate a comprehensive, insightful knowledge graph about the following subject:\n\n" + prompt
            );
            Map<String, Object> userContent = Map.of("role", "user", "parts", List.of(textPart));
            requestMap.put("contents", List.of(userContent));

            String systemPrompt = """
                You are an expert knowledge graph architect.
                Create a coherent, insightful, and semantically rich knowledge graph for the given topic.
                
                Core Requirements:
                1. Prioritize conceptual clarity and meaningful relationships over high node volume.
                2. Generate between 7 and 18 distinct, highly relevant concept nodes.
                3. Node labels must be concise, readable names (1 to 4 words). Avoid long sentences as labels.
                4. Assign an accurate concept type to each node (e.g. CONCEPT, PRINCIPLE, MECHANISM, TOOL, DOMAIN, COMPONENT, METRIC, ARCHITECTURE).
                5. Edges must represent meaningful, specific relationships between concepts (e.g. ACTIVATES, REGULATES, CONTAINS, ENABLES, DERIVED_FROM, DEPENDS_ON, IMPLEMENTS).
                6. Avoid trivial, redundant, or random connections.
                7. Ensure the graph forms a cohesive knowledge web without disconnected or isolated nodes.
                8. Avoid duplicate nodes and duplicate relationships.
                9. Never connect a node to itself (no self-loops).
                10. Do NOT generate coordinates; layout positioning is handled dynamically.
                """;
            requestMap.put("systemInstruction", Map.of("parts", List.of(Map.of("text", systemPrompt))));

            Map<String, Object> responseSchema = buildResponseSchema();
            Map<String, Object> generationConfig = Map.of(
                "responseMimeType", "application/json",
                "temperature", 0.35,
                "responseSchema", responseSchema
            );
            requestMap.put("generationConfig", generationConfig);

            String requestBody = objectMapper.writeValueAsString(requestMap);

            HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();

            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent";

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(50))
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            if (response.statusCode() != 200) {
                String errorMsg = extractErrorMessage(response.body(), response.statusCode());
                if (response.statusCode() == 401 || response.statusCode() == 403) {
                    throw new BusinessValidationException("Invalid or unauthorized Gemini API key. Please check your GEMINI_API_KEY in .env.");
                } else if (response.statusCode() == 429) {
                    throw new BusinessValidationException("Gemini API rate limit or quota exceeded. Please try again shortly.");
                } else {
                    throw new BusinessValidationException("Gemini API error (" + response.statusCode() + "): " + errorMsg);
                }
            }

            return response.body();
        } catch (BusinessValidationException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessValidationException("Failed to call Gemini API: " + e.getMessage());
        }
    }

    private GraphDetailDto processAndPersistGraph(String prompt, String rawResponse, Boolean isPublic) {
        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            JsonNode candidates = root.path("candidates");
            if (candidates.isEmpty()) {
                throw new BusinessValidationException("Gemini returned no candidates for this prompt. Please try a different topic.");
            }

            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (parts.isEmpty() || !parts.get(0).has("text")) {
                throw new BusinessValidationException("Gemini response was empty or contained no text content.");
            }

            String text = parts.get(0).get("text").asText();
            JsonNode graphData = objectMapper.readTree(text);

            // Extract Graph Metadata
            String title = graphData.path("title").asText("").trim();
            if (title.isBlank()) {
                title = "Knowledge Mesh: " + (prompt.length() > 50 ? prompt.substring(0, 50) + "..." : prompt);
            }
            if (title.length() > 200) {
                title = title.substring(0, 200);
            }

            String description = graphData.path("description").asText("AI-synthesized knowledge mesh.").trim();
            if (description.length() > 2000) {
                description = description.substring(0, 2000);
            }

            String domain = graphData.path("domain").asText("General").trim();
            if (domain.length() > 100) {
                domain = domain.substring(0, 100);
            }

            // Extract & Deduplicate Nodes
            JsonNode nodesArray = graphData.path("nodes");
            if (!nodesArray.isArray() || nodesArray.size() < 2) {
                throw new BusinessValidationException("Gemini generated fewer than 2 concept nodes. Please try a more specific topic.");
            }

            Map<String, ConceptNode> tempIdToNode = new HashMap<>();
            Map<String, ConceptNode> labelToNode = new HashMap<>();
            List<ConceptNode> nodesToSave = new ArrayList<>();

            for (JsonNode n : nodesArray) {
                String rawId = n.path("id").asText("").trim();
                String rawLabel = n.path("label").asText("").trim();
                String rawType = n.path("type").asText("CONCEPT").trim().toUpperCase();

                if (rawLabel.isBlank()) continue;
                if (rawLabel.length() > 100) rawLabel = rawLabel.substring(0, 100);
                if (rawType.length() > 50) rawType = rawType.substring(0, 50);

                String normLabel = rawLabel.toLowerCase();
                if (labelToNode.containsKey(normLabel)) {
                    ConceptNode existing = labelToNode.get(normLabel);
                    if (!rawId.isBlank()) {
                        tempIdToNode.put(rawId, existing);
                    }
                    continue;
                }

                ConceptNode node = new ConceptNode();
                node.setLabel(rawLabel);
                node.setType(rawType.isBlank() ? "CONCEPT" : rawType);
                node.setXPosition(null);
                node.setYPosition(null);

                labelToNode.put(normLabel, node);
                if (!rawId.isBlank()) {
                    tempIdToNode.put(rawId, node);
                }
                nodesToSave.add(node);
            }

            if (nodesToSave.size() < 2) {
                throw new BusinessValidationException("Could not extract enough valid, distinct concepts from Gemini response.");
            }

            // Extract & Deduplicate Edges
            JsonNode edgesArray = graphData.path("edges");
            List<TempEdge> validEdges = new ArrayList<>();
            Set<String> existingConnections = new HashSet<>();

            if (edgesArray.isArray()) {
                for (JsonNode e : edgesArray) {
                    String srcId = e.path("source").asText("").trim();
                    String tgtId = e.path("target").asText("").trim();
                    String relType = e.path("relationshipType").asText("RELATES_TO").trim();
                    double weight = e.path("weight").asDouble(1.0);
                    if (weight < 1.0) weight = 1.0;
                    if (weight > 5.0) weight = 5.0;

                    if (relType.length() > 60) relType = relType.substring(0, 60);
                    if (relType.isBlank()) relType = "RELATES_TO";

                    ConceptNode srcNode = tempIdToNode.get(srcId);
                    ConceptNode tgtNode = tempIdToNode.get(tgtId);

                    if (srcNode == null || tgtNode == null) continue;
                    if (srcNode == tgtNode) continue; // Skip self-loops

                    String pairKey = System.identityHashCode(srcNode) + "->" + System.identityHashCode(tgtNode);
                    if (existingConnections.contains(pairKey)) continue;
                    existingConnections.add(pairKey);

                    validEdges.add(new TempEdge(srcNode, tgtNode, relType, weight));
                }
            }

            // If no edges returned, connect sequentially to avoid totally disconnected graph
            if (validEdges.isEmpty() && nodesToSave.size() >= 2) {
                for (int i = 0; i < nodesToSave.size() - 1; i++) {
                    validEdges.add(new TempEdge(nodesToSave.get(i), nodesToSave.get(i + 1), "RELATES_TO", 1.0));
                }
            }

            // Persist KnowledgeGraph
            SystemAccount currentUser = graphService.getCurrentUser();
            KnowledgeGraph graph = new KnowledgeGraph();
            graph.setTitle(title);
            graph.setDescription(description);
            graph.setDomain(domain);
            graph.setIsPublic(Boolean.TRUE.equals(isPublic));
            graph.setOwner(currentUser);
            double complexity = (nodesToSave.size() * 0.4) + (validEdges.size() * 0.6);
            graph.setComplexityScore(Math.round(complexity * 10.0) / 10.0);

            KnowledgeGraph savedGraph = knowledgeGraphRepository.save(graph);

            // Persist Nodes
            for (ConceptNode node : nodesToSave) {
                node.setKnowledgeGraph(savedGraph);
            }
            List<ConceptNode> savedNodes = conceptNodeRepository.saveAll(nodesToSave);

            // Persist Edges
            List<SemanticEdge> edgesToSave = new ArrayList<>();
            for (TempEdge te : validEdges) {
                SemanticEdge edge = new SemanticEdge();
                edge.setKnowledgeGraph(savedGraph);
                edge.setSourceNodeId(te.source.getId());
                edge.setTargetNodeId(te.target.getId());
                edge.setRelationshipType(te.relationshipType);
                edge.setWeight(te.weight);
                edgesToSave.add(edge);
            }
            List<SemanticEdge> savedEdges = semanticEdgeRepository.saveAll(edgesToSave);

            // Log activity and publish creation event
            try {
                ActivityLog log = new ActivityLog();
                log.setGraphId(savedGraph.getId());
                log.setUserId(currentUser.getId());
                log.setAction("GENERATE_GRAPH");
                log.setDetails("Generated knowledge mesh with " + savedNodes.size() + " nodes and " + savedEdges.size() + " connections from prompt: " + prompt);
                activityLogRepository.save(log);

                if (eventPublisher != null) {
                    eventPublisher.publishEvent(new GraphCreatedEvent(this, savedGraph.getId(), currentUser.getId()));
                }
            } catch (Exception ignored) {}

            List<ConceptNodeDto> nodeDtos = savedNodes.stream()
                .map(n -> new ConceptNodeDto(n.getId(), n.getLabel(), n.getType(), n.getXPosition(), n.getYPosition(), savedGraph.getId()))
                .toList();

            List<SemanticEdgeDto> edgeDtos = savedEdges.stream()
                .map(e -> new SemanticEdgeDto(e.getId(), e.getSourceNodeId(), e.getTargetNodeId(), e.getRelationshipType(), e.getWeight(), savedGraph.getId()))
                .toList();

            return new GraphDetailDto(
                savedGraph.getId(),
                savedGraph.getTitle(),
                savedGraph.getDescription(),
                savedGraph.getDomain(),
                savedGraph.getIsPublic(),
                savedGraph.getComplexityScore(),
                savedGraph.getCreatedAt(),
                currentUser.getId(),
                currentUser.getUsername(),
                nodeDtos,
                edgeDtos
            );
        } catch (BusinessValidationException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessValidationException("Failed to process Gemini graph response: " + e.getMessage());
        }
    }

    private String resolveApiKey() {
        if (configuredKey != null && !configuredKey.isBlank() && !configuredKey.startsWith("your_")) {
            return configuredKey.trim();
        }
        String env = System.getenv("GEMINI_API_KEY");
        if (env != null && !env.isBlank() && !env.startsWith("your_")) {
            return env.trim();
        }
        String prop = System.getProperty("GEMINI_API_KEY");
        if (prop != null && !prop.isBlank() && !prop.startsWith("your_")) {
            return prop.trim();
        }
        List<Path> potentialPaths = List.of(
            Paths.get(".env"),
            Paths.get("../.env"),
            Paths.get("backend/.env"),
            Paths.get("../../.env")
        );
        for (Path p : potentialPaths) {
            if (Files.isRegularFile(p)) {
                try {
                    List<String> lines = Files.readAllLines(p, StandardCharsets.UTF_8);
                    for (String line : lines) {
                        line = line.trim();
                        if (line.startsWith("#") || line.isBlank()) continue;
                        if (line.startsWith("GEMINI_API_KEY=") || line.startsWith("gemini_api_key=")) {
                            String value = line.substring(line.indexOf('=') + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.substring(1, value.length() - 1).trim();
                            }
                            if (!value.isBlank() && !value.startsWith("your_")) {
                                return value;
                            }
                        }
                    }
                } catch (Exception ignored) {}
            }
        }
        return null;
    }

    private String resolveModel() {
        String model = null;
        if (configuredModel != null && !configuredModel.isBlank()) {
            model = configuredModel.trim();
        } else {
            String env = System.getenv("GEMINI_MODEL");
            if (env != null && !env.isBlank()) {
                model = env.trim();
            } else {
                List<Path> potentialPaths = List.of(
                    Paths.get(".env"),
                    Paths.get("../.env"),
                    Paths.get("backend/.env")
                );
                for (Path p : potentialPaths) {
                    if (Files.isRegularFile(p)) {
                        try {
                            List<String> lines = Files.readAllLines(p, StandardCharsets.UTF_8);
                            for (String line : lines) {
                                line = line.trim();
                                if (line.startsWith("#") || line.isBlank()) continue;
                                if (line.startsWith("GEMINI_MODEL=") || line.startsWith("gemini_model=")) {
                                    String value = line.substring(line.indexOf('=') + 1).trim();
                                    if (!value.isBlank()) {
                                        model = value;
                                        break;
                                    }
                                }
                            }
                            if (model != null) break;
                        } catch (Exception ignored) {}
                    }
                }
            }
        }

        if (model == null || model.isBlank() || "gemini-2.5-flash".equalsIgnoreCase(model)) {
            return "gemini-3.6-flash";
        }
        return model;
    }

    private Map<String, Object> buildResponseSchema() {
        Map<String, Object> nodeItem = Map.of(
            "type", "OBJECT",
            "properties", Map.of(
                "id", Map.of("type", "STRING", "description", "Temporary identifier e.g. node_1"),
                "label", Map.of("type", "STRING", "description", "Clear, concise concept name (1-4 words)"),
                "type", Map.of("type", "STRING", "description", "Concept category or classification")
            ),
            "required", List.of("id", "label", "type")
        );

        Map<String, Object> edgeItem = Map.of(
            "type", "OBJECT",
            "properties", Map.of(
                "source", Map.of("type", "STRING", "description", "Source node temporary id"),
                "target", Map.of("type", "STRING", "description", "Target node temporary id"),
                "relationshipType", Map.of("type", "STRING", "description", "Relationship phrase e.g. CONTAINS, ENABLES"),
                "weight", Map.of("type", "NUMBER", "description", "Connection weight 1.0 to 3.0")
            ),
            "required", List.of("source", "target", "relationshipType")
        );

        return Map.of(
            "type", "OBJECT",
            "properties", Map.of(
                "title", Map.of("type", "STRING", "description", "Concise title for the knowledge graph"),
                "description", Map.of("type", "STRING", "description", "1-2 sentence overview of this knowledge graph"),
                "domain", Map.of("type", "STRING", "description", "Primary domain or field of study"),
                "nodes", Map.of("type", "ARRAY", "items", nodeItem),
                "edges", Map.of("type", "ARRAY", "items", edgeItem)
            ),
            "required", List.of("title", "nodes", "edges")
        );
    }

    private String extractErrorMessage(String body, int statusCode) {
        if (body == null || body.isBlank()) return "HTTP status " + statusCode;
        try {
            JsonNode root = objectMapper.readTree(body);
            if (root.has("error") && root.get("error").has("message")) {
                return root.get("error").get("message").asText();
            }
        } catch (Exception ignored) {}
        return body.length() > 200 ? body.substring(0, 200) + "..." : body;
    }

    private record TempEdge(ConceptNode source, ConceptNode target, String relationshipType, double weight) {}
}
