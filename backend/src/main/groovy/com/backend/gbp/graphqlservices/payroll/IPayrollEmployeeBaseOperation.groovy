package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.common.PayrollEmployeeAuditingEntity
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal

interface IPayrollEmployeeBaseOperation<T extends PayrollEmployeeAuditingEntity> {

    PayrollModule getPayrollModule()

    /**
     * This method will update the status of the payroll employee. This will be used
     * for GraphQLMutations in {@link PayrollEmployeeService}
     * @param id
     * @param status
     * @return
     */
    GraphQLResVal<T> updateEmployeeStatus(UUID id, PayrollEmployeeStatus status)

    /**
     * This method is used when we are adding payrollEmployee
     * from payroll when payroll has already started or
     * has the status of {@code ACTIVE}
     * @param payrollEmployee payrollEmployee that we want to add
     * @param payroll payroll entity.
     */
    T addEmployee(PayrollEmployee payrollEmployee, Payroll payroll)

    /**
     * This method is used when we are removing payrollEmployee
     * from payroll when payroll has already started or
     * has the status of {@code ACTIVE}
     * @param payrollEmployee payrollEmployee that we want to remove
     * @param payroll payroll entity.
     */
    void removeEmployee(PayrollEmployee payrollEmployee, Payroll payroll)

    /**
     * The same operation as {@link #addEmployee addEmployee}
     * but accepts {@code List<Employee>} as argument.
     * @param payrollEmployees List of payrollEmployees that you want to add.
     * @param payroll payroll entity.
     */
    List<T> addEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll)

    /**
     * The same operation as {@link #removeEmployee removeEmployee}
     * but accepts {@code List<Employee>} as argument.
     * @param payrollEmployees List of payrollEmployees that you want to add.
     * @param payroll payroll entity.
     */
    void removeEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll)

    /**
     * Used for recalculating payrollEmployee from the module's calculation when
     * payroll module was first created
     * @param payrollEmployee payrollEmployee that you want to recalculate
     * @param payroll payroll entity.
     */
    T recalculateEmployee(PayrollEmployee payrollEmployee, Payroll payroll)

    /**
     * The same operation as {@link #recalculateEmployee recalculateEmployee}
     * but recalculates all of employees in the payroll module.
     * @param payroll payroll entity.
     */
    void recalculateAllEmployee(Payroll payroll)

}