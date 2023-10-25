package com.backend.gbp.repository.hrm



import com.backend.gbp.domain.hrm.AllowanceItem
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AllowanceItemRepository extends JpaRepository<AllowanceItem, UUID> {

    @Query(value = """   select ai from AllowanceItem ai where 
                        lower(ai.name) like lower(concat('%',:filter,'%'))
                   """,
            countQuery = """ select count(ai) from AllowanceItem ai where
                    lower(ai.name) like lower(concat('%',:filter,'%'))
    """)
    Page<AllowanceItem> getAllowanceItemPageable(@Param("filter") String filter, Pageable pageable)


    @Query(value = """   SELECT ai FROM AllowanceItem ai WHERE ai.allowancePackage.id = :allowancePackage
                           AND lower(ai.name) like lower(concat('%',:filter,'%'))                          
                    """,
            countQuery = """  SELECT COUNT(ai) FROM AllowanceItem ai WHERE ai.allowancePackage.id = :allowancePackage
                        AND lower(ai.name) like lower(concat('%',:filter,'%'))                 
                    """)
    Page<AllowanceItem> getAllowanceItemByPackagePageable(@Param("allowancePackage") UUID allowancePackage, @Param("filter") String filter, Pageable pageable)

    @Query(value = """  Select ai from AllowanceItem ai where ai.allowanceType.id = :allowanceId """)
    List<AllowanceItem> getAllowanceId (@Param("allowanceId") UUID allowanceId)

    @Query(value = """  Select ai from AllowanceItem ai where ai.allowancePackage.id = :packageId """)
    List<AllowanceItem> getByPackage (@Param("packageId") UUID packageId)
}
