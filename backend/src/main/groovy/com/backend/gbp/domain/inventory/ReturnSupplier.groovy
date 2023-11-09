package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "inventory", name = "return_supplier")
@SQLDelete(sql = "UPDATE inventory.return_supplier SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ReturnSupplier extends AbstractAuditingEntity implements Serializable{
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "rts_no", columnDefinition = 'varchar')
	String rtsNo
	
	@GraphQLQuery
	@Column(name = "return_date", columnDefinition = 'timestamp without time zone')
	Instant returnDate

	@GraphQLQuery
	@Column(name = "ref_srr", columnDefinition = 'varchar')
	String refSrr

	@GraphQLQuery
	@Column(name = "reference_type", columnDefinition = 'varchar')
	String referenceType
	
	@GraphQLQuery
	@Column(name = "received_ref_no", columnDefinition = 'varchar')
	@UpperCase
	String receivedRefNo
	
	@GraphQLQuery
	@Column(name = "received_ref_date", columnDefinition = 'timestamp without time zone')
	Instant receivedRefDate
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "supplier", referencedColumnName = "id")
	Supplier supplier
	
	@GraphQLQuery
	@Column(name = "received_by", columnDefinition = 'varchar')
	@UpperCase
	String received_by

	@GraphQLQuery
	@Column(name = "return_by", columnDefinition = 'varchar')
	@UpperCase
	String returnBy

	@GraphQLQuery
	@Column(name = "return_user", columnDefinition = 'uuid')
	UUID returnUser
	
	@GraphQLQuery
	@Column(name = "is_posted", columnDefinition = 'bool')
	Boolean isPosted
	
	@GraphQLQuery
	@Column(name = "is_void", columnDefinition = 'bool')
	Boolean isVoid
	
}
