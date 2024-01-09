package com.backend.gbp.graphqlservices.payroll.common

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.common.PayrollAuditingEntity
import com.backend.gbp.domain.payroll.enums.PayrollStatus
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.security.SecurityUtils

import java.time.Instant

abstract class AbstractPayrollStatusService<T extends PayrollAuditingEntity> extends AbstractDaoService<T> {

    EmployeeRepository employeeRepository

    AbstractPayrollStatusService(Class<T> classType, EmployeeRepository employeeRepository) {
        super(classType)
        this.employeeRepository = employeeRepository
    }

    T updateStatus(UUID id, PayrollStatus status) {
        T entity = findOne(id)
        entity.status = status
        if (entity.status == PayrollStatus.FINALIZED) {
            Employee employee = null

            employeeRepository.findOneByUsername(SecurityUtils.currentLogin()).ifPresent { employee = it }
            if (employee == null) throw new RuntimeException("No approver found.")

            entity.finalizedBy = employee
            entity.finalizedDate = Instant.now()
        } else {
            entity.finalizedBy = null
            entity.finalizedDate = null
        }

        return save(entity)
    }

}
