package com.backend.gbp.rest

import com.amazonaws.AmazonClientException
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
import com.backend.gbp.services.DigitalOceanSpaceService
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartHttpServletRequest
//import org.xmlsoap.schemas.soap.encoding.Array
//import com.digitalocean.spaces.SpacesClient
//import com.digitalocean.spaces.model.ObjectWriteResponse

import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.text.SimpleDateFormat
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

    @Autowired
    DigitalOceanSpaceService spaceService;

    @Autowired
    private Environment env;



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


        String attType = (String) fieldMap.get("type");
        String attTime = (String) fieldMap.get("attendance_time");
        //String employeeId = (String) fieldMap.get("employee_id");

        if(attType.equals("OUT")){
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date dateAtt = sdf.parse(attTime);

            List<EmployeeAttendance>   employeeAttendance = employeeAttendanceService.getAttTypeByDate(employee, Instant.parse(attTime),attType);

            if(employeeAttendance.size() > 0) {
                for (EmployeeAttendance ea : employeeAttendance){
                    String fieldsToIgnore = "{\"isIgnored\": \"true\"}";
                    Map<String, Object> fieldMapToIgnore = objectMapper.readValue(fieldsToIgnore, Map.class);
                    GraphQLResVal<EmployeeAttendance> toIgnore = employeeAttendanceService.upsertEmployeeAttendance(ea.id, ea.employee.id, ea.project ? ea.project.id : null ,fieldMapToIgnore ,null);
                }
            }


        }


        projectId = projectId.equals("") ? null : projectId;

        GraphQLResVal<EmployeeAttendance> empAttendance = employeeAttendanceService.upsertEmployeeAttendance(null, employee, projectId,fieldMap,null );


        return empAttendance.returnId;

    }

    @RequestMapping(method = RequestMethod.POST,value = ['/attendance/capture'])
    String uploadCaptureAttendance (
            @RequestPart("file") MultipartFile capture
    ){

        File file = convertMultipartFileToFile(capture);
        //  MultipartFile file = request.getFile("image");
      spaceService.uploadFileToSpace(file, "ATTENDANCE_CAPTURE");
      return "File uploaded successfully!";

    }

    @RequestMapping(method = RequestMethod.POST,value = ['/attendance/sync/capture'])
    String uploadSyncCaptureAttendance (
            @RequestParam("files") MultipartFile[] capture
    ){
        //return "true";
        try {
            ArrayList<File> files = new ArrayList<>();
            for (MultipartFile capt: capture){
                File file = convertMultipartFileToFile(capt);
               // spaceService.uploadFileToSpace(file, "ATTENDANCE_CAPTURE");
                files.add(file);
            }

            //  MultipartFile file = request.getFile("image");
           // spaceService.uploadMultiFileToSpace(files, "ATTENDANCE_CAPTURE/");
            spaceService.uploadMultiFileToSpace(files, env.getProperty("do.env.type")+"/ATTENDANCE_CAPTURE/");
           return "true";
        } catch (InterruptedException e) {
            e.printStackTrace();
            return "false";
        }


    }

    private File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        File file = new File(System.getProperty("java.io.tmpdir") + File.separator + multipartFile.getOriginalFilename());
        multipartFile.transferTo(file);
        return file;
    }

    @RequestMapping(method = RequestMethod.POST,value = ['/attendance/sync'])
    List<EmployeeAttendanceDto> employeeSyncAttendance (
            @RequestParam(name = "fields") String attendanceList
    ){
        ObjectMapper objectMapper = new ObjectMapper();
        List<EmployeeAttendanceDto> reqEmpAttObj = objectMapper.readValue(attendanceList, new TypeReference<List<EmployeeAttendanceDto>>() {});


        ArrayList<EmployeeAttendance> empAttendance = new ArrayList<>();
        for (EmployeeAttendanceDto reAtt : reqEmpAttObj){

            // Check if naay prev
//            if(reAtt.type.equals("OUT")){
//                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//                Date dateAtt = sdf.parse(reAtt.attendance_time);
//
//                List<EmployeeAttendance>   employeeAttendance = employeeAttendanceService.getAttTypeByDate(reAtt.employee, Instant.parse(reAtt.attendance_time),reAtt.type);
//
//                if( employeeAttendance != null && employeeAttendance.size() > 0) {
//                    for (EmployeeAttendance ea : employeeAttendance){
//                        String fieldsToIgnore = "{\"isIgnored\": \"true\"}";
//                        Map<String, Object> fieldMapToIgnore = objectMapper.readValue(fieldsToIgnore, Map.class);
//                        GraphQLResVal<EmployeeAttendance> toIgnore = employeeAttendanceService.upsertEmployeeAttendance(ea.id, ea.employee.id, ea.project ? ea.project.id : null ,fieldMapToIgnore );
//
//                    }
//                }
//
//
//            }
            // Check if naay prev

            EmployeeAttendance attendance = new EmployeeAttendance();
            Employee selectedEmployee = employeeRepository.findById(reAtt.employee).get();

            DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
            Instant attTime = Instant.from(formatter.parse(reAtt.attendance_time));

            attendance.employee = selectedEmployee;
            attendance.attendance_time = attTime;
            attendance.original_attendance_time = attTime;
            attendance.type = reAtt.type;
            attendance.originalType = reAtt.type;

           // attendance.project = projectService.findOne(reAtt.project);
            attendance.additionalNote = reAtt.additionalNote;
            attendance.referenceId = reAtt.referenceId;
            attendance.cameraCapture = reAtt.cameraCapture;

            if(reAtt.project.equals("") || reAtt.project == null){
                attendance.project = null;
            }else{
                attendance.project = projectService.findOne(reAtt.project);
            }


            empAttendance.add(attendance);

        }

        List<EmployeeAttendance>  savedAttendances = employeeAttendanceService.syncAttendance((List<EmployeeAttendance>) empAttendance);
        savedAttendances.addAll(savedAttendances);
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
                  //  upsertResult = employeeService.upsertEmployee(employee, fieldMap, null, null, office, position, company);
                    upsertResult = employeeService.upsertMobileData(employee, fieldMap);

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
               // upsertResult = employeeService.upsertEmployee(employee, fieldMap, null, null, office, position, company);
                upsertResult = employeeService.upsertMobileData(employee, fieldMap);


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
