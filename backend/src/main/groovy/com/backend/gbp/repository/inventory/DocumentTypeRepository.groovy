package com.backend.gbp.repository.inventory

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.inventory.DocumentTypes
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface DocumentTypeRepository extends JpaRepository<DocumentTypes, UUID> {

    @Query(value = "Select d from DocumentTypes d where d.id = :id")
    DocumentTypes getDocTypeById(@Param("id") UUID id)
}
