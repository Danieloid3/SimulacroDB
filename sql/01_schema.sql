-- 1. Destruir SOLO las tablas finales (dejamos staging intacta)
DROP TABLE IF EXISTS appointment CASCADE;
DROP TABLE IF EXISTS insurance_coverage CASCADE;
DROP TABLE IF EXISTS doctor CASCADE;
DROP TABLE IF EXISTS patient CASCADE;
DROP TABLE IF EXISTS insurance CASCADE;
DROP TABLE IF EXISTS treatment CASCADE;
DROP TABLE IF EXISTS specialty CASCADE;

-- (NO hacemos drop de staging_saludplus)

-- 2. Creación de tablas finales
CREATE TABLE specialty (
                           specialty_id SERIAL PRIMARY KEY,
                           name VARCHAR(100) NOT NULL
);

CREATE TABLE doctor (
                        id SERIAL PRIMARY KEY,
                        first_name VARCHAR(100) NOT NULL,
                        last_name VARCHAR(100) NOT NULL,
                        email VARCHAR(150) UNIQUE NOT NULL,
                        specialty_id INTEGER NOT NULL,
                        CONSTRAINT fk_doctor_specialty FOREIGN KEY (specialty_id) REFERENCES specialty (specialty_id)
);

CREATE TABLE patient (
                         id SERIAL PRIMARY KEY,
                         first_name VARCHAR(100) NOT NULL,
                         last_name VARCHAR(100) NOT NULL,
                         email VARCHAR(150) UNIQUE NOT NULL,
                         phone VARCHAR(30),
                         address TEXT
);

CREATE TABLE treatment (
                           treatment_code VARCHAR(20) PRIMARY KEY,
                           name VARCHAR(150) NOT NULL,
                           description TEXT,
                           cost NUMERIC(12,2) NOT NULL CHECK (cost >= 0)
);

CREATE TABLE insurance (
                           insurance_provider_id SERIAL PRIMARY KEY,
                           name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE insurance_coverage (
                                    insurance_provider_id INTEGER NOT NULL,
                                    treatment_code VARCHAR(20) NOT NULL,
                                    coverage_percentage NUMERIC(5,2) NOT NULL CHECK (coverage_percentage BETWEEN 0 AND 100),
                                    PRIMARY KEY (insurance_provider_id, treatment_code),
                                    CONSTRAINT fk_coverage_insurance FOREIGN KEY (insurance_provider_id) REFERENCES insurance (insurance_provider_id) ON DELETE CASCADE,
                                    CONSTRAINT fk_coverage_treatment FOREIGN KEY (treatment_code) REFERENCES treatment (treatment_code) ON DELETE CASCADE
);

CREATE TABLE appointment (
                             appointment_id VARCHAR(20) PRIMARY KEY,
                             doctor_id INTEGER NOT NULL,
                             patient_id INTEGER NOT NULL,
                             date TIMESTAMP NOT NULL,
                             treatment_code VARCHAR(20) NOT NULL,
                             insurance_provider_id INTEGER NOT NULL,
                             amount_paid NUMERIC(12,2) NOT NULL CHECK (amount_paid >= 0),
                             CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (id),
                             CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patient (id),
                             CONSTRAINT fk_appointment_coverage FOREIGN KEY (insurance_provider_id, treatment_code) REFERENCES insurance_coverage (insurance_provider_id, treatment_code)
);

-- (Tampoco hacemos el CREATE TABLE de staging_saludplus aquí)
