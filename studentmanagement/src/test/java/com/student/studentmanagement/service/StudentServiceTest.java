package com.student.studentmanagement.service;

import com.student.studentmanagement.model.Student;
import com.student.studentmanagement.repository.StudentRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    @Test
    void shouldSaveStudent() {
        Student student = new Student();
        student.setName("Alice");
        student.setEmail("alice@gmail.com");

        when(studentRepository.save(student)).thenReturn(student);

        Student saved = studentService.saveStudent(student);

        assertNotNull(saved);
        assertEquals("Alice", saved.getName());
    }

    @Test
    void shouldGetStudentsWithPagination() {
        Student student = new Student();
        student.setName("Bob");

        Page<Student> page = new PageImpl<>(
                List.of(student),
                PageRequest.of(0, 5),
                1
        );

        when(studentRepository.findAll(any(PageRequest.class)))
                .thenReturn(page);

        Page<Student> result = studentService.getStudents(PageRequest.of(0, 5));

        assertEquals(1, result.getTotalElements());
    }

    @Test
    void shouldUpdateStudent() {
        Student existing = new Student();
        existing.setId(1L);
        existing.setName("Old");

        Student updated = new Student();
        updated.setName("New");

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(existing));
        when(studentRepository.save(any(Student.class)))
                .thenReturn(existing);

        Student result = studentService.updateStudent(1L, updated);

        assertEquals("New", result.getName());
    }

    @Test
void shouldDeleteStudent() {
    Student student = new Student();
    student.setId(1L);

    when(studentRepository.findById(1L))
            .thenReturn(Optional.of(student));

    studentService.deleteStudent(1L);

    verify(studentRepository, times(1)).delete(student);
}
}
