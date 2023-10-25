package com.backend.gbp.repository.hrm


import com.backend.gbp.domain.hrm.Allowance
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AllowanceRepository extends JpaRepository<Allowance, UUID> {


    @Query(value = """ select a from Allowance a where
                       lower(a.name) like lower(concat('%',:filter,'%')) or
                       lower(a.allowanceType) like lower(concat('%',:filter,'%'))
                    """,
            countQuery = """ select count(a) from  Allowance a where
                             lower(a.name) like lower(concat('%',:filter,'%')) or
                            lower(a.allowanceType) like lower(concat('%',:filter,'%'))
                    """
    )
    Page<Allowance>getAllowancePageable(@Param("filter") String filter, Pageable pageable)

    @Query(value = " Select a from Allowance a  ")
    List<Allowance>fetchAllAllowance()

}
