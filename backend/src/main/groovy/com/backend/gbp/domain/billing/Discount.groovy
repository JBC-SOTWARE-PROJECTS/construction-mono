package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.types.Subaccountable
import com.backend.gbp.rest.dto.CoaConfig
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

enum DiscountType {
	CUSTOM,
	FIXED
}

@Entity
@Table(name = "discounts", schema = "billing")
class Discount extends AbstractAuditingEntity implements Subaccountable, Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@UpperCase
	@Column(name = "code", columnDefinition = "varchar")
	String code
	
	@GraphQLQuery
	@UpperCase
	@Column(name = "discount", columnDefinition = "varchar")
	String discount
	
	@GraphQLQuery
	@UpperCase
	@Column(name = "remarks", columnDefinition = "varchar")
	String remarks
	
	@GraphQLQuery
	@Column(name = "value", columnDefinition = "numeric")
	BigDecimal value
	
	@Enumerated(value = EnumType.STRING)
	@Column(name = "type", columnDefinition = "varchar")
	DiscountType type

	@GraphQLQuery
	@Column(name = "from_initial", columnDefinition = "bool")
	Boolean fromInitial


	@GraphQLQuery
	@Column(name = "active", columnDefinition = "bool")
	Boolean active

	@GraphQLQuery
	@Column(name = "include_vat", columnDefinition = "bool")
	Boolean includeVat



	@GraphQLQuery
	@Column(name = "vat", columnDefinition = "bool")
	Boolean vat
	
	@GraphQLQuery
	@Column(name = "validation_source", columnDefinition = "varchar")
	@UpperCase
	String validationSource

	@GraphQLQuery
	@Column(name = "senior_pwd", columnDefinition = "bool")
	Boolean seniorPwd

	@Override
	String getAccountName() {
		return discount
	}

	@Override
	String getDomain() {
		return Discount.class.name
	}

}
