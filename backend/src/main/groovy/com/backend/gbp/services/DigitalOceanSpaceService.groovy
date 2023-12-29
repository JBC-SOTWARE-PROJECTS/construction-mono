package com.backend.gbp.services

import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.AmazonS3Client
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.s3.model.PutObjectRequest
import org.apache.poi.hpsf.ClassID
import org.apache.poi.sl.usermodel.ObjectMetaData
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service
//import software.amazon.awssdk.core.sync.RequestBody
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;



@Service
public class DigitalOceanSpaceService {

     // Replace with your DigitalOcean Space bucket name

    public void uploadFileToSpace(File fileToUpload) {
//        AwsBasicCredentials awsCreds = AwsBasicCredentials.create("DO0047JFAG3CLJZRYDW6", "ElKj6QSbeYsbMgMi2BVafKxj9JpirQ6wfGdcd0yJtow");

//        S3Client s3Client = S3Client.builder()
//                .region(Region.of("us-east-1"))
//                .credentialsProvider({ -> awsCreds })
//                .endpointOverride("https://megatam.sgp1.digitaloceanspaces.com")
//                .build();

        String accessKey = "DO0047JFAG3CLJZRYDW6";
        String secretKey = "ElKj6QSbeYsbMgMi2BVafKxj9JpirQ6wfGdcd0yJtow";
        String stringObjKeyName = "fileup"

        BasicAWSCredentials creds = new BasicAWSCredentials(accessKey, secretKey);

        AmazonS3 s3Client = (AmazonS3Client) AmazonS3ClientBuilder.standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration("https://megatam.sgp1.digitaloceanspaces.com", "ap-southeast-1"))
                .withCredentials(new AWSStaticCredentialsProvider(creds)).build();

        String bucketName = "megatam-development";

        // Check if the bucket already exists
        if (!s3Client.doesBucketExist(bucketName)) {
            // Create the bucket
            s3Client.createBucket(bucketName);
            System.out.println("Bucket created successfully.");
        } else {
            System.out.println("Bucket already exists.");
        }

        PutObjectRequest request = new PutObjectRequest(bucketName, fileToUpload.getName(), fileToUpload);

        // Upload file to S3
        s3Client.putObject(request);

    }
}
