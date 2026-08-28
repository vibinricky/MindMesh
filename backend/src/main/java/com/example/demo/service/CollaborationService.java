package com.example.demo.service;

import com.example.demo.dto.CollaborationInviteDto;
import com.example.demo.dto.CollaborationRequestDto;
import com.example.demo.entity.CollaborationInvite;
import com.example.demo.entity.KnowledgeGraph;
import com.example.demo.entity.SystemAccount;
import com.example.demo.repository.CollaborationInviteRepository;
import com.example.demo.repository.SystemAccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollaborationService {
    private final CollaborationInviteRepository invites;
    private final SystemAccountRepository accounts;
    private final GraphService graphs;
    public CollaborationService(CollaborationInviteRepository invites, SystemAccountRepository accounts, GraphService graphs) { this.invites = invites; this.accounts = accounts; this.graphs = graphs; }

    public CollaborationInviteDto invite(CollaborationRequestDto request) {
        KnowledgeGraph graph = graphs.getGraphById(request.graphId());
        SystemAccount inviter = graphs.getCurrentUser();
        if (!graph.getOwner().getId().equals(inviter.getId())) throw new org.springframework.security.access.AccessDeniedException("Only the graph owner can invite collaborators");
        SystemAccount invitee = accounts.findByUsername(request.inviteeUsername()).orElseThrow(() -> new IllegalArgumentException("Invitee not found"));
        if (invitee.getId().equals(inviter.getId())) throw new IllegalArgumentException("You cannot invite yourself");
        CollaborationInvite invitation = new CollaborationInvite(); invitation.setKnowledgeGraph(graph); invitation.setInviter(inviter); invitation.setInvitee(invitee); invitation.setStatus("PENDING");
        return dto(invites.save(invitation));
    }
    public List<CollaborationInviteDto> pending() { return invites.findByInviteeIdAndStatus(graphs.getCurrentUser().getId(), "PENDING").stream().map(this::dto).toList(); }
    public List<CollaborationInviteDto> graphInvites(Long graphId) { return invites.findAll().stream().filter(invite -> invite.getKnowledgeGraph().getId().equals(graphId)).map(this::dto).toList(); }
    public CollaborationInviteDto respond(Long inviteId, boolean accepted) { CollaborationInvite invite = invites.findById(inviteId).orElseThrow(() -> new IllegalArgumentException("Invite not found")); if (!invite.getInvitee().getId().equals(graphs.getCurrentUser().getId())) throw new org.springframework.security.access.AccessDeniedException("This invite belongs to another user"); invite.setStatus(accepted ? "ACCEPTED" : "REJECTED"); return dto(invites.save(invite)); }
    private CollaborationInviteDto dto(CollaborationInvite invite) { return new CollaborationInviteDto(invite.getId(), invite.getKnowledgeGraph().getId(), invite.getKnowledgeGraph().getTitle(), invite.getInviter().getId(), invite.getInviter().getUsername(), invite.getInvitee().getId(), invite.getInvitee().getUsername(), invite.getStatus(), invite.getCreatedAt()); }
}
