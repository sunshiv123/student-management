🎓 Student Management System – Spring Boot REST API

A production-ready Student Management System built using Spring Boot, featuring CRUD operations, pagination, sorting, search, validation, global exception handling, Swagger documentation, unit testing, and cloud deployment.

🚀 Deployed on Render with PostgreSQL

🔗 Live Links

🌍 Live API Base URL:
https://student-management-jywp.onrender.com

📘 Swagger UI:
https://student-management-jywp.onrender.com/swagger-ui.html


🛠 Tech Stack

Java 17

Spring Boot 3

Spring Data JPA

Hibernate

PostgreSQL (Production – Render)

H2 Database (Testing)

JUnit 5 & Mockito

Swagger / OpenAPI

Maven

Render (Deployment)

✨ Features

✔ Create, Read, Update, Delete (CRUD) Students
✔ Pagination & Sorting
✔ Search by student name
✔ Input Validation
✔ Global Exception Handling
✔ Standard API Response Wrapper
✔ Swagger API Documentation
✔ Controller & Service Layer Tests
✔ Cloud Deployment (Render)

📌 API Endpoints
➕ Create Student
POST /students

📄 Get All Students (Pagination & Sorting)
GET /students?page=0&size=5&sort=name,asc

🔍 Search Students by Name
GET /students/search?name=john

✏️ Update Student
PUT /students/{id}

❌ Delete Student
DELETE /students/{id}

🧾 Sample API Response
{
  "success": true,
  "message": "Students fetched successfully",
  "data": {
    "content": [],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 5
    },
    "totalElements": 0,
    "totalPages": 0
  }
}

🧪 Testing

This project includes job-level unit tests:

✅ Controller tests using MockMvc

✅ Service tests using Mockito

✅ Context load test

✅ H2 in-memory database for tests

Run tests:

./mvnw test

▶️ Run Locally
1️⃣ Clone the repository
git clone https://github.com/sunshiv123/student-management.git
cd student-management

2️⃣ Configure database (MySQL / PostgreSQL)

Update application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/studentdb
spring.datasource.username=root
spring.datasource.password=root

3️⃣ Run the application
./mvnw spring-boot:run

4️⃣ Open Swagger
http://localhost:8080/swagger-ui.html

☁️ Deployment

Deployed on Render

## 🧪 API Documentation

Swagger UI is enabled for easy API testing and documentation.

- Local:http://localhost:8080/swagger-ui.html
- Live:https://student-management-jywp.onrender.com/swagger-ui.html


PostgreSQL used as production database

Environment variables configured securely

Auto-deploy enabled from GitHub

👨‍💻 Author : Sunil
Backend Developer | Java | Spring Boot

🔗 GitHub: https://github.com/sunshiv123

