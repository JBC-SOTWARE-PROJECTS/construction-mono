package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.inventory.Supplier
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table
import java.time.Instant

@Entity
@Table(name = "wtx_consolidated", schema = "accounting")
class Wtx2307Consolidated extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "ref_no", columnDefinition = "varchar")
	String refNo

	@GraphQLQuery
	@Column(name = "date_from", columnDefinition = "date")
	Instant dateFrom

	@GraphQLQuery
	@Column(name = "date_to", columnDefinition = "date")
	Instant dateTo
	
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "supplier", referencedColumnName = "id")
	Supplier supplier

	@GraphQLQuery
	@Column(name = "remarks", columnDefinition = "varchar")
	String remarks

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

}

