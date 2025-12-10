# Patient Documents Portal (JavaFX + Spring Boot + MySQL)

This repository contains a working full-stack sample required by the assessment.

## Contents
- `backend/` — Spring Boot application (port 8080)
- `frontend/` — JavaFX desktop client (Java 17)
- `design.md` — Design document answering PDF requirements

## Prerequisites
- Java 17+ installed
- Maven installed
- MySQL running with a database `patient_docs`
- Adjust MySQL credentials in `backend/src/main/resources/application.properties`

## Setup (Backend)
1. Create MySQL database:
   ```sql
   CREATE DATABASE patient_docs;
   ```
2. Update `application.properties` with your MySQL username/password.
3. From `backend/` run:
   ```
   mvn spring-boot:run
   ```
   Backend will start on port 8080 and create `uploads/` folder (if not present).

## Setup (Frontend)
1. From `frontend/` run:
   ```
   mvn javafx:run
   ```
2. Use the UI to upload, download, delete files. Double-click an item to download it.

## API Examples
- Upload (curl):
  ```
  curl -F "file=@/path/to/file.pdf" http://localhost:8080/documents/upload
  ```
- List:
  ```
  curl http://localhost:8080/documents
  ```
- Download:
  ```
  curl -o a.pdf http://localhost:8080/documents/1
  ```
- Delete:
  ```
  curl -X DELETE http://localhost:8080/documents/1
  ```

## Notes
This project is intentionally simple to match the assessment scope. For production you'd add authentication, validation, object storage, and monitoring.
