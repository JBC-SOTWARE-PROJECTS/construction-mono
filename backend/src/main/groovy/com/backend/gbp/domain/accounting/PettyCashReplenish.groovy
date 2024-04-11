package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.assets.Assets
import com.backend.gbp.domain.projects.Projects
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

@Entity
@Table(name = "petty_cash_replenish", schema = "accounting")
class PettyCashReplenish extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "trans_date", columnDefinition = "date")
	Instant transDate

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "petty_cash", referencedColumnName = "id")
	PettyCashAccounting pettyCash

	@GraphQLQuery
	@Column(name = "ref_no", columnDefinition = "varchar")
	@UpperCase
	String refNo

	@GraphQLQuery
	@Column(name = "ref_id", columnDefinition = "uuid")
	UUID refId

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

	@GraphQLQuery
	@Column(name = "amount", columnDefinition = "numeric")
	BigDecimal amount

}

