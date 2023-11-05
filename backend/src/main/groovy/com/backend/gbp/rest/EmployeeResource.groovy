package com.backend.gbp.rest

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeAttendance
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.graphqlservices.hrm.EmployeeAttendanceService
import com.backend.gbp.graphqlservices.hrm.EmployeeFilterService
import com.backend.gbp.graphqlservices.hrm.EmployeeService
import com.backend.gbp.graphqlservices.projects.ProjectService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.rest.dto.EmployeeAttendanceDto
import com.backend.gbp.rest.dto.EmployeeDto
import com.backend.gbp.rest.dto.mobile.EmployeeDetailsDto
import com.backend.gbp.rest.dto.mobile.MobileInitializerDto
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.xmlsoap.schemas.soap.encoding.Array

import java.time.Instant
import java.time.format.DateTimeFormatter

@TypeChecked
@RestController
@RequestMapping('/api/employee')
class EmployeeResource {

    @Autowired
    ApplicationContext applicationContext

    @Autowired
    EmployeeFilterService employeeFilterService

    @Autowired
    EmployeeService employeeService

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    EmployeeAttendanceService employeeAttendanceService

    @Autowired
    ProjectService projectService

    @Autowired
    CompanySettingsService companySettingsService


    @RequestMapping(method = RequestMethod.POST,value = ['/filter'])
    MobileInitializerDto empFilter() {

        Boolean status = true;
        String  filter = " ";
        UUID office = null;
        UUID position = null;
        List<Projects> allProjects = projectService.projectList();
        List<Employee> empFilt = employeeFilterService.employeeByFilter(filter, status, office, position);
        List<CompanySettings> companies = companySettingsService.companyList("");

        List<EmployeeDetailsDto> employeeDetailsDtos = new ArrayList<>();

        for (Employee employee : empFilt) {
            EmployeeDetailsDto employeeDetailsDto = new EmployeeDetailsDto(
                    employee.id,
                    employee.currentCompany.id,
                    employee.currentCompany.companyName,
                    employee.office.id,
                    employee.position.id,
                    employee.office.officeDescription,
                    employee.position.description,
                    employee.firstName,
                    employee.lastName,
                    employee.employeeType,
                    employee.pinCode,
                    employee.facialData
            );

            employeeDetailsDtos.add(employeeDetailsDto);
        }


        MobileInitializerDto mobileInitializerDto = new MobileInitializerDto();
        mobileInitializerDto.companies = companies;
        mobileInitializerDto.employees = employeeDetailsDtos;
        mobileInitializerDto.projects = allProjects;

        return mobileInitializerDto;
    }


    @RequestMapping(method = RequestMethod.POST,value = ['/attendance'])
    String employeeAttendance (
            @RequestParam(name = "employee") UUID employee,
            @RequestParam(name = "projectId") UUID projectId,
            @RequestParam(name = "fields") String fields
    ){

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> fieldMap = objectMapper.readValue(fields, Map.class);

        GraphQLResVal<EmployeeAttendance> empAttendance = employeeAttendanceService.upsertEmployeeAttendance(null, employee, projectId,fieldMap );


        return empAttendance.returnId;

    }

    @RequestMapping(method = RequestMethod.POST,value = ['/attendance/sync'])
    List<EmployeeAttendanceDto> employeeSyncAttendance (
            @RequestParam(name = "fields") String attendanceList
    ){
        ObjectMapper objectMapper = new ObjectMapper();
        List<EmployeeAttendanceDto> reqEmpAttObj = objectMapper.readValue(attendanceList, new TypeReference<List<EmployeeAttendanceDto>>() {});

        ArrayList<EmployeeAttendance> empAttendance = new ArrayList<>();

        for (EmployeeAttendanceDto reAtt : reqEmpAttObj){

            EmployeeAttendance attendance = new EmployeeAttendance();
            Employee selectedEmployee = employeeRepository.findById(reAtt.employee).get();

            DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
            Instant attTime = Instant.from(formatter.parse(reAtt.attendance_time));

            attendance.employee = selectedEmployee;
            attendance.attendance_time = attTime;
            attendance.original_attendance_time = attTime;
            attendance.type = reAtt.type;
            attendance.originalType = reAtt.type;
            attendance.project = projectService.findOne(reAtt.project);
            attendance.additionalNote = reAtt.additionalNote;
            attendance.referenceId = reAtt.referenceId;

            empAttendance.add(attendance);

        }

        List<EmployeeAttendance> savedAttendances = employeeAttendanceService.syncAttendance((List<EmployeeAttendance>) empAttendance);

        ArrayList<EmployeeAttendanceDto> employeeAttendanceDtos= new ArrayList<>();

        for(EmployeeAttendance savedAttendance : savedAttendances){
            EmployeeAttendanceDto employeeAttendanceDto = new EmployeeAttendanceDto();
            employeeAttendanceDto.id = savedAttendance.id;
            employeeAttendanceDto.referenceId = savedAttendance.referenceId;
            employeeAttendanceDtos.add(employeeAttendanceDto);
        }


        return employeeAttendanceDtos;

    }

    @RequestMapping(method = RequestMethod.POST,value = ['/filter/bypc'])
    EmployeeDto getEmployeeByPinCode (@RequestParam(name = "pinCode") String pinCode){

        EmployeeDto employeeDto = new EmployeeDto();
        Employee employee =  employeeService.findByPinCode(pinCode);

        BeanUtils.copyProperties(employee, employeeDto);

        return employeeDto;

    }

    @RequestMapping(method = RequestMethod.POST,value = ['/biometric/registration'])
    ResponseEntity<EmployeeDetailsDto> employeeBiometricRegistration (
            @RequestParam(name = "employee") UUID employee,
            @RequestParam(name = "pinCode") String pinCode,
            @RequestParam(name = "office") UUID office,
            @RequestParam(name = "position") UUID position,
            @RequestParam(name = "company") UUID company,
            @RequestParam(name = "fields") String fields
    ){
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> fieldMap = objectMapper.readValue(fields, Map.class);

        Employee upsertResult = new Employee();
        EmployeeDetailsDto employeeDetailsDto = new EmployeeDetailsDto();

        try {
            if(pinCode != ""){
                // Check for existing pin code
                Boolean isPinCodeUnique = employeeService.isPinCodeUnique(pinCode);
                if(isPinCodeUnique){
                    upsertResult = employeeService.upsertEmployee(employee, fieldMap, null, null, office, position, company);

                    employeeDetailsDto.pinCode = upsertResult.pinCode;
                    employeeDetailsDto.id = upsertResult.id;

                    return new ResponseEntity<>(
                            employeeDetailsDto,
                            HttpStatus.OK);
                }else{

                    return new ResponseEntity<>(
                            employeeDetailsDto,
                            HttpStatus.CONFLICT)
                }
            }else{
                upsertResult = employeeService.upsertEmployee(employee, fieldMap, null, null, office, position, company);


                employeeDetailsDto.facialData = upsertResult.facialData;
                employeeDetailsDto.id = upsertResult.id;

                return new ResponseEntity<>(
                        employeeDetailsDto,
                        HttpStatus.OK);
            }
        }catch(Exception e){
            return new ResponseEntity<>(
                    employeeDetailsDto,
                    HttpStatus.EXPECTATION_FAILED);
        }


    }
}
