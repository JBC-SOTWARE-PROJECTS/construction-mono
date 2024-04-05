package com.backend.gbp.repository.inventory

import com.backend.gbp.domain.inventory.Attachments
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AttachmentRepository extends JpaRepository<Attachments, UUID> {
	
	@Query(value = "select q from Attachments q where q.referenceId = :id")
	List<Attachments> getAttachmentUploads(@Param('id') UUID id)
	
}
