package com.backend.gbp.rest


import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.assets.VehicleUsageDocs
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeAttendance
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.graphqlservices.assets.VehicleUsageDocsService
import com.backend.gbp.graphqlservices.hrm.EmployeeAttendanceService
import com.backend.gbp.graphqlservices.hrm.EmployeeFilterService
import com.backend.gbp.graphqlservices.hrm.EmployeeService
import com.backend.gbp.graphqlservices.projects.ProjectService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
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
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

//import com.digitalocean.spaces.SpacesClient
//import com.digitalocean.spaces.model.ObjectWriteResponse

import java.time.Instant
import java.time.format.DateTimeFormatter

@TypeChecked
@RestController
@RequestMapping('/api/asset')
class AssetResource {

    @Autowired
    DigitalOceanSpaceService spaceService;

    @Autowired
    private Environment env;

    @Autowired
    VehicleUsageDocsService vehicleUsageDocsService


    @RequestMapping(method = RequestMethod.POST, value = ['/vehicle-usage-docs/upload'])
    String uploadVehicleUsageDocs(
            @RequestPart("file") MultipartFile capture,
            @RequestPart("fields") String fields
    ) {



        File file = convertMultipartFileToFile(capture);
        spaceService.uploadFileToSpace(file, env.getProperty("do.env.type") + "/VEHICLE_USAGE_DOCS/");

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> fieldMap = objectMapper.readValue(fields, Map.class);
        fieldMap.put("file", file.getName());
        VehicleUsageDocs vehicleUsageDocResult = vehicleUsageDocsService.upsertVehicleUsageDocs(fieldMap,null );

        return vehicleUsageDocResult.id;

    }

//    @RequestMapping(method = RequestMethod.POST, value = ['/attendance/sync/capture'])
//    String uploadSyncCaptureAttendance(
//            @RequestParam("files") MultipartFile[] capture
//    ) {
//        //return "true";
//        try {
//            ArrayList<File> files = new ArrayList<>();
//            for (MultipartFile capt : capture) {
//                File file = convertMultipartFileToFile(capt);
//                files.add(file);
//            }
//
//            //  MultipartFile file = request.getFile("image");
//            spaceService.uploadMultiFileToSpace(files, env.getProperty("do.env.type") + "/ATTENDANCE_CAPTURE/");
//            return "true";
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//            return "false";
//        }
//
//
//    }
//
    private File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        File file = new File(System.getProperty("java.io.tmpdir") + File.separator + multipartFile.getOriginalFilename());
        multipartFile.transferTo(file);
        return file;
    }
}



