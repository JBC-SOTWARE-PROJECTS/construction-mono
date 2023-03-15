FROM openjdk:8-jdk-alpine
ARG JAR_FILE=build/libs/backend-3.0.91.jar
COPY ${JAR_FILE} app.jar

EXPOSE 5827
ENTRYPOINT ["java","-Djava.awt.headless=true","-jar","/app.jar"]