package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.projects.Projects
import io.leangen.graphql.annotations.GraphQLQuery
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
@Table(schema = "asset", name = "vehicle_usage_employee")
@SQLDelete(sql = "UPDATE asset.vehicle_usage_employee SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class VehicleUsageEmployee extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "designation")
	String designation

	@GraphQLQuery
	@Column(name = "remarks")
	String remarks

	@GraphQLQuery
	@Column(name = "time_rendered_start")
	Instant timeRenderedStart

	@GraphQLQuery
	@Column(name = "time_rendered_end")
	Instant timeRenderedEnd

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee", referencedColumnName = "id")
	Employee employee

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset", referencedColumnName = "id")
	Assets asset

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vehicle_usage", referencedColumnName = "id")
	VehicleUsageMonitoring vehicleUsage

	@GraphQLQuery
	@Column(name = "company")
	UUID company

}
