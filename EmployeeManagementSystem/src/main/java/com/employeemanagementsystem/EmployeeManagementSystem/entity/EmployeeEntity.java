package com.employeemanagementsystem.EmployeeManagementSystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity                            // Tells Hibernate to create a table for this class
@Table(name="employee_db")
public class EmployeeEntity {

    @Id                           // Defines the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String department;  
    private String position;       
}