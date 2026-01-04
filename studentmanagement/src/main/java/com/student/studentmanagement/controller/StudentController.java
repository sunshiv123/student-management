package com.student.studentmanagement.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.student.studentmanagement.dto.ApiResponse;
import com.student.studentmanagement.model.Student;
import com.student.studentmanagement.service.StudentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // ================= CREATE =================
    @Operation(summary = "Create a new student")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "Student created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400", description = "Validation error")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<Student>> addStudent(
            @Valid @RequestBody Student student) {

        Student saved = studentService.saveStudent(student);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Student created successfully", saved)
        );
    }

    // ================= READ ALL (Pagination) =================
    @Operation(summary = "Get all students with pagination")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "Students fetched successfully")
    })
    @GetMapping
public Page<Student> getStudents(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size
) {
    return studentRepository.findAll(PageRequest.of(page, size));
}


    // ================= READ BY ID (🔥 REQUIRED FOR EDIT) =================
    @Operation(summary = "Get student by ID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "Student fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404", description = "Student not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> getStudentById(
            @PathVariable Long id) {

        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Student fetched successfully", student)
        );
    }

    // ================= SEARCH =================
    @Operation(summary = "Search students by name")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "Search results returned")
    })
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Student>>> searchStudents(
            @RequestParam String name) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Search results",
                        studentService.searchByName(name)
                )
        );
    }

    // ================= UPDATE =================
    @Operation(summary = "Update a student by ID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "Student updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404", description = "Student not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody Student student) {

        Student updated = studentService.updateStudent(id, student);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Student updated successfully", updated)
        );
    }

    // ================= DELETE =================
    @Operation(summary = "Delete a student by ID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "Student deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404", description = "Student not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(
            @PathVariable Long id) {

        studentService.deleteStudent(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Student deleted successfully", null)
        );
    }
}
