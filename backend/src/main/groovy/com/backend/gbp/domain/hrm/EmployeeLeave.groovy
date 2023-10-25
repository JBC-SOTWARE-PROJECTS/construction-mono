package com.backend.gbp.domain.hrm

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.enums.LeaveStatus
import com.backend.gbp.domain.hrm.enums.LeaveType
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

class SelectedDate{
	Instant startDatetime
	Instant endDatetime
}
@Entity
@Table(schema = "hrm", name = "employee_leave")
class EmployeeLeave extends AbstractAuditingEntity {

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
	@Column(name = "reason")
	String reason;

	@Enumerated(EnumType.STRING)
	@Column(name = "leave_type", columnDefinition = "varchar")
	LeaveType type

	@Enumerated(EnumType.STRING)
	@GraphQLQuery
	@Column(name = "status")
	LeaveStatus status;

	@GraphQLQuery
	@Type(type = "jsonb")
	@Column(name="dates",columnDefinition = "jsonb")
	List<SelectedDate> dates

	@Column(name = "with_pay", columnDefinition = "bool")
	Boolean withPay

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "id")
	CompanySettings company

}
