package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.types.Subaccountable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.*

import javax.persistence.*

@javax.persistence.Entity
@javax.persistence.Table(schema = "inventory", name = "supplier")
@SQLDelete(sql = "UPDATE inventory.supplier SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Supplier extends AbstractAuditingEntity implements Serializable, Subaccountable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "supplier_code")
	String supplierCode
	
	@GraphQLQuery
	@Column(name = "supplier_fullname")
	@UpperCase
	String supplierFullname
	
	@GraphQLQuery
	@Column(name = "supplier_tin")
	String supplierTin
	
	@GraphQLQuery
	@Column(name = "supplier_email")
	String supplierEmail
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payment_terms", referencedColumnName = "id")
	PaymentTerm paymentTerms //fk
	
	@GraphQLQuery
	@Column(name = "supplier_entity")
	String supplierEntity
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "supplier_types", referencedColumnName = "id")
	SupplierType supplierTypes //fk
	
	@GraphQLQuery
	@Column(name = "credit_limit")
	BigDecimal creditLimit
	
	@GraphQLQuery
	@Column(name = "is_vatable")
	Boolean isVatable
	
	@GraphQLQuery
	@Column(name = "is_vat_inclusive")
	Boolean isVatInclusive
	
	@GraphQLQuery
	@Column(name = "remarks")
	String remarks
	
	@GraphQLQuery
	@Column(name = "lead_time")
	Integer leadTime
	
	@GraphQLQuery
	@Column(name = "primary_address")
	@UpperCase
	String primaryAddress
	
	@GraphQLQuery
	@Column(name = "primary_telphone")
	String primaryTelphone
	
	@GraphQLQuery
	@Column(name = "primary_contactperson")
	@UpperCase
	String primaryContactPerson
	
	@GraphQLQuery
	@Column(name = "primary_fax")
	String primaryFax
	
	@GraphQLQuery
	@Column(name = "secondary_address")
	@UpperCase
	String secondaryAddress
	
	@GraphQLQuery
	@Column(name = "secondary_telphone")
	String secondaryTelphone
	
	@GraphQLQuery
	@Column(name = "secondary_contactperson")
	@UpperCase
	String secondaryContactPerson
	
	@GraphQLQuery
	@Column(name = "secondary_fax")
	String secondaryFax

	@GraphQLQuery
	@Column(name = "is_active")
	Boolean isActive
  
  @GraphQLQuery
	@Column(name = "company")
	UUID company

	@Override
	String getCode() {
		return supplierCode
	}

	@Override
	String getAccountName() {
		return supplierFullname
	}

	@Override
	String getDomain() {
		return Supplier.class.name
	}

}
