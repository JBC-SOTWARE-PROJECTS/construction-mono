package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(name = "ap_account_templates_items", schema = "accounting")
class ApAccountsTemplateItems extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "accounts_template", referencedColumnName = "id")
	ApAccountsTemplate apAccountsTemplate

	@GraphQLQuery
	@Column(name = "code", columnDefinition = "varchar")
	@UpperCase
	String code

	@GraphQLQuery
	@Column(name = "description", columnDefinition = "varchar")
	@UpperCase
	String desc

	@GraphQLQuery
	@Column(name = "account_type", columnDefinition = "varchar")
	@UpperCase
	String accountType



}

