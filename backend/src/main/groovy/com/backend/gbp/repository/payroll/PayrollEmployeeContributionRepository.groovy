package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollEmployeeContribution
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollEmployeeContributionDto {
    String getId()

    String getEmployeeName()

    String getDepartment()

    BigDecimal getTotal()
    String getStatus()

    BigDecimal getSssEE()
    BigDecimal getSssER()
    BigDecimal getSssWispEE()
    BigDecimal getSssWispER()
    BigDecimal getSssEETotal()
    BigDecimal getSssERTotal()




    BigDecimal getPhicEE()
    BigDecimal getPhicER()

    BigDecimal getHdmfER()
    BigDecimal getHdmfEE()

    Boolean getIsActiveSSS()
    Boolean getIsActivePHIC()
    Boolean getIsActiveHDMF()



    BigDecimal getBasicSalary()

    PayrollEmployeeContribution getEmployee()
}

interface PayrollEmployeeContributionRepository extends JpaRepository<PayrollEmployeeContribution, UUID> {

    @Query(value = """  
SELECT 
ec.id as id, 
ec.status as status, 
e.fullName as employeeName,  
ec.sssEE as sssEE,
ec.sssER as sssER,
ec.sssWispER as sssWispER,
ec.sssWispEE as sssWispEE,
ec.sssEE + ec.sssWispEE as sssEETotal,
ec.sssER + ec.sssWispER as sssERTotal,
ec.phicEE as phicEE,
ec.phicER as phicER,
ec.hdmfER as hdmfER,
ec.hdmfEE as hdmfEE,
ec.isActiveSSS as isActiveSSS,
ec.isActivePHIC as isActivePHIC,
ec.isActiveHDMF as isActiveHDMF,
ec.basicSalary as basicSalary
FROM PayrollEmployeeContribution ec
LEFT JOIN ec.contribution c  
LEFT JOIN c.payroll p  
LEFT JOIN ec.payrollEmployee pe  
LEFT JOIN pe.employee e  
WHERE 
p.id = :payroll 
and upper(e.fullName) like upper(concat('%',:filter,'%'))
and ec.status in :status
GROUP BY 
ec.id,
ec.sssEE,
ec.sssER, 
ec.sssWispER, 
ec.sssWispEE,
ec.phicEE, 
ec.phicER, 
ec.hdmfER,
ec.hdmfEE,
ec.basicSalary,
ec.status,
ec.isActiveSSS,
ec.isActivePHIC ,
ec.isActiveHDMF ,
e.firstName, e.lastName, e.middleName, e.nameSuffix
ORDER BY e.fullName
""",
            countQuery = """
SELECT COUNT(DISTINCT ec.id) 
FROM PayrollEmployeeContribution ec
LEFT JOIN ec.contribution c  
LEFT JOIN c.payroll p  
LEFT JOIN ec.payrollEmployee pe  
LEFT JOIN pe.employee e  
WHERE 
p.id = :payroll 
and upper(e.fullName) like upper(concat('%',:filter,'%'))
and ec.status in :status
GROUP BY ec.id
               """)
    Page<PayrollEmployeeContributionDto> findAllByPayroll(
            @Param("payroll") UUID payroll,
            @Param("filter") String filter,
            @Param("status") List<PayrollEmployeeStatus> status,
            Pageable pageable)

}



