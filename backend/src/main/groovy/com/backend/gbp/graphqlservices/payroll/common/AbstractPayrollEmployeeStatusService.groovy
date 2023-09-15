package com.backend.gbp.graphqlservices.payroll.common

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.common.PayrollEmployeeAuditingEntity
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.security.SecurityUtils

import java.time.Instant

abstract class AbstractPayrollEmployeeStatusService<T extends PayrollEmployeeAuditingEntity> extends AbstractDaoService<T> {

    EmployeeRepository employeeRepository

    AbstractPayrollEmployeeStatusService(Class<T> classType, EmployeeRepository employeeRepository) {
        super(classType)
        this.employeeRepository = employeeRepository
    }


    T updateStatus(UUID id, PayrollEmployeeStatus status) {
        T entity = findOne(id)
        if(entity == null) return null

        entity.status = status
        if (entity.status == PayrollEmployeeStatus.APPROVED || entity.status == PayrollEmployeeStatus.REJECTED || entity.status == PayrollEmployeeStatus.FINALIZED) {
            Employee employee = null

            employeeRepository.findOneByUsername(SecurityUtils.currentLogin()).ifPresent { employee = it }
            if (employee == null) throw new RuntimeException("No approver found.")
            entity.status = status

            if (status == PayrollEmployeeStatus.APPROVED) {
                entity.approvedBy = employee
                entity.approvedDate = Instant.now()
            } else if (status == PayrollEmployeeStatus.REJECTED) {
                entity.rejectedBy = employee
                entity.rejectedDate = Instant.now()
            }else if (status == PayrollEmployeeStatus.FINALIZED ){
                entity.finalizedBy = employee
                entity.finalizedDate = Instant.now()
            }

            // clearing "xxxxBy" and "xxxxDate" to null depending on the new status
            if(status == PayrollEmployeeStatus.REJECTED || status == PayrollEmployeeStatus.FINALIZED|| status == PayrollEmployeeStatus.DRAFT ){
                entity.approvedBy = null
                entity.approvedDate = null
            }
            if(status == PayrollEmployeeStatus.APPROVED || status == PayrollEmployeeStatus.FINALIZED|| status == PayrollEmployeeStatus.DRAFT ) {
                entity.rejectedBy = null
                entity.rejectedDate = null
            }
            if(status == PayrollEmployeeStatus.DRAFT){
                entity.finalizedBy = null
                entity.finalizedDate = null
            }
        }

        return save(entity)
    }

}
