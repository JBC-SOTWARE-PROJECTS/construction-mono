package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(schema = "billing", name = "customer")
@SQLDelete(sql = "UPDATE billing.customer SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Customer extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "fullname")
	String fullName

	@GraphQLQuery
	@Column(name = "customer_type") // 1: Private Entity 2: Government Entity/Agency
	String customerType

	@GraphQLQuery
	@Column(name = "address")
	@UpperCase
	String address

	@GraphQLQuery
	@Column(name = "tel_no")
	String telNo

	@GraphQLQuery
	@Column(name = "email_add")
	String emailAdd

	@GraphQLQuery
	@Column(name = "contact_person")
	@UpperCase
	String contactPerson

	@GraphQLQuery
	@Column(name = "contact_person_num")
	@UpperCase
	String contactPersonNum


}
