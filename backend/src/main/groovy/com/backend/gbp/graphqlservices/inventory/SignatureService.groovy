package com.backend.gbp.graphqlservices.inventory

import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.User
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.inventory.Signature
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.inventory.SignatureRepository
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@GraphQLApi
@TypeChecked
class SignatureService extends AbstractDaoService<Signature> {

	SignatureService() {
		super(Signature.class)
	}
	
	@Autowired
	ObjectMapper objectMapper
	
	@Autowired
	GeneratorService generatorService
	
	@Autowired
	UserRepository userRepository
	
	@Autowired
	EmployeeRepository employeeRepository

	@Autowired
	SignatureRepository signatureRepository


	//===========mutation====================//
	@Transactional
	@GraphQLMutation(name = "upsertSignature", description = "Insert/Update Signature")
	Signature upsertSignature(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "id") UUID id
	) {

		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)
		def forInsert = objectMapper.convertValue(fields, Signature)

		try {
			if(forInsert.currentUsers){
				Signature upsert = signatureRepository.findActiveSignatureDept(employee.office.id,forInsert.signatureType)
				if(upsert)
				{
					upsert.currentUsers = false
					save(upsert)
				}
			}

			if(id){
				Signature upsert = findOne(id)

				if(forInsert.sequence != null) {
					def exisitngSeq = signatureRepository.findSignatureSequenceDept(employee.office.id, forInsert.sequence, forInsert.signatureType)

					if(exisitngSeq != null){
						Signature existUpsert = findOne(exisitngSeq.id)
						existUpsert.sequence = upsert.sequence
						save(existUpsert)
					}
				}
				else {
					Integer numberofSignature = signatureRepository.countNumberofSignature(employee.office.id, forInsert.signatureType)
					forInsert.sequence = numberofSignature + 1
				}

				upsert.signatureHeader = forInsert.signatureHeader
				upsert.signaturePerson = forInsert.signaturePerson
				upsert.signaturePosition = forInsert.signaturePosition
				upsert.currentUsers = forInsert.currentUsers
                upsert.sequence = forInsert.sequence
                save(upsert)
				return upsert

			}
			else {
				Signature upsert = new Signature()

				if(forInsert.sequence != null) {
					def exisitngSeq = signatureRepository.findSignatureSequenceDept(employee.office.id, forInsert.sequence, forInsert.signatureType)

					if(exisitngSeq != null){
						Integer numberofSignature = signatureRepository.countNumberofSignature(employee.office.id, forInsert.signatureType)
						Signature existUpsert = findOne(exisitngSeq.id)
						existUpsert.sequence = numberofSignature + 1
						save(existUpsert)
					}
				}
				else {
					Integer numberofSignature = signatureRepository.countNumberofSignature(employee.office.id, forInsert.signatureType)
					forInsert.sequence = numberofSignature + 1
				}

				upsert.office = employee.office
				upsert.signatureType = forInsert.signatureType
				upsert.signatureHeader = forInsert.signatureHeader
				upsert.signaturePerson = forInsert.signaturePerson
				upsert.signaturePosition = forInsert.signaturePosition
                upsert.currentUsers = forInsert.currentUsers
                upsert.sequence = forInsert.sequence
                save(upsert)
				return upsert
			}


		} catch (Exception e) {
			throw new Exception("Something was Wrong : " + e)
		}

	}

	@GraphQLQuery(name = "signatureList", description = "List of Signature per type")
	List<Signature> signatureList(
			@GraphQLArgument(name = "type") String type
	) {
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)
		createQuery("Select f from Signature f where f.signatureType = :type and f.office.id = :office",
						 [
								 type:type,
								 office:employee.office.id,
						 ] as Map<String, Object>).resultList.sort { it.sequence }
	}

	@GraphQLQuery(name = "signatureListFilter", description = "List of Signature per type")
	List<Signature> signatureListFilter(@GraphQLArgument(name = "type") String type, @GraphQLArgument(name = "filter") String filter) {
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)
		createQuery("Select f from Signature f where f.signatureType = :type and f.office.id = :office " +
				"and (lower(f.signaturePerson) like lower(concat('%',:filter,'%')) or " +
				"lower(f.signatureHeader) like lower(concat('%',:filter,'%')))",
				[
						type:type,
						office:employee.office.id,
						filter:filter,
				] as Map<String, Object>).resultList.sort { it.sequence }
	}

	@GraphQLQuery(name = "findOneSignature", description = "find signature by id")
	Signature findOneSignature(@GraphQLArgument(name = "id") UUID id) {
		return this.findOne(id)
	}
}
