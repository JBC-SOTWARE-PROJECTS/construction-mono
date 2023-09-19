package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.types.Subaccountable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "inventory", name = "item_categories")
@SQLDelete(sql = "UPDATE inventory.item_categories SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ItemCategory extends AbstractAuditingEntity implements Serializable, Subaccountable{
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fk_item_group", referencedColumnName = "id")
	ItemGroup itemGroup
	
	@GraphQLQuery
	@Column(name = "category_code")
	@UpperCase
	String categoryCode
	
	@GraphQLQuery
	@Column(name = "category_description")
	@UpperCase
	String categoryDescription
	
	@GraphQLQuery
	@Column(name = "is_active")
	Boolean isActive

	@Override
	String getCode() {
		return categoryCode
	}

	@Override
	String getDescription() {
		return categoryDescription
	}

	@Override
	String getDomain() {
		return ItemCategory.class.name
	}
}
