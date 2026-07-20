package com.example.demo.repository;

import com.example.demo.entity.CollaborationInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaborationInviteRepository extends JpaRepository<CollaborationInvite, Long> {
    List<CollaborationInvite> findByInviteeIdAndStatus(Long inviteeId, String status);
}
