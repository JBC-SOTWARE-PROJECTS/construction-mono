package com.backend.gbp.domain.hrm

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.assets.VehicleUsageMonitoring
import com.backend.gbp.domain.inventory.Item
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "hrm", name = "employee_documents")
@SQLDelete(sql = "UPDATE hrm.employee_documents SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class EmployeeDocs extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "doc_type")
	String docType

	@GraphQLQuery
	@Column(name = "description")
	String description

	@GraphQLQuery
	@Column(name = "file")
	String file

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee", referencedColumnName = "id")
	Employee employee

	@GraphQLQuery
	@Column(name = "company")
	UUID company

}
