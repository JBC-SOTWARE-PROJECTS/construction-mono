package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.types.Subaccountable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "inventory", name = "item_sub_account")
@SQLDelete(sql = "UPDATE inventory.item_sub_account SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ItemSubAccount extends AbstractAuditingEntity implements Serializable, Subaccountable{
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "item_sub_account_code")
	String subAccountCode

	@GraphQLQuery
	@Column(name = "item_sub_account_description")
	@UpperCase
	String subAccountDescription
	
	@GraphQLQuery
	@Column(name = "account_type")
	@UpperCase
	String accountType

	@GraphQLQuery
	@Column(name = "source_column")
	String sourceColumn
	
	@GraphQLQuery
	@Column(name = "is_active")
	Boolean isActive

	@GraphQLQuery
	@Column(name = "is_fixed_asset")
	Boolean isFixedAsset

	@GraphQLQuery
	@Column(name = "is_revenue")
	Boolean isRevenue

	@GraphQLQuery
	@Column(name = "company")
	UUID company

	@Override
	String getCode() {
		return subAccountCode
	}

	@Override
	String getAccountName() {
		return subAccountDescription
	}

	@Override
	String getDomain() {
		return ItemSubAccount.class.name
	}
}
