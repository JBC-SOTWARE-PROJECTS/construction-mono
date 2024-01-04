package com.backend.gbp.services

import com.amazonaws.AmazonClientException
import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.AmazonS3Client
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.s3.model.PutObjectRequest
import com.amazonaws.services.s3.transfer.TransferManager
import com.amazonaws.services.s3.transfer.TransferManagerBuilder
import com.amazonaws.services.s3.transfer.Upload
import org.apache.poi.hpsf.ClassID
import org.apache.poi.sl.usermodel.ObjectMetaData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service
//import software.amazon.awssdk.core.sync.RequestBody
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;



@Service
public class DigitalOceanSpaceService {

    @Autowired
    private Environment env;


    public void uploadFileToSpace(File fileToUpload, String folderPath) {

        String accessKey = env.getProperty("do.accessKey");
        String secretKey = env.getProperty("do.secretKey");

        BasicAWSCredentials creds = new BasicAWSCredentials(accessKey, secretKey);

        AmazonS3 s3Client = (AmazonS3Client) AmazonS3ClientBuilder.standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(env.getProperty("do.endpoint")+folderPath, env.getProperty("do.region")))
                .withCredentials(new AWSStaticCredentialsProvider(creds)).build();

        String bucketName = env.getProperty("do.bucketname");

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

    public void uploadMultiFileToSpace(List<File> filesToUpload, String folderPath) {

        String accessKey = env.getProperty("do.accessKey");
        String secretKey = env.getProperty("do.secretKey");

        BasicAWSCredentials creds = new BasicAWSCredentials(accessKey, secretKey);

        AmazonS3 s3Client = (AmazonS3Client) AmazonS3ClientBuilder.standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(env.getProperty("do.endpoint")+folderPath, env.getProperty("do.region")))
                .withCredentials(new AWSStaticCredentialsProvider(creds)).build();

        String bucketName = env.getProperty("do.bucketname");

        TransferManager transferManager = TransferManagerBuilder.standard()
                .withS3Client(s3Client)
                .build();

        List<Upload> uploadList = new ArrayList<>();
        for (File ftp : filesToUpload) {

            try {
                Upload upload = transferManager.upload(bucketName, ftp.getName(), ftp);
                uploadList.add(upload);
            } catch (AmazonClientException e) {
                e.printStackTrace();
            }
        }

        // Wait for all uploads to complete
        for (Upload upload : uploadList) {
            try {
                upload.waitForCompletion();
                System.out.println("Upload completed");
            } catch (AmazonClientException | InterruptedException e) {
                e.printStackTrace();
            }
        }

        // Shutdown TransferManager when done
        transferManager.shutdownNow();

    }
}
