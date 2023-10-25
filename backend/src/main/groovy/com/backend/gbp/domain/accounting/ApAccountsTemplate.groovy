package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.inventory.SupplierType
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(name = "ap_account_templates", schema = "accounting")
class ApAccountsTemplate extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "supplier_type", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	SupplierType supplierType

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

	@GraphQLQuery
	@Column(name = "description", columnDefinition = "varchar")
	@UpperCase
	String description

	@GraphQLQuery
	@Column(name = "ap_category", columnDefinition = "varchar")
	@UpperCase
	String category

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "numeric")
	Boolean status

}

