# ==============================================================================
# Stage 1: Build stage using Maven and Java 21 JDK
# ==============================================================================
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source directory
COPY pom.xml .
COPY src ./src

# Compile and package the application into an executable JAR, skipping unit tests
RUN mvn clean package -DskipTests

# ==============================================================================
# Stage 2: Production runtime stage using lightweight Alpine JRE 21
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create a non-root group and user for container security
RUN addgroup -S resqnet && adduser -S resqnet -G resqnet
USER resqnet

# Copy the compiled JAR artifact from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose Spring Boot default HTTP port
EXPOSE 8080

# Configure container startup command
ENTRYPOINT ["java", "-jar", "app.jar"]
