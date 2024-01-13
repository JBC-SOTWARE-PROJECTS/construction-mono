package com.backend.gbp.domain.projects

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.ArCustomers
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.types.Subaccountable
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
@Table(schema = "projects", name = "projects")
@SQLDelete(sql = "UPDATE projects.projects SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Projects extends AbstractAuditingEntity implements Serializable, Subaccountable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "prefix_short_name")
	@UpperCase
	String prefixShortName

	@GraphQLQuery
	@Column(name = "code")
	String projectCode
	
	@GraphQLQuery
	@Column(name = "description")
	@UpperCase
	String description

	@GraphQLQuery
	@Column(name = "started")
	Instant projectStarted

	@GraphQLQuery
	@Column(name = "ended")
	Instant projectEnded

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "customer", referencedColumnName = "id")
	ArCustomers customer

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "location", referencedColumnName = "id")
	Office location

	@GraphQLQuery
	@Column(name = "image")
	String image

	@GraphQLQuery
	@Column(name = "remarks")
	String remarks

	@GraphQLQuery
	@Column(name = "total_cost")
	BigDecimal total_cost
	
	@GraphQLQuery
	@Column(name = "status")
	String status

	@GraphQLQuery
	@Column(name = "disabled_editing")
	Boolean disabledEditing

	@GraphQLQuery
	@Column(name = "project_color", columnDefinition = 'varchar')
	@UpperCase
	String projectColor

	@GraphQLQuery
	@Column(name = "project_status_color", columnDefinition = 'varchar')
	@UpperCase
	String projectStatusColor

	@GraphQLQuery
	@Column(name = "project_percent")
	BigDecimal projectPercent



	@GraphQLQuery
	@Column(name = "company")
	UUID company

	@GraphQLQuery
	@Column(name = "contract_id", columnDefinition = 'varchar')
	String contractId

	@Override
	String getCode() {
		return projectCode
	}

	@Override
	String getAccountName() {
		return description
	}

	@Override
	String getDomain() {
		return Projects.class.name
	}
}
