package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "transaction_type", schema = "inventory")
class TransactionType extends AbstractAuditingEntity implements Serializable {
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "description", columnDefinition = "varchar")
	@UpperCase
	String description

	@GraphQLQuery
	@Column(name = "flag_value", columnDefinition = "varchar")
	@UpperCase
	String flagValue

	@GraphQLQuery
	@Column(name = "is_active", columnDefinition = "bool")
	Boolean status
	
	@GraphQLQuery
	@Column(name = "tag", columnDefinition = "varchar")
	@UpperCase
	String tag

	@GraphQLQuery
	@Column(name = "fix_asset", columnDefinition = "bool")
	Boolean fixAsset

	@GraphQLQuery
	@Column(name = "consignment", columnDefinition = "bool")
	Boolean consignment

	@GraphQLQuery
	@Column(name = "company")
	UUID company
}

