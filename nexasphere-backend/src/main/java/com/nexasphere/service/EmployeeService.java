
package com.nexasphere.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nexasphere.entity.Department;
import com.nexasphere.entity.Employee;
import com.nexasphere.repository.DepartmentRepository;
import com.nexasphere.repository.EmployeeRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    // CREATE
    public Employee createEmployee(Employee employee, Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found with ID: " + departmentId));

        employee.setDepartment(department);
        return employeeRepository.save(employee);
    }

    // READ ALL
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // READ BY ID
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with ID: " + id));
    }

    // UPDATE
    public Employee updateEmployee(Long id, Employee updatedEmployee,
                                   Long departmentId) {
        Employee existing = getEmployeeById(id);

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found with ID: " + departmentId));

        existing.setEmployeeName(updatedEmployee.getEmployeeName());
        existing.setEmail(updatedEmployee.getEmail());
        existing.setSalary(updatedEmployee.getSalary());
        existing.setDepartment(department);

        return employeeRepository.save(existing);
    }

    // DELETE
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }
}
