package com.backend.gbp.domain.hrm
import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.projects.Projects
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.*
import javax.persistence.Table
import javax.persistence.Entity
import javax.persistence.*
import java.time.Instant


//@SQLDelete(sql = "UPDATE hrm.department_schedule SET deleted = true WHERE id = ?")
//@Where(clause = "deleted <> true or deleted is  null ")
@Entity
@Table(schema = "hrm", name = "schedule")
class Schedule extends AbstractAuditingEntity {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	

	@GraphQLQuery
	@Column(name = "title", columnDefinition = "varchar")
	String title

	@GraphQLQuery
	@Column(name = "label", columnDefinition = "varchar")
	String label
	
	@GraphQLQuery
	@Column(name = "date_time_start", nullable = false)
	Instant dateTimeStartRaw

	@GraphQLQuery
	@Formula("to_char(date_time_start + '8h','HH12:MIAM')")
	String dateTimeStart

	@GraphQLQuery
	@Column(name = "date_time_end", nullable = false)
	Instant dateTimeEndRaw

	@GraphQLQuery
	@Formula("to_char(date_time_end + '8h','HH12:MIAM')")
	String dateTimeEnd

	@GraphQLQuery
	@Column(name = "meal_break_start", nullable = false)
	Instant mealBreakStart

	@GraphQLQuery
	@Column(name = "meal_break_end", nullable = false)
	Instant mealBreakEnd

	@GraphQLQuery
	@Column(name = "color", nullable = false)
	String color

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "id")
	CompanySettings company

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

}
