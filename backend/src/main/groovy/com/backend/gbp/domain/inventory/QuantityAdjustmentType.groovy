package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(schema = "inventory", name = "quantity_adjustment_type")
@SQLDelete(sql = "UPDATE inventory.quantity_adjustment_type SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class QuantityAdjustmentType extends AbstractAuditingEntity implements Serializable {

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
	@Column(name = "flag_value", columnDefinition = 'varchar')
	String flagValue

	@GraphQLQuery
	@Column(name = "source_column", columnDefinition = 'varchar')
	String sourceColumn

	@GraphQLQuery
	@Column(name = "is_active", columnDefinition = 'bool')
	Boolean is_active

	@GraphQLQuery
	@Column(name = "company")
	UUID company

}
