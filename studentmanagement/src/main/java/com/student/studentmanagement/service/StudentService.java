package com.student.studentmanagement.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.student.studentmanagement.exception.StudentNotFoundException;
import com.student.studentmanagement.model.Student;
import com.student.studentmanagement.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // ================= CREATE =================
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // ================= READ ALL (Pagination) =================
    public Page<Student> getStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    // ================= READ BY ID =================
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: " + id));
    }

    // ================= UPDATE =================
    public Student updateStudent(Long id, Student student) {
        Student existing = getStudentById(id);

        // Update only if value is present
        if (StringUtils.hasText(student.getName())) {
            existing.setName(student.getName());
        }
        if (StringUtils.hasText(student.getEmail())) {
            existing.setEmail(student.getEmail());
        }
        if (StringUtils.hasText(student.getCourse())) {
            existing.setCourse(student.getCourse());
        }
        if (StringUtils.hasText(student.getPhone())) {
            existing.setPhone(student.getPhone());
        }

        return studentRepository.save(existing);
    }

    // ================= DELETE =================
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }

    // ================= SEARCH =================
    public List<Student> searchByName(String name) {
        return studentRepository.findByNameContainingIgnoreCase(name);
    }
}
