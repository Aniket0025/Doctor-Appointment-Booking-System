Doctor Appointment Booking – Database Schema

This document contains the complete SQL structure for the Doctor_Appointment_Booking MySQL database, including tables, indexes, and relationships.

1. Create Database
CREATE DATABASE Doctor_Appointment_Booking;
USE Doctor_Appointment_Booking;

2. Users Table

Stores login details and roles for all users (patients, doctors, admins).

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Index for faster filtering by role
CREATE INDEX idx_role ON users(role);

3. Doctors Table

Stores doctor profiles linked with users.id.

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    experience INT CHECK (experience >= 0),
    fees INT NOT NULL,
    available_start TIME NOT NULL,
    available_end TIME NOT NULL,
    bio TEXT,

    CONSTRAINT fk_doctor_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

Index for specialization search
CREATE INDEX idx_specialization ON doctors(specialization);

4. Appointments Table

Stores doctor–patient appointments.

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointments_date DATE NOT NULL,
    appointments_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_appointment_doctor
        FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        ON DELETE CASCADE
);

Prevent double-booking (same doctor, same date & time)
CREATE UNIQUE INDEX unique_appointment
ON appointments(doctor_id, appointments_date, appointments_time);

5. Medical Records Table

Stores patient visit records and uploaded medical reports.

CREATE TABLE records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT,
    report_file VARCHAR(255),
    note TEXT,
    visit_date DATE NOT NULL,

    CONSTRAINT fk_record_patient
        FOREIGN KEY (patient_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_record_doctor
        FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        ON DELETE SET NULL
);

6. Feedback Table

Stores ratings & comments posted by patients after appointments.

CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_feedback_appointment
        FOREIGN KEY (appointment_id) REFERENCES appointments(id)
        ON DELETE CASCADE
);

7. Admin Logs Table

Tracks admin actions for security & monitoring.

CREATE TABLE admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_admin_log
        FOREIGN KEY (admin_id) REFERENCES users(id)
        ON DELETE CASCADE
);
