package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.domain.types.AutoIntegrateable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.persistence.Transient
import java.time.Instant

@Entity
@Table(name = "petty_cash", schema = "accounting")
class PettyCashAccounting extends AbstractAuditingEntity implements Serializable, AutoIntegrateable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "transaction_type", referencedColumnName = "id")
	ApTransaction transType

	@GraphQLQuery
	@Column(name = "payee_name", columnDefinition = "varchar")
	@UpperCase
	String payeeName

	@GraphQLQuery
	@Column(name = "pcv_no", columnDefinition = "varchar")
	@UpperCase
	String pcvNo

	@GraphQLQuery
	@Column(name = "pcv_date", columnDefinition = "date")
	Instant pcvDate

	@GraphQLQuery
	@Column(name = "pcv_category", columnDefinition = "varchar")
	@UpperCase
	String pcvCategory

	@GraphQLQuery
	@Column(name = "reference_no", columnDefinition = "varchar")
	@UpperCase
	String referenceNo

	@GraphQLQuery
	@Column(name = "reference_type", columnDefinition = "varchar")
	@UpperCase
	String referenceType

	@GraphQLQuery
	@Column(name = "amount_issued", columnDefinition = "numeric")
	@UpperCase
	BigDecimal amountIssued

	@GraphQLQuery
	@Column(name = "amount_used", columnDefinition = "bool")
	@UpperCase
	BigDecimal amountUsed

	@GraphQLQuery
	@Column(name = "amount_unused", columnDefinition = "numeric")
	@UpperCase
	BigDecimal amountUnused

	@GraphQLQuery
	@Column(name = "vat_inclusive", columnDefinition = "numeric")
	Boolean vatInclusive

	@GraphQLQuery
	@Column(name = "vat_rate", columnDefinition = "numeric")
	BigDecimal vatRate

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	@UpperCase
	String status

	@GraphQLQuery
	@Column(name = "posted", columnDefinition = "bool")
	Boolean posted

	@GraphQLQuery
	@Column(name = "posted_ledger", columnDefinition = "uuid")
	UUID postedLedger

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

	@GraphQLQuery
	@Column(name = "remarks", columnDefinition = "varchar")
	@UpperCase
	String remarks

	@GraphQLQuery
	@Column(name = "posted_by", columnDefinition = "varchar")
	String posted_by

	//accounting integrate
	@Override
	String getDomain() {
		return IntegrationDomainEnum.PETTY_CASH.name()
	}

	@Transient
	String flagValue

	@Override
	Map<String, String> getDetails() {
		return [:]
	}

	@Transient
	Office office

	@Transient
	Projects project


	//others
	@Transient
	BigDecimal value_1 = BigDecimal.ZERO
	@Transient
	BigDecimal value_2 = BigDecimal.ZERO
	@Transient
	BigDecimal value_3 = BigDecimal.ZERO
	@Transient
	BigDecimal value_4 = BigDecimal.ZERO
	@Transient
	BigDecimal value_5 = BigDecimal.ZERO
	@Transient
	BigDecimal value_6 = BigDecimal.ZERO
	@Transient
	BigDecimal value_7 = BigDecimal.ZERO
	@Transient
	BigDecimal value_8 = BigDecimal.ZERO
	@Transient
	BigDecimal value_9 = BigDecimal.ZERO
	@Transient
	BigDecimal value_10 = BigDecimal.ZERO
	@Transient
	BigDecimal value_11 = BigDecimal.ZERO
	@Transient
	BigDecimal value_12 = BigDecimal.ZERO
	@Transient
	BigDecimal value_13 = BigDecimal.ZERO
	@Transient
	BigDecimal value_14 = BigDecimal.ZERO
	@Transient
	BigDecimal value_15 = BigDecimal.ZERO
	@Transient
	BigDecimal value_16 = BigDecimal.ZERO
	@Transient
	BigDecimal value_17 = BigDecimal.ZERO
	@Transient
	BigDecimal value_18 = BigDecimal.ZERO
	@Transient
	BigDecimal value_19 = BigDecimal.ZERO
	@Transient
	BigDecimal value_20 = BigDecimal.ZERO
	@Transient
	BigDecimal value_21 = BigDecimal.ZERO
	@Transient
	BigDecimal value_22 = BigDecimal.ZERO
	@Transient
	BigDecimal value_23 = BigDecimal.ZERO
	@Transient
	BigDecimal value_24 = BigDecimal.ZERO
	@Transient
	BigDecimal value_25 = BigDecimal.ZERO
	@Transient
	BigDecimal value_26 = BigDecimal.ZERO
	@Transient
	BigDecimal value_27 = BigDecimal.ZERO
	@Transient
	BigDecimal value_28 = BigDecimal.ZERO
	@Transient
	BigDecimal value_29 = BigDecimal.ZERO
	@Transient
	BigDecimal value_30 = BigDecimal.ZERO
	@Transient
	BigDecimal value_31 = BigDecimal.ZERO
	@Transient
	BigDecimal value_32 = BigDecimal.ZERO
	@Transient
	BigDecimal value_33 = BigDecimal.ZERO
	@Transient
	BigDecimal value_34 = BigDecimal.ZERO
	@Transient
	BigDecimal value_35 = BigDecimal.ZERO
	@Transient
	BigDecimal value_36 = BigDecimal.ZERO
	@Transient
	BigDecimal value_37 = BigDecimal.ZERO
	@Transient
	BigDecimal value_38 = BigDecimal.ZERO
	@Transient
	BigDecimal value_39 = BigDecimal.ZERO
	@Transient
	BigDecimal value_40 = BigDecimal.ZERO
	@Transient
	BigDecimal value_41 = BigDecimal.ZERO
	@Transient
	BigDecimal value_42 = BigDecimal.ZERO
	@Transient
	BigDecimal value_43 = BigDecimal.ZERO
	@Transient
	BigDecimal value_44 = BigDecimal.ZERO
	@Transient
	BigDecimal value_45 = BigDecimal.ZERO
	@Transient
	BigDecimal value_46 = BigDecimal.ZERO
	@Transient
	BigDecimal value_47 = BigDecimal.ZERO
	@Transient
	BigDecimal value_48 = BigDecimal.ZERO
	@Transient
	BigDecimal value_49 = BigDecimal.ZERO
	@Transient
	BigDecimal value_50 = BigDecimal.ZERO
	@Transient
	BigDecimal value_51 = BigDecimal.ZERO
	@Transient
	BigDecimal value_52 = BigDecimal.ZERO
	@Transient
	BigDecimal value_53 = BigDecimal.ZERO
	@Transient
	BigDecimal value_54 = BigDecimal.ZERO
	@Transient
	BigDecimal value_55 = BigDecimal.ZERO
	@Transient
	BigDecimal value_56 = BigDecimal.ZERO
	@Transient
	BigDecimal value_57 = BigDecimal.ZERO
	@Transient
	BigDecimal value_58 = BigDecimal.ZERO
	@Transient
	BigDecimal value_59 = BigDecimal.ZERO
	@Transient
	BigDecimal value_60 = BigDecimal.ZERO
	@Transient
	BigDecimal value_61 = BigDecimal.ZERO
	@Transient
	BigDecimal value_62 = BigDecimal.ZERO
	@Transient
	BigDecimal value_63 = BigDecimal.ZERO
	@Transient
	BigDecimal value_64 = BigDecimal.ZERO
	@Transient
	BigDecimal value_65 = BigDecimal.ZERO
	@Transient
	BigDecimal value_66 = BigDecimal.ZERO
	@Transient
	BigDecimal value_67 = BigDecimal.ZERO
	@Transient
	BigDecimal value_68 = BigDecimal.ZERO
	@Transient
	BigDecimal value_69 = BigDecimal.ZERO
	@Transient
	BigDecimal value_70 = BigDecimal.ZERO
	@Transient
	BigDecimal value_71 = BigDecimal.ZERO
	@Transient
	BigDecimal value_72 = BigDecimal.ZERO
	@Transient
	BigDecimal value_73 = BigDecimal.ZERO
	@Transient
	BigDecimal value_74 = BigDecimal.ZERO
	@Transient
	BigDecimal value_75 = BigDecimal.ZERO
	@Transient
	BigDecimal value_76 = BigDecimal.ZERO
	@Transient
	BigDecimal value_77 = BigDecimal.ZERO
	@Transient
	BigDecimal value_78 = BigDecimal.ZERO
	@Transient
	BigDecimal value_79 = BigDecimal.ZERO
	@Transient
	BigDecimal value_80 = BigDecimal.ZERO
	@Transient
	BigDecimal value_81 = BigDecimal.ZERO
	@Transient
	BigDecimal value_82 = BigDecimal.ZERO
	@Transient
	BigDecimal value_83 = BigDecimal.ZERO
	@Transient
	BigDecimal value_84 = BigDecimal.ZERO
	@Transient
	BigDecimal value_85 = BigDecimal.ZERO
	@Transient
	BigDecimal value_86 = BigDecimal.ZERO
	@Transient
	BigDecimal value_87 = BigDecimal.ZERO
	@Transient
	BigDecimal value_88 = BigDecimal.ZERO
	@Transient
	BigDecimal value_89 = BigDecimal.ZERO
	@Transient
	BigDecimal value_90 = BigDecimal.ZERO
	@Transient
	BigDecimal value_91 = BigDecimal.ZERO
	@Transient
	BigDecimal value_92 = BigDecimal.ZERO
	@Transient
	BigDecimal value_93 = BigDecimal.ZERO
	@Transient
	BigDecimal value_94 = BigDecimal.ZERO
	@Transient
	BigDecimal value_95 = BigDecimal.ZERO
	@Transient
	BigDecimal value_96 = BigDecimal.ZERO
	@Transient
	BigDecimal value_97 = BigDecimal.ZERO
	@Transient
	BigDecimal value_98 = BigDecimal.ZERO
	@Transient
	BigDecimal value_99 = BigDecimal.ZERO
	@Transient
	BigDecimal value_100 = BigDecimal.ZERO
	
}

