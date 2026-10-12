
package com.nexasphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nexasphere.entity.Employee;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long> {
}
