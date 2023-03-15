package com.backend.gbp.domain


import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Formula
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*


@TypeChecked
@Entity
@Table(schema = "public", name = "company")
class CompanySettings implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "com_name", columnDefinition = "varchar")
	String companyName

	@GraphQLQuery
	@Column(name = "vat_rate", columnDefinition = "varchar")
	BigDecimal vatRate

	@GraphQLQuery
	@Column(name = "markup", columnDefinition = "varchar")
	BigDecimal markup

	@GraphQLQuery
	@Column(name = "gov_markup", columnDefinition = "varchar")
	BigDecimal govMarkup

}
