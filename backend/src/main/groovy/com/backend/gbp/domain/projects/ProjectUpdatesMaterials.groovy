package com.backend.gbp.domain.projects

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.inventory.Item
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.math.RoundingMode
import java.time.Instant

@Entity
@Table(schema = "projects", name = "projects_updates_materials")
@SQLDelete(sql = "UPDATE projects.projects_updates_materials SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ProjectUpdatesMaterials extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project_updates", referencedColumnName = "id")
	ProjectUpdates projectUpdates

	@GraphQLQuery
	@Column(name = "date_transact")
	Instant dateTransact

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@GraphQLQuery
	@Column(name = "on_hand")
	Integer onHand

	@GraphQLQuery
	@Column(name = "qty")
	Integer qty

	@GraphQLQuery
	@Column(name = "balance")
	Integer balance

	@GraphQLQuery
	@Column(name = "w_cost")
	BigDecimal cost

	@GraphQLQuery
	@Column(name = "remarks")
	String remarks

	@GraphQLQuery
	@Column(name = "ref_id")
	UUID stockCardRefId


	@Transient
	BigDecimal getSubTotal() {
		BigDecimal total = cost * qty
		return total.setScale(2, RoundingMode.HALF_EVEN)
	}

	@Transient
	String getUou() {
		return item.unit_of_usage.unitDescription
	}

	@Transient
	String getDescLong() {
		return item.descLong
	}

}
