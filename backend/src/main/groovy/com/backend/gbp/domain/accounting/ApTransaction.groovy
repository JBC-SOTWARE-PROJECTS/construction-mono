package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.inventory.SupplierType
import com.backend.gbp.domain.types.Subaccountable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table


@Entity
@Table(name = "ap_trans_types", schema = "accounting")
class ApTransaction extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "supplier_type", referencedColumnName = "id")
	SupplierType supplierType

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

	@GraphQLQuery
	@Column(name = "description", columnDefinition = "varchar")
	@UpperCase
	String description

	@GraphQLQuery
	@Column(name = "flag_value", columnDefinition = "varchar")
	@UpperCase
	String flagValue

	@GraphQLQuery
	@Column(name = "ap_category", columnDefinition = "varchar")
	@UpperCase
	String category

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "numeric")
	Boolean status

}

