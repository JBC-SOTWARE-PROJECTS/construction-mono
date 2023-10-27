package com.backend.gbp.repository.hrm

import com.backend.gbp.domain.hrm.Allowance
import com.backend.gbp.domain.hrm.AllowancePackage
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AllowancePackageRepository  extends JpaRepository<AllowancePackage, UUID> {

    @Query(value = """  Select ap from AllowancePackage ap where 
                        lower(ap.name) like lower(concat('%',:filter,'%'))
                    """,
            countQuery = """ 
                        Select count(ap) from AllowancePackage ap where
                        lower(ap.name) like lower(concat('%',:filter,'%'))
""")
    Page<AllowancePackage> getAllowancePackagePageable(@Param("filter") String filter, Pageable pageable)


    @Query(value = "select ap from AllowancePackage ap")
    List<AllowancePackage>fetchAllAllowancePackage()

}