package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.ArCustomers
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.hrm.Employee
import com.sun.org.apache.xpath.internal.operations.Bool
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Formula
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.time.Instant


@Canonical
class Endorsement {
	Boolean fieldFindings
	Boolean shopFindings
	String fuelGauge
	String aircon
	String lighter
	String lighterPcs
	String headrest
	String headrestPcs
	String horn
	Boolean wiperRH
	Boolean wiperLH
	Boolean windShieldFront
	Boolean windShieldRear
	Boolean runningBoardRH
	Boolean runningBoardLH
	String spareTire
	String hoodStand
	String oilCap
	String engineOilFilter
	Boolean headlightLH
	Boolean headlightRH
	Boolean carkey
	String carStereo
	String sunVisor
	String sunVisorPcs
	String domeLight
	Boolean sideMirrorRH
	Boolean sideMirrorLH
	Boolean logoFront
	Boolean logoRear
	Boolean windowsRH
	Boolean windowsLH
	String antenna
	String jack
	String radiator
	String dipStick
	String speaker
	String speakerPcs
	String rearViewMirror
	String registrationPapers
	Boolean hubCupRHft
	Boolean hubCupRHRr
	Boolean hubCupLHft
	Boolean hubCupLHRr
	Boolean plateNumberFront
	Boolean plateNumberRear
	Boolean bumperFront
	Boolean bumperRear
	Boolean mudGuardRHft
	Boolean mudGuardRHRr
	Boolean mudGuardLHft
	Boolean mudGuardLHRr
	String tieWrench
	String washerTank
	String clutchCap
	String breakMaster
	Boolean tailLightRH
	Boolean tailLightLH
}

@Entity
@Table(schema = "billing", name = "jobs")
@SQLDelete(sql = "UPDATE billing.jobs SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Job extends AbstractAuditingEntity implements Serializable{

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "date_trans")
	Instant dateTrans

	@GraphQLQuery
	@Column(name = "deadline")
	Instant deadline

	@GraphQLQuery
	@Column(name = "job_no")
	String jobNo

	@GraphQLQuery
	@Column(name = "job_description")
	@UpperCase
	String description

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer", referencedColumnName = "id")
	ArCustomers customer

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "repair", referencedColumnName = "id")
	RepairType repair

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "insurance", referencedColumnName = "id")
	Insurances insurance

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office

	@GraphQLQuery
	@Column(name = "plate_no")
	String plateNo

	@GraphQLQuery
	@Column(name = "engine_no")
	String engineNo

	@GraphQLQuery
	@Column(name = "chassis_no")
	String chassisNo

	@GraphQLQuery
	@Column(name = "body_no")
	String bodyNo

	@GraphQLQuery
	@Column(name = "year_model")
	String yearModel

	@GraphQLQuery
	@Column(name = "body_color")
	String bodyColor

	@GraphQLQuery
	@Column(name = "series")
	String series

	@GraphQLQuery
	@Column(name = "make")
	String make

	@GraphQLQuery
	@Column(name = "remarks")
	String remarks

	@GraphQLQuery
	@Column(name = "status")
	String status

	@GraphQLQuery
	@Column(name = "odometer_reading")
	String odometerReading

	@GraphQLQuery
	@Column(name = "customer_complain")
	String customerComplain

	@GraphQLQuery
	@Column(name = "repair_history")
	String repairHistory

	@GraphQLQuery
	@Type(type = "jsonb")
	@Column(name="endorsement",columnDefinition = "jsonb")
	Endorsement endorsement

	@GraphQLQuery
	@Column(name = "other_findings")
	String otherFindings

	@GraphQLQuery
	@Column(name = "date_realesed")
	Instant dateReleased

	@GraphQLQuery
	@Column(name = "pending")
	Boolean pending

	@GraphQLQuery
	@Column(name = "completed")
	Boolean completed

	@GraphQLQuery
	@Column(name = "billed")
	Boolean billed

	@GraphQLQuery
	@Formula("(Select sum(COALESCE(ji.total_cost,0)) from billing.job_items ji where ji.job=id and (ji.deleted is null or ji.deleted = false))")
	BigDecimal totalCost


}
