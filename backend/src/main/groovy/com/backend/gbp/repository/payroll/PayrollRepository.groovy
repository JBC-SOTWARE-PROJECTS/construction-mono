package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.Payroll
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollRepository extends JpaRepository<Payroll, UUID> {


    @Query(value = "select p from Payroll p where (lower(p.title) like lower(concat('%',:filter,'%')))",
            countQuery = "select count(p) from Payroll p where (lower(p.title) like lower(concat('%',:filter,'%')))")
    Page<Payroll> getPayrollByFilterPageable(@Param("filter") String filter, Pageable pageable)

//    @Query(value = "select p from Payroll p where (lower(p.title) like lower(concat('%',:filter,'%')))",
//            countQuery = "select count(p) from Payroll p where (lower(p.title) like lower(concat('%',:filter,'%')))")
//    Page<Payroll> getPayroll(@Param("filter") String filter, Pageable pageable)
//
    @Query(value = "select p from Payroll p left join fetch p.payrollEmployees pe where p.id = :id")
    Optional<Payroll> findByIdJoinFetchPayrollEmployees(@Param("id")UUID id)

    @Query(value = "select p from Payroll p where p.id= :id ")
    Payroll getPayrollById(@Param("id") UUID id)
//
//    @Query(value = "select p from Payroll p left join fetch p.adjustment where p.id = :id")
//    Optional<Payroll> getPayrollWithAdjustment(@Param("id")UUID id)

}
