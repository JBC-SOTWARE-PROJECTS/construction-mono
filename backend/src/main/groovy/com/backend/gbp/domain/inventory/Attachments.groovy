package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "inventory", name = "attachments")
@SQLDelete(sql = "UPDATE inventory.attachments SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Attachments extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "reference_id")
	UUID referenceId

	@GraphQLQuery
	@Column(name = "date_transact")
	Instant dateTransact

	@GraphQLQuery
	@Column(name = "folder_name")
	@UpperCase
	String folderName

	@GraphQLQuery
	@Column(name = "file_name")
	@UpperCase
	String fileName

	@GraphQLQuery
	@Column(name = "mimetype")
	String mimetype

	@Transient
	String getImageUrl() {
		return "${folderName}${fileName}";
	}
}
