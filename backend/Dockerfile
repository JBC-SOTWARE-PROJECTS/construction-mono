#FROM openjdk:8-jdk-alpine
#ARG JAR_FILE=build/libs/backend-3.0.91.jar
#COPY ${JAR_FILE} app.jar
#
#EXPOSE 5827
#ENTRYPOINT ["java","-Djava.awt.headless=true","-jar","/app.jar"]
FROM albertoclarit/hisd3base:1.0.3




ARG PROJ_VERSION=1.2.0
VOLUME /tmp
WORKDIR /app
ADD build/libs/backend-$PROJ_VERSION.jar /app/BACKEND.jar
ADD fonts  /usr/java/jdk1.8.0_181-amd64/jre/lib/fonts
RUN chmod a+w /app

EXPOSE 5827
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Djava.awt.headless=true","-jar","/app/BACKEND.jar", "--spring.profiles.active=prod"]
