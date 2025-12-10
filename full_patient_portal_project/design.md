# Design Document — Patient Documents Portal

## Tech Stack Choices
1. **Frontend:** JavaFX desktop application (Java)
   - Rationale: User requested frontend in Java. JavaFX provides a modern desktop UI, native file chooser, easy packaging and a single-user assumption fits desktop app model.
2. **Backend:** Spring Boot (Java)
   - Rationale: Production-grade, quick to scaffold REST APIs, first-class support for file upload, JPA for metadata persistence and easy MySQL integration.
3. **Database:** MySQL
   - Rationale: Requirement from the user. Well-supported by Spring Data JPA, robust and familiar.

## Architecture Overview
- JavaFX frontend -> HTTP requests -> Spring Boot backend (REST)
- Spring Boot stores files on local filesystem (uploads/) and metadata in MySQL table `documents`.
- Single-user assumption (no auth).

```
[JavaFX Client] --(POST /documents/upload)--> [Spring Boot API] --store file--> uploads/
                                                                                                 -- store metadata --> MySQL (patient_docs.documents)
```

## API Specification
### POST /documents/upload
- Description: Upload a PDF file.
- Request: multipart/form-data with key `file`.
- Response: 200 OK with JSON Document metadata or 400 on validation.

### GET /documents
- Description: List all uploaded documents (metadata).
- Response: 200 OK - JSON array of documents.

### GET /documents/{id}
- Description: Download the file with given id.
- Response: 200 with `application/pdf` content and Content-Disposition header.

### DELETE /documents/{id}
- Description: Delete the file and its metadata.
- Response: 200 OK or 404 if not found.

## Data Flow
### Upload
1. User chooses a PDF and clicks Upload.
2. JavaFX sends multipart POST to `/documents/upload`.
3. Backend validates content type, saves file to `uploads/` with a timestamped name.
4. Backend saves metadata (original filename, filepath, filesize, created_at) to MySQL.
5. Backend returns saved metadata; frontend shows success and refreshes list.

### Download
1. User selects an item and triggers download.
2. JavaFX calls GET `/documents/{id}`.
3. Backend locates file path by id, streams file back with `application/pdf`.
4. Client saves file to chosen location.

## Assumptions
- Single user (no authentication).
- File size limit: constrained by application server and JVM; recommended to keep <= 50 MB for local runs.
- Only PDF files allowed (`application/pdf` check).
- Concurrency: not built for heavy concurrent usage; safe for light local testing.

## Scaling notes for 1,000 users
- Move file storage to S3 or other object storage.
- Use a dedicated RDBMS instance with proper sizing; consider read replicas.
- Add authentication and per-user separation (user_id in metadata).
- Serve files via CDN or presigned URLs.
- Add pagination for listing, rate limiting, and connection pooling.
