package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Attachments
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.inventory.AttachmentRepository
import com.backend.gbp.services.DigitalOceanSpaceService
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired

import org.springframework.stereotype.Component

import javax.transaction.Transactional


@Component
@GraphQLApi
@TypeChecked
class AttachmentService {
	
	@Autowired
	AttachmentRepository attachmentRepository
	
	@Autowired
	ObjectMapper objectMapper
	
	@Autowired
	GeneratorService generatorService

	@Autowired
	DigitalOceanSpaceService digitalOceanSpaceService

	
	@GraphQLQuery(name = "attachmentById")
	Attachments attachmentById(@GraphQLArgument(name = "id") UUID id) {
		return attachmentRepository.findById(id).get()
	}


	@GraphQLQuery(name = "attachmentByRefId")
	List<Attachments> attachmentByRefId(@GraphQLArgument(name = "refId") UUID refId) {
		if(refId) {
			return attachmentRepository.getAttachmentUploads(refId)
		}else {
			return []
		}

	}

	@GraphQLMutation(name = "removeAttachment")
	@Transactional
	GraphQLRetVal<Boolean> removeAttachment(
			@GraphQLArgument(name = "id") UUID id
	) {
		if(id) {
			def remove = attachmentRepository.findById(id).get()
			attachmentRepository.delete(remove)
			//delete in do
			digitalOceanSpaceService.deleteFileToSpace("${remove.folderName}${remove.fileName}")
			return new GraphQLRetVal<Boolean>(true, true, "Attachment successfully removed.")
		}else{
			return new GraphQLRetVal<Boolean>(false, false, "Unique Id is missing")
		}
	}
	
}
