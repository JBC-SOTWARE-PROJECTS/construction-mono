package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.payroll.Payroll
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional

@Transactional(propagation = Propagation.REQUIRED)
interface IPayrollModuleBaseOperations<T> {

    /**
     * Method that will be used to run when the payroll starts and
     * creates all the modules.
     * @param payroll the payroll that has started
     */
    T startPayroll(Payroll payroll)

    /**
     * Method that will be used to run when the payroll is finalized
     * @param payroll the payroll that was finalized
     */
    void finalizePayroll(Payroll payroll)

}