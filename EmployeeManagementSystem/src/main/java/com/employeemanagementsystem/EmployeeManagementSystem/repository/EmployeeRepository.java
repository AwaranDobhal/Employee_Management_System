package com.employeemanagementsystem.EmployeeManagementSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.employeemanagementsystem.EmployeeManagementSystem.entity.EmployeeEntity;


@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long> {
    // Hibernate automatically writes the SQL for: SELECT * FROM employees WHERE email = ?
    //Employee findByEmail(String email);
    
    // Custom method by the user will be declared here which are not present in jpa repository
    // Eg. List<EmployeeEntity> findByName(String name);
    // Already present -> save, delete, finbyId , findall
}
