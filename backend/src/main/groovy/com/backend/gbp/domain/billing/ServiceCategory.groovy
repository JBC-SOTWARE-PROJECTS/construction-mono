package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "billing", name = "service_category")
@SQLDelete(sql = "UPDATE billing.service_category SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ServiceCategory extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "code", columnDefinition = 'varchar')
	String code

	@GraphQLQuery
	@Column(name = "description", columnDefinition = 'varchar')
	@UpperCase
	String description

	@GraphQLQuery
	@Column(name = "is_active", columnDefinition = 'bool')
	Boolean is_active

}
