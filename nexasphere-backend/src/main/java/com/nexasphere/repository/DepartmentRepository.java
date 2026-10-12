
package com.nexasphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nexasphere.entity.Department;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {
}
