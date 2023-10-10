package com.backend.gbp.rest

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeAttendance
import com.backend.gbp.graphqlservices.hrm.EmployeeAttendanceService
import com.backend.gbp.graphqlservices.hrm.EmployeeFilterService
import com.backend.gbp.rest.dto.EmployeeDto
import groovy.transform.TypeChecked
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@TypeChecked
@RestController
@RequestMapping('/api/employee')
class EmployeeResource {

    @Autowired
    ApplicationContext applicationContext

    @Autowired
    EmployeeFilterService employeeFilterService

    @Autowired
    EmployeeAttendanceService employeeAttendanceService

    @RequestMapping(method = RequestMethod.POST,value = ['/filter'])
    List<EmployeeDto> empFilter() {

        Boolean status = true;
        String  filter = " ";
        UUID office = null;
        UUID position = null

        List<Employee> empFilt = employeeFilterService.employeeByFilter(filter, status, office, position);

        List<EmployeeDto> employeeDtos = new ArrayList<>();

        for (Employee employee : empFilt) {
            EmployeeDto employeeDto = new EmployeeDto();
            BeanUtils.copyProperties(employee, employeeDto); // Or manually set properties
            
            employeeDtos.add(employeeDto);
        }

        return employeeDtos
    }


    @RequestMapping(method = RequestMethod.POST,value = ['/attendance'])
    String employeeAttendance (@RequestParam(name = "employee", required = false) UUID employee){


        EmployeeAttendance empAttendance = new EmployeeAttendance();

        return employee;

    }

    @RequestMapping(method = RequestMethod.POST,value = ['/biometric/registration'])
    String employeeBiometricRegistration (
            @RequestParam(name = "employee") UUID employee,
            @RequestParam(name = "pinCode") String pinCode
    ){


        EmployeeAttendance empAttendance = new EmployeeAttendance();

        return pinCode;

    }




}
