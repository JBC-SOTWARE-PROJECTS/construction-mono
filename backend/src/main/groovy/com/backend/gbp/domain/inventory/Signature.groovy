package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.*

import javax.persistence.*

@javax.persistence.Entity
@javax.persistence.Table(schema = "inventory", name = "signature_table")
@SQLDelete(sql = "UPDATE inventory.signature_table SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Signature extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "office_id", referencedColumnName = "id")
	Office office

	@GraphQLQuery
	@Column(name = "signature_type", columnDefinition = 'varchar')
	String signatureType

	@GraphQLQuery
	@Column(name = "signature_header", columnDefinition = 'varchar')
	String signatureHeader

	@GraphQLQuery
	@Column(name = "signature_person", columnDefinition = 'varchar')
	String signaturePerson

	@GraphQLQuery
	@Column(name = "signature_position", columnDefinition = 'varchar')
	String signaturePosition

	@GraphQLQuery
	@Column(name = "is_current_user", columnDefinition = 'bool')
	Boolean currentUsers

	@GraphQLQuery
	@Column(name = "sequence", columnDefinition = 'int')
	Integer sequence

	@GraphQLQuery
	@Column(name = "company")
	UUID company

}
