package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.DocumentTypes
import com.backend.gbp.repository.inventory.DocumentTypeRepository
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
@GraphQLApi
@TypeChecked
class DocumentTypeService {
	
	@Autowired
	DocumentTypeRepository documentTypeRepository
	
	@GraphQLQuery(name = "documentTypeList", description = "List of Document Type")
	List<DocumentTypes> getDocumentTypes() {
		return documentTypeRepository.findAll().sort { it.createdDate }
	}

	@GraphQLQuery(name = "getDocTypeById")
	DocumentTypes getDocTypeById(
			@GraphQLArgument(name = "id") UUID id
	) {
		return documentTypeRepository.getDocTypeById(id)
	}
	
}
