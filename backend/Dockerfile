FROM eclipse-temurin:8-jdk AS build

WORKDIR /app

COPY . .

RUN chmod +x ./gradlew
RUN ./gradlew clean bootJar -x test

FROM albertoclarit/hisd3base:1.0.3

VOLUME /tmp
WORKDIR /app

COPY --from=build /app/build/libs/*.jar /app/BACKEND.jar
COPY fonts /usr/java/jdk1.8.0_181-amd64/jre/lib/fonts

RUN chmod a+w /app

EXPOSE 5827

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-5827} -Djava.security.egd=file:/dev/./urandom -Djava.awt.headless=true -jar /app/BACKEND.jar --spring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod}"]