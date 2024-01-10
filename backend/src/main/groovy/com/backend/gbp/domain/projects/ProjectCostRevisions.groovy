package com.backend.gbp.domain.projects

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table
import javax.persistence.Transient
import java.math.RoundingMode
import java.time.Instant

@Entity
@Table(schema = "projects", name = "project_costs_revisions")
@SQLDelete(sql = "UPDATE projects.project_costs_revisions SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ProjectCostRevisions extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "prev_date")
	Instant prevDate

	@GraphQLQuery
	@Column(name = "project")
	UUID project

	@GraphQLQuery
	@Column(name = "project_cost_id")
	UUID projectCostId

	@GraphQLQuery
	@Column(name = "qty")
	BigDecimal qty

	@GraphQLQuery
	@Column(name = "unit")
	String unit

	@GraphQLQuery
	@Column(name = "cost")
	BigDecimal cost

	@GraphQLQuery
	@Column(name = "tag_no")
	String tagNo

	@Transient
	BigDecimal getTotalCost() {
		def e =  qty * cost
		return e.setScale(2, RoundingMode.HALF_EVEN)
	}

}
