# --- Build stage ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first (cached layer)
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

# --- Run stage ---
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/event-collector-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
