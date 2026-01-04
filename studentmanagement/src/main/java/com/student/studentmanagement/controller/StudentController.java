package com.student.studentmanagement.controller;

import com.student.studentmanagement.model.Student;
import com.student.studentmanagement.repository.StudentRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository studentRepository;

    // ✅ Constructor injection
    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // ✅ PAGINATED GET (PostgreSQL SAFE)
    @GetMapping
    public Page<Student> getStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return studentRepository.findAll(PageRequest.of(page, size));
    }

    // ✅ ADD STUDENT
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    // ✅ DELETE STUDENT
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }

    // ✅ SEARCH BY NAME
    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam String name) {
        return studentRepository.findByNameContainingIgnoreCase(name);
    }
}
