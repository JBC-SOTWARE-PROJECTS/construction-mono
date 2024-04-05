package com.backend.gbp.rest

import com.backend.gbp.domain.inventory.Attachments
import com.backend.gbp.domain.projects.ProjectProgressImages
import com.backend.gbp.graphqlservices.address.AddressServices
import com.backend.gbp.graphqlservices.projects.ProjectProgressService
import com.backend.gbp.repository.inventory.AttachmentRepository
import com.backend.gbp.repository.projects.ProjectsProgressImagesRepository
import com.backend.gbp.services.DigitalOceanSpaceService
import com.backend.gbp.services.NotificationService
import com.backend.gbp.socket.SocketService
import com.backend.gbp.utils.SOAPConnector
import com.fasterxml.jackson.databind.ObjectMapper
import com.sun.xml.messaging.saaj.SOAPExceptionImpl
import groovy.transform.Canonical
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.event.EventListener
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import org.springframework.web.context.support.RequestHandledEvent
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartRequest
import ph.gov.doh.uhmistrn.ahsr.webservice.index.GetDataTable
import ph.gov.doh.uhmistrn.ahsr.webservice.index.GetDataTableResponse

import javax.servlet.http.HttpSession
import java.time.Instant

@Canonical
class CitySelect{
    String label
    String value
}

@RestController
class CommonResource {

    @Autowired
    SocketService socketService

    @Autowired
    NotificationService notificationService

    @Autowired
    SOAPConnector soapConnector

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    AddressServices addressServices

    @Autowired
    DigitalOceanSpaceService spaceService;

    @Autowired
    ProjectProgressService projectProgressService;

    @Autowired
    ProjectsProgressImagesRepository progressImagesRepository

    @Autowired
    AttachmentRepository attachmentRepository

    @Autowired
    private Environment env;
    /*
    ANNOTATION_PAYMENTS_GROUPS
    ANNOTATION_NOTIFICATION_GROUPS
    http://localhost:8080/testbillingannotation?billingId=5ab3ea62-5dcb-489c-842a-e5bbfdcf74a1&billingItemType=ANNOTATION_PAYMENTS_GROUPS&description=PAYMENT_OR11211&amount=10000
     */


    @RequestMapping(value = "/soapTest", produces = "text/xml")
    String soapTest() {
        try {
            GetDataTable request = new GetDataTable()
            request.hfhudcode = "DOH000000000000000"
            request.reportingyear = "2020"
            request.table = "genInfoClassification"
            GetDataTableResponse response =
                    (GetDataTableResponse) soapConnector.callWebService("http://uhmistrn.doh.gov.ph/ahsr/webservice/index.php/getDataTable", request)
            println("Got Response As below ========= : ")
            println("Name : " + response.return)

            return response.return
        } catch (SOAPExceptionImpl e) {
            println(e.message)
        }

    }

    @RequestMapping("/ping")
    String ping() {
        "PONG"
    }

    @RequestMapping("/test")
    String test() {

        SecurityContext context = SecurityContextHolder.getContext();
        //Authentication authentication = context.getAuthentication();
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(false)
        println "session "+ session.getId()
        //println "Last Accessed "+ session.getLastAccessedTime()
        //println "Current Time "+ System.currentTimeMillis();
        //session.getLastAccessedTime()
    }

    @RequestMapping("/")
    String index() {
        "WELCOME TO Backend DiverseTrade GraphQL Server."
    }

    String serverTime() {
        System.currentTimeMillis()
    }

    @RequestMapping("/hey")
    String hey() {
        //	HISD3WebsocketMessage message = new HISD3WebsocketMessage()
        //	message.from = "TEST"
        //	message.message = "Pack Yow"
        //	message.type = HISD3MessagewType.TEST_TYPE
        //	socketService.payloadToUser(message, 'admin', '/channel/test')
        notificationService.notifyUser(UUID.fromString("3eec9518-f3b0-41fe-84d2-97a2f30ab83a"), "Sample Title", "Sample Message")
    }

    //THIS FUNCTION IS REQUEST LISTENER, IT DOES LISTEN TO REQUESTS THAT ARE CONSIDERED "USER ACTIVITY" TO MONITOR INACTIVE USERS AND WARN FOR LOGOUT
    @EventListener
    void handleEvent (RequestHandledEvent e) {
        String url = e.getAt("requestUrl").toString()
        Boolean exemptedURL = url.contains("serverTime") || url.contains("favicon") || url.contains("websocket") || url.contains("checkExpiry")

        if(!e.wasFailure() && !exemptedURL){
            //System.out.println("-- RequestHandledEvent --"+SecurityUtils.currentLogin());
            //System.out.println(e.getAt("requestUrl"));
           // userResource.updateLastActivity(SecurityUtils.currentLogin())
           // println "Valid URL : "+e.getAt("requestUrl")
        }
        //else
        //   if(exemptedURL)
        //        println "Exempted URL : "+ url
    }



    @RequestMapping("/user/province")
    List<com.backend.gbp.domain.address.Province> province(@RequestParam("filter") String filter) {
        return addressServices.provincesFilter(filter)
    }

    @RequestMapping("/user/city")
    List<CitySelect> getCities(@RequestParam("province") String province) {
        def city =  addressServices.getCities(province)
        def result = new ArrayList<CitySelect>();
        city.each {
            result.push(new CitySelect(
                    label: it.name.toUpperCase(),
                    value: it.name.toUpperCase()
            ))
        }
        return result
    }

    @Transactional
    @RequestMapping(method = RequestMethod.POST, value = "/project/upload")
    ResponseEntity<String> uploadProjectImages(@RequestParam String id, MultipartRequest request) {
        UUID progressId = UUID.fromString(id)
        def parent = projectProgressService.findOne(progressId)
        def attachments = request.getFiles("file")

        try {
            attachments.forEach { file ->
                MultipartFile f = file
                //convert here
                File convFile = spaceService.convertToFile(f)
                //end convert here
                String saveType = env.getProperty("do.env.type");

                ProjectProgressImages uploadedResult = new ProjectProgressImages()
                uploadedResult.folderName = "${saveType}/PROJECT_IMAGES/${parent.project.id}/"
                uploadedResult.dateTransact = Instant.now()
                uploadedResult.fileName = f.originalFilename
                uploadedResult.mimetype = f.contentType
                uploadedResult.project = parent.project
                uploadedResult.projectProgress = parent
                try {
                    /*** ready for DO S3***/
                    spaceService.uploadFileToSpace(convFile, "PROJECT_IMAGES/${parent.project.id}")
                    progressImagesRepository.save(uploadedResult)
                    spaceService.deleteToFile(convFile)
                } catch (Exception e) {
                    e.printStackTrace()
                    throw e
                }
            }

        } catch (Exception e) {
            e.printStackTrace()
            throw e
        }

        return new ResponseEntity<>(
                "Success Uploading Files",
                HttpStatus.OK)
    }

    @Transactional
    @RequestMapping(method = RequestMethod.POST, value = "/attachment/inventory")
    ResponseEntity<String> uploadAttachmentInventory(@RequestParam String id, MultipartRequest request) {
        UUID referenceId = UUID.fromString(id)
        def attachments = request.getFiles("file")

        try {
            attachments.forEach { file ->
                MultipartFile f = file
                //convert here
                File convFile = spaceService.convertToFile(f)
                //end convert here
                String saveType = env.getProperty("do.env.type");

                Attachments attach = new Attachments()
                attach.folderName = "${saveType}/INVENTORY_ATTACHMENTS/${referenceId}/"
                attach.dateTransact = Instant.now()
                attach.fileName = f.originalFilename
                attach.mimetype = f.contentType
                attach.referenceId = referenceId
                try {
                    /*** ready for DO S3***/
                    spaceService.uploadFileToSpace(convFile, "INVENTORY_ATTACHMENTS/${referenceId}")
                    attachmentRepository.save(attach)
                    spaceService.deleteToFile(convFile)
                } catch (Exception e) {
                    e.printStackTrace()
                    throw e
                }
            }

        } catch (Exception e) {
            e.printStackTrace()
            throw e
        }

        return new ResponseEntity<>(
                "Success Uploading Files",
                HttpStatus.OK)
    }


}
