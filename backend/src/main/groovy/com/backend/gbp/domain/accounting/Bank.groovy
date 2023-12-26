package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.types.Subaccountable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(name = "bankaccounts", schema = "accounting")
class Bank extends AbstractAuditingEntity implements Serializable, Subaccountable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "bankaccountid", columnDefinition = "varchar")
	String bankaccountId
	
	@GraphQLQuery
	@Column(name = "bankname", columnDefinition = "varchar")
	@UpperCase
	String bankname
	
	@GraphQLQuery
	@Column(name = "branch", columnDefinition = "varchar")
	@UpperCase
	String branch
	
	@GraphQLQuery
	@Column(name = "bankaddress", columnDefinition = "varchar")
	@UpperCase
	String bankAddress
	
	@GraphQLQuery
	@Column(name = "accountname", columnDefinition = "varchar")
	@UpperCase
	String accountName
	
	@GraphQLQuery
	@Column(name = "accountnumber", columnDefinition = "varchar")
	@UpperCase
	String accountNumber

	@GraphQLQuery
	@Column(name = "acquiring_bank", columnDefinition = "boolean")
	Boolean acquiringBank

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID companyId

	@Override
	String getCode() {
		return bankaccountId
	}

	@Override
	String getAccountName() {
		return bankname
	}

	@Override
	String getDomain() {
		return Bank.class.name
	}

}
