package com.backend.gbp.domain

import com.backend.gbp.domain.annotations.UpperCase
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Formula
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*


@TypeChecked
@Entity
@Table(schema = "public", name = "office")
class Office extends AbstractAuditingEntity {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "id")
	CompanySettings company

	@GraphQLQuery
	@Column(name = "office_code", columnDefinition = "varchar")
	String officeCode

	@GraphQLQuery
	@Column(name = "office_description", columnDefinition = "varchar")
	@UpperCase
	String officeDescription

	@GraphQLQuery
	@Column(name = "office_type", columnDefinition = "varchar")
	String officeType

	@GraphQLQuery
	@Column(name = "tel_no", columnDefinition = "varchar")
	String telNo

	@GraphQLQuery
	@Column(name = "phone_no", columnDefinition = "varchar")
	String phoneNo

	@GraphQLQuery
	@Column(name = "email_add", columnDefinition = "varchar")
	String emailAdd

	@GraphQLQuery
	@Column(name = "office_country", columnDefinition = "varchar")
	String officeCountry

	@GraphQLQuery
	@Column(name = "province_id", columnDefinition = "uuid")
	UUID provinceId

	@GraphQLQuery
	@Column(name = "office_province", columnDefinition = "varchar")
	String officeProvince

	@GraphQLQuery
	@Column(name = "city_id", columnDefinition = "uuid")
	UUID cityId

	@GraphQLQuery
	@Column(name = "office_municipality", columnDefinition = "varchar")
	String officeMunicipality

	@GraphQLQuery
	@Column(name = "office_barangay", columnDefinition = "varchar")
	String officeBarangay

	@GraphQLQuery
	@Column(name = "office_street", columnDefinition = "varchar")
	@UpperCase
	String officeStreet

	@GraphQLQuery
	@Column(name = "office_zipcode", columnDefinition = "varchar")
	String officeZipcode

	@GraphQLQuery
	@Column(name = "tin_number", columnDefinition = "varchar")
	String tinNumber

	@GraphQLQuery
	@Column(name = "office_secretary", columnDefinition = "varchar")
	String officeSecretary

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "bool")
	Boolean status

	@GraphQLQuery
	@Formula("concat(office_street , coalesce(' ' || nullif(office_barangay,'') , ''), coalesce(', ' || nullif(office_municipality,'') , ''), coalesce(', ' || nullif(office_province,'') , ''), coalesce(' ' || nullif(office_country,'') , ''), coalesce(' ' || nullif(office_zipcode,'') , ''))")
	String fullAddress

}
