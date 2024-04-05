package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.types.AutoIntegrateable
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
@Table(schema = "inventory", name = "return_supplier")
@SQLDelete(sql = "UPDATE inventory.return_supplier SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ReturnSupplier extends AbstractAuditingEntity implements Serializable, AutoIntegrateable{
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "rts_no", columnDefinition = 'varchar')
	String rtsNo
	
	@GraphQLQuery
	@Column(name = "return_date", columnDefinition = 'timestamp without time zone')
	Instant returnDate

	@GraphQLQuery
	@Column(name = "ref_srr", columnDefinition = 'varchar')
	String refSrr

	@GraphQLQuery
	@Column(name = "reference_type", columnDefinition = 'varchar')
	String referenceType
	
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
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "supplier", referencedColumnName = "id")
	Supplier supplier

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "trans_type", referencedColumnName = "id")
	TransactionType transType
	
	@GraphQLQuery
	@Column(name = "received_by", columnDefinition = 'varchar')
	@UpperCase
	String received_by

	@GraphQLQuery
	@Column(name = "return_by", columnDefinition = 'varchar')
	@UpperCase
	String returnBy

	@GraphQLQuery
	@Column(name = "return_user", columnDefinition = 'uuid')
	UUID returnUser
	
	@GraphQLQuery
	@Column(name = "is_posted", columnDefinition = 'bool')
	Boolean isPosted
	
	@GraphQLQuery
	@Column(name = "is_void", columnDefinition = 'bool')
	Boolean isVoid

	@GraphQLQuery
	@Column(name = "company")
	UUID company

	@GraphQLQuery
	@Column(name = "posted_by")
	String postedBy

	@GraphQLQuery
	@Column(name = "posted_ledger")
	UUID postedLedger


	//accounting integrate
	@Override
	String getDomain() {
		return IntegrationDomainEnum.RETURN_SUPPLIER.name()
	}

	@Transient
	String flagValue

	@Override
	Map<String, String> getDetails() {
		return [:]
	}
	//end: accounting integrate

	@Transient
	BigDecimal supplierAmount

	@Transient
	BigDecimal negativeSupplierAmount

	@Transient
	ItemSubAccount itemSubAccount

	//item source columns
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
