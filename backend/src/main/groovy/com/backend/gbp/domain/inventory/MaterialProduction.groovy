package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.hrm.Employee
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
@Table(schema = "inventory", name = "material_production")
@SQLDelete(sql = "UPDATE inventory.material_production SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class MaterialProduction extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "date_trans", columnDefinition = "date")
	Instant dateTransaction
	
	@GraphQLQuery
	@Column(name = "mp_no", columnDefinition = "varchar")
	String mpNo

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office
	
	@GraphQLQuery
	@Column(name = "description")
	String description

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "produced_by", referencedColumnName = "id")
	Employee producedBy

	@GraphQLQuery
	@Column(name = "is_posted")
	Boolean isPosted

	@GraphQLQuery
	@Column(name = "is_void")
	Boolean isVoid

	@GraphQLQuery
	@Column(name = "company")
	UUID company
	
}
