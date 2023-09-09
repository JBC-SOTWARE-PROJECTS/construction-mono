package com.backend.gbp.domain.payroll.common

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery

import javax.persistence.Column
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.MappedSuperclass

@MappedSuperclass
class PayrollStatusEntity<T> extends AbstractAuditingEntity implements Serializable {
    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "varchar")
    T status

}