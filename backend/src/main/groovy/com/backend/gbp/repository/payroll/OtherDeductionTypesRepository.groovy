package com.backend.gbp.repository.payroll


import com.backend.gbp.domain.payroll.OtherDeductionTypes
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface OtherDeductionTypesRepository extends JpaRepository<OtherDeductionTypes, UUID> {


    @Query(value = """ select a from OtherDeductionTypes a where
                       lower(a.name) like lower(concat('%',:filter,'%'))
                    """,
            countQuery = """ select count(a) from  OtherDeductionTypes a where
                             lower(a.name) like lower(concat('%',:filter,'%'))
                    """
    )
    Page<OtherDeductionTypes>getPageable(@Param("filter") String filter, Pageable pageable)
}
