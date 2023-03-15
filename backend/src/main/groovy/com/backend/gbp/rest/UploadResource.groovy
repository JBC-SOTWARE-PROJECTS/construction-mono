package com.backend.gbp.rest


import groovy.transform.TypeChecked
import org.hibernate.Hibernate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.transaction.annotation.Transactional
import org.springframework.util.StringUtils
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartRequest

import java.sql.Blob


@TypeChecked
@RestController
class UploadResource {

    @Autowired
    JdbcTemplate jdbcTemplate

    @Autowired
    private Environment env;



    @Transactional
    @RequestMapping(method = RequestMethod.POST, value = "/api/upload-file")
    ResponseEntity<String> attachments(@RequestParam UUID billingId, MultipartRequest request) {

        def attachment = request.getFiles("file")
        println("nisud sa function" + billingId)

        try {

            attachment.forEach { file ->
                MultipartFile f = file

				String filename = StringUtils.cleanPath(f.getOriginalFilename());
				String newFileName = filename.toLowerCase().replaceAll(" ", "-");
                println("File:" + newFileName);
                println("ContentType:" + f.getContentType());

                //update flags

                try {




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