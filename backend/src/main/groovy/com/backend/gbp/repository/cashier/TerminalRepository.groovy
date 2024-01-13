package com.backend.gbp.repository.cashier


import com.backend.gbp.domain.cashier.Terminal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TerminalRepository extends JpaRepository<Terminal, UUID> {

    @Query(value = "select q from Terminal q where q.employee.id = :id")
    Terminal getTerminalByEmp(@Param('id') UUID id)

    @Query(value = "select q from Terminal q where lower(concat(q.description, q.terminal_no)) like lower(concat('%',:filter,'%')) and q.company = :company")
    List<Terminal> getTerminalFilter(@Param('filter') String filter, @Param('company') UUID company)


}
