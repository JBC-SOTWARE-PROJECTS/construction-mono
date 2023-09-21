package com.backend.gbp.config

import com.backend.gbp.graphqlservices.payroll.IPayrollEmployeeBaseOperation
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PayrollConfig {

    @Autowired
    List<IPayrollEmployeeBaseOperation> payrollEmployeeStatusServiceList


    @Bean
    Map<PayrollModule, IPayrollEmployeeBaseOperation> mapPayrollEmployeeStatusService(){
        Set<PayrollModule> foundModules = new HashSet<>()
        payrollEmployeeStatusServiceList.each {
            if(it.payrollModule == null)
                throw new RuntimeException("'payrollModule' property of ${IPayrollEmployeeBaseOperation.class} cannot have a value of 'null'")
            if(!foundModules.add(it.payrollModule)){
                throw new RuntimeException("Found duplicate ${IPayrollEmployeeBaseOperation.class} having a 'payrollModule' property with a value of: ${it.payrollModule.name()}")
            }
        }

        return payrollEmployeeStatusServiceList.collectEntries { [it.payrollModule, it] }
    }
}
