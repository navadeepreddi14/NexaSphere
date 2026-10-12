
package com.nexasphere.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nexasphere.entity.Department;
import com.nexasphere.repository.DepartmentRepository;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Department not found with ID: " + id));
    }

    public Department updateDepartment(Long id, Department updatedDepartment) {
        Department existing = getDepartmentById(id);
        existing.setDepartmentName(updatedDepartment.getDepartmentName());
        return departmentRepository.save(existing);
    }

    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        departmentRepository.delete(department);
    }
}
