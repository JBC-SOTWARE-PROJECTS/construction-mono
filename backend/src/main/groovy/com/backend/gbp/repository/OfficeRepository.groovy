package com.backend.gbp.repository


import com.backend.gbp.domain.Office
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface OfficeRepository extends JpaRepository<Office, UUID> {

	@Query(
			value = '''Select o from Office o where (lower(o.officeCode) like lower(concat('%',:filter,'%')) or 
						lower(o.officeDescription) like lower(concat('%',:filter,'%')))'''
	)
	List<Office> officeListByFilter(@Param("filter") String filter)

	@Query(
			value = '''Select o from Office o where (lower(o.officeCode) like lower(concat('%',:filter,'%')) or 
						lower(o.officeDescription) like lower(concat('%',:filter,'%'))) and o.status = :status'''
	)
	List<Office> officeListByFilterStatus(@Param("filter") String filter, @Param("status") Boolean status)

	@Query(
			value = '''Select o from Office o where o.status = true'''
	)
	List<Office> activeOffices()

	@Query(
			value = '''Select o from Office o where (lower(o.officeCode) like lower(concat('%',:filter,'%')) or 
						lower(o.officeDescription) like lower(concat('%',:filter,'%')))''',
			countQuery = '''Select count(o) from Office o where (lower(o.officeCode) like lower(concat('%',:filter,'%')) or 
						lower(o.officeDescription) like lower(concat('%',:filter,'%')))'''
	)
	Page<Office> officePage(@Param("filter") String filter, Pageable pageable)

	@Query(
			value = '''Select o from Office o where (lower(o.officeCode) like lower(concat('%',:filter,'%')) or 
						lower(o.officeDescription) like lower(concat('%',:filter,'%'))) and o.company.id = :company''',
			countQuery = '''Select count(o) from Office o where (lower(o.officeCode) like lower(concat('%',:filter,'%')) or 
						lower(o.officeDescription) like lower(concat('%',:filter,'%'))) and o.company.id = :company'''
	)
	Page<Office> officeCompanyPage(@Param("filter") String filter,@Param("company") UUID company, Pageable pageable)

}
