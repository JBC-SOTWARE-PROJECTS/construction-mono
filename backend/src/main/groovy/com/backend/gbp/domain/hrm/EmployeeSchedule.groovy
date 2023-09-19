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
@Table(schema = "hrm", name = "employee_schedule")
class EmployeeSchedule extends AbstractAuditingEntity {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee", referencedColumnName = "id", nullable = false)
	Employee employee;

	@GraphQLQuery
	@Column(name = "date_time_start")
	Instant dateTimeStart;

	@GraphQLQuery
	@Column(name = "date_time_end")
	Instant dateTimeEnd;

	@GraphQLQuery
	@Column(name = "is_rest_day")
	Boolean isRestDay;

	@GraphQLQuery
	@Column(name = "is_overtime")
	Boolean isOvertime;

	@GraphQLQuery
	@Column(name = "deleted")
	Boolean deleted;

	@GraphQLQuery
	@Column(name = "meal_break_start")
	Instant mealBreakStart;

	@GraphQLQuery
	@Column(name = "meal_break_end")
	Instant mealBreakEnd;

	@GraphQLQuery
	@Column(name = "label", length = 255)
	String label;

	@GraphQLQuery
	@Column(name = "title", length = 255)
	String title;

	@GraphQLQuery
	@Column(name = "locked")
	Boolean locked;

	@GraphQLQuery
	@Column(name = "color", length = 255, nullable = false)
	String color;

	@GraphQLQuery
	@Column(name = "is_custom")
	Boolean isCustom;

	@GraphQLQuery
	@Column(name = "is_leave")
	Boolean isLeave;

	@GraphQLQuery
	@Column(name = "request", columnDefinition = "uuid")
	UUID request;

	@GraphQLQuery
	@Column(name = "with_pay", nullable = false)
	Boolean withPay = true;

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "id")
	CompanySettings company

	@GraphQLQuery
	@Column(name = "schedule_date", columnDefinition = "varchar")
	String dateString

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

}
