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
@Table(name = "wtx_2307", schema = "accounting")
class Wtx2307 extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "ref_id", columnDefinition = "varchar")
	UUID refId

	@GraphQLQuery
	@Column(name = "source_doc_no", columnDefinition = "varchar")
	String sourceDoc

	@GraphQLQuery
	@Column(name = "ref_no", columnDefinition = "varchar")
	String refNo

	@GraphQLQuery
	@Column(name = "wtx_date", columnDefinition = "date")
	Instant wtxDate
	
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "supplier", referencedColumnName = "id")
	Supplier supplier

	@GraphQLQuery
	@Column(name = "type", columnDefinition = "varchar")
	String type

	@GraphQLQuery
	@Column(name = "gross", columnDefinition = "numeric")
	BigDecimal gross

	@GraphQLQuery
	@Column(name = "vat_amount", columnDefinition = "numeric")
	BigDecimal vatAmount

	@GraphQLQuery
	@Column(name = "net_vat", columnDefinition = "numeric")
	BigDecimal netVat

	@GraphQLQuery
	@Column(name = "ewt_amount", columnDefinition = "numeric")
	BigDecimal ewtAmount

	@GraphQLQuery
	@Column(name = "process", columnDefinition = "bool")
	Boolean process

	@GraphQLQuery
	@Column(name = "wtx_consolidated", columnDefinition = "uuid")
	UUID wtxConsolidated

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company
	
}

