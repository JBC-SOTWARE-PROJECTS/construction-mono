package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.assets.Assets
import com.backend.gbp.domain.projects.Projects
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


@Entity
@Table(name = "debit_memo_details", schema = "accounting")
class DebitMemoDetails extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "trans_type", referencedColumnName = "id")
	ExpenseTransaction transType

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assets", referencedColumnName = "id")
	Assets assets

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "debit_memo", referencedColumnName = "id")
	DebitMemo debitMemo

	@GraphQLQuery
	@Column(name = "type", columnDefinition = "varchar")
	@UpperCase
	String type

	@GraphQLQuery
	@Column(name = "percent", columnDefinition = "numeric")
	BigDecimal percent

	@GraphQLQuery
	@Column(name = "amount", columnDefinition = "numeric")
	BigDecimal amount

	@GraphQLQuery
	@Column(name = "remarks", columnDefinition = "varchar")
	@UpperCase
	String remarks

}

