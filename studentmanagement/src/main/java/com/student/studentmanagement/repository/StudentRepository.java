package com.student.studentmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.student.studentmanagement.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // Search students by name (case-insensitive)
    List<Student> findByNameContainingIgnoreCase(String name);
}
