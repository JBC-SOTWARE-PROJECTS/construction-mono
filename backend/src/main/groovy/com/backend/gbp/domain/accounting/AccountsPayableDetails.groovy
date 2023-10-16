package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.projects.Projects
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.ConstraintMode
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.ForeignKey
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table


@Entity
@Table(name = "payables_detials", schema = "accounting")
class AccountsPayableDetails extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payables", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	AccountsPayable accountsPayable

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "trans_type", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	ApTransaction transType

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	Office office

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	Projects project
	
	@GraphQLQuery
	@Column(name = "amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal amount

	@GraphQLQuery
	@Column(name = "disc_rate", columnDefinition = "numeric")
	@UpperCase
	BigDecimal discRate

	@GraphQLQuery
	@Column(name = "disc_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal discAmount

	@GraphQLQuery
	@Column(name = "vat_inclusive", columnDefinition = "bool")
	@UpperCase
	Boolean vatInclusive

	@GraphQLQuery
	@Column(name = "vat_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal vatAmount

	@GraphQLQuery
	@Column(name = "tax_description", columnDefinition = "varchar")
	@UpperCase
	String taxDesc

	@GraphQLQuery
	@Column(name = "ewt_rate", columnDefinition = "numeric")
	@UpperCase
	BigDecimal ewtRate

	@GraphQLQuery
	@Column(name = "ewt_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal ewtAmount

	@GraphQLQuery
	@Column(name = "net_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal netAmount

	@GraphQLQuery
	@Column(name = "remarks_notes", columnDefinition = "varchar")
	@UpperCase
	String remarksNotes

	@GraphQLQuery
	@Column(name = "ref_id", columnDefinition = "uuid")
	UUID refId

	@GraphQLQuery 	
	@Column(name = "ref_no", columnDefinition = "varchar")
	@UpperCase
	String refNo

	@GraphQLQuery
	@Column(name = "source", columnDefinition = "varchar")
	String source
	
}

