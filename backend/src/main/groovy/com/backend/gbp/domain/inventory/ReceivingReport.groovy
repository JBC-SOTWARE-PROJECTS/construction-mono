package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.projects.Projects
import com.fasterxml.jackson.annotation.JsonIgnore
import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "inventory", name = "receiving_report")
@SQLDelete(sql = "UPDATE inventory.receiving_report SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ReceivingReport extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "received_type", columnDefinition = 'varchar')
	@UpperCase
	String receivedType
	
	@GraphQLQuery
	@Column(name = "received_no", columnDefinition = 'varchar')
	String rrNo
	
	@GraphQLQuery
	@Column(name = "received_date", columnDefinition = 'timestamp without time zone')
	Instant receiveDate
	
	@GraphQLQuery
	@Column(name = "user_id", columnDefinition = "uuid")
	UUID userId
	
	@GraphQLQuery
	@Column(name = "user_fullname", columnDefinition = "varchar")
	String userFullname

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "purchase_order", referencedColumnName = "id")
	PurchaseOrder purchaseOrder
	
	@GraphQLQuery
	@Column(name = "received_ref_no", columnDefinition = 'varchar')
	@UpperCase
	String receivedRefNo
	
	@GraphQLQuery
	@Column(name = "received_ref_date", columnDefinition = 'timestamp without time zone')
	Instant receivedRefDate
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "received_office", referencedColumnName = "id")
	Office receivedOffice
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "supplier", referencedColumnName = "id")
	Supplier supplier
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "payment_terms", referencedColumnName = "id")
	PaymentTerm paymentTerms
	
	@GraphQLQuery
	@Column(name = "received_remarks", columnDefinition = 'text')
	@UpperCase
	String receivedRemarks
	
	@GraphQLQuery
	@Column(name = "fix_discount", columnDefinition = 'numeric')
	BigDecimal fixDiscount
	
	@GraphQLQuery
	@Column(name = "gross_amount", columnDefinition = 'numeric')
	BigDecimal grossAmount
	
	@GraphQLQuery
	@Column(name = "total_discount", columnDefinition = 'numeric')
	BigDecimal totalDiscount
	
	@GraphQLQuery
	@Column(name = "net_of_discount", columnDefinition = 'numeric')
	BigDecimal netDiscount
	
	@GraphQLQuery
	@Column(name = "amount", columnDefinition = 'numeric')
	BigDecimal amount
	
	@GraphQLQuery
	@Column(name = "vat_rate", columnDefinition = 'numeric')
	BigDecimal vatRate
	
	@GraphQLQuery
	@Column(name = "input_tax", columnDefinition = 'numeric')
	BigDecimal inputTax
	
	@GraphQLQuery
	@Column(name = "net_amount", columnDefinition = 'numeric')
	BigDecimal netAmount
	
	@GraphQLQuery
	@Column(name = "vat_inclusive", columnDefinition = 'bool')
	Boolean vatInclusive
	
	@GraphQLQuery
	@Column(name = "is_posted", columnDefinition = 'bool')
	Boolean isPosted
	
	@GraphQLQuery
	@Column(name = "is_void", columnDefinition = 'bool')
	Boolean isVoid
	
	@GraphQLQuery
	@Column(name = "acct_type", columnDefinition = 'uuid')
	UUID account
	
	@JsonIgnore
	@Transient
	Instant getDateCreated() {
		return createdDate
	}
	
}
