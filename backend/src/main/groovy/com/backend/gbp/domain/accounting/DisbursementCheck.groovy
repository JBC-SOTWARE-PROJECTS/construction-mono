package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
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
import java.time.Instant

@Entity
@Table(name = "disbursement_check", schema = "accounting")
class DisbursementCheck extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "disbursement", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	Disbursement disbursement

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bank", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	Bank bank

	@GraphQLQuery
	@Column(name = "bank_branch", columnDefinition = "varchar")
	@UpperCase
	String bankBranch

	@GraphQLQuery
	@Column(name = "check_no", columnDefinition = "varchar")
	@UpperCase
	String checkNo

	@GraphQLQuery
	@Column(name = "check_date", columnDefinition = "date")
	@UpperCase
	Instant checkDate

	@GraphQLQuery
	@Column(name = "amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal amount

	@GraphQLQuery
	@Column(name = "releasing")
	UUID releasing


}

