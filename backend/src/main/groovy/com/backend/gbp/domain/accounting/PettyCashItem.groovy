package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.inventory.Item
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
@Table(name = "petty_cash_purchases", schema = "accounting")
class PettyCashItem extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "petty_cash", referencedColumnName = "id")
	PettyCash pettyCash

	@GraphQLQuery
	@Column(name = "qty", columnDefinition = "int")
	Integer qty

	@GraphQLQuery
	@Column(name = "unit_cost", columnDefinition = "numeric")
	BigDecimal unitCost

	@GraphQLQuery
	@Column(name = "disc_rate", columnDefinition = "numeric")
	BigDecimal discRate

	@GraphQLQuery
	@Column(name = "disc_amount", columnDefinition = "numeric")
	BigDecimal discAmount

	@GraphQLQuery
	@Column(name = "net_amount", columnDefinition = "numeric")
	BigDecimal netAmount

	@GraphQLQuery
	@Column(name = "is_vat", columnDefinition = "bool")
	Boolean isVat

	@GraphQLQuery
	@Column(name = "vat_amount", columnDefinition = "numeric")
	BigDecimal vatAmount

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

}

