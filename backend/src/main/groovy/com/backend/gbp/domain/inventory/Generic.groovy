package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "inventory", name = "generics")
@SQLDelete(sql = "UPDATE inventory.generics SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Generic extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "generic_code")
	String genericCode
	
	@GraphQLQuery
	@Column(name = "generic_description")
	@UpperCase
	String genericDescription
	
	@GraphQLQuery
	@Column(name = "is_active")
	Boolean isActive

}
