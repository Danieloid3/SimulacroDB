
CREATE TABLE IF NOT EXISTS staging_saludplus (

    appointment_id VARCHAR(50),
    appointment_date TIMESTAMP,
    doctor_name TEXT,
    doctor_email TEXT,
    specialty TEXT,
    patient_name TEXT,
    patient_email TEXT,
    patient_phone TEXT,
    patient_address TEXT,
    treatment_code VARCHAR(50),
    treatment_description TEXT,
    treatment_cost NUMERIC(12,2),
    insurance_provider TEXT,
    coverage_percentage NUMERIC(5,2),
    amount_paid NUMERIC(12,2)
);
