INSERT INTO specialty (name)
SELECT DISTINCT specialty
FROM staging_saludplus WHERE specialty IS NOT NULL;

INSERT INTO patient (first_name, last_name, email, phone, address)
SELECT DISTINCT
    split_part(patient_name, ' ', 1),
    split_part(patient_name, ' ', 2),
    patient_email,
    patient_phone,
    patient_address
FROM staging_saludplus WHERE patient_email IS NOT NULL;

INSERT INTO treatment (treatment_code, name, description, cost)
SELECT DISTINCT
    treatment_code,
    treatment_description,
    treatment_description,
    treatment_cost
FROM staging_saludplus WHERE treatment_code IS NOT NULL;

INSERT INTO insurance (name)
SELECT DISTINCT insurance_provider
FROM staging_saludplus WHERE insurance_provider IS NOT NULL;

INSERT INTO insurance_coverage (insurance_provider_id, treatment_code, coverage_percentage)
SELECT DISTINCT
    i.insurance_provider_id,
    s.treatment_code,
    s.coverage_percentage
FROM staging_saludplus s
         JOIN insurance i ON i.name = s.insurance_provider;

INSERT INTO doctor (first_name, last_name, email, specialty_id)
SELECT DISTINCT
    split_part(regexp_replace(doctor_name, '^Dr\\.?\\s*', ''), ' ', 1) AS first_name,
    split_part(regexp_replace(doctor_name, '^Dr\\.?\\s*', ''), ' ', 2) AS last_name,
    doctor_email,
    sp.specialty_id
FROM staging_saludplus s
         JOIN specialty sp ON sp.name = s.specialty WHERE doctor_email IS NOT NULL;

INSERT INTO appointment (appointment_id, doctor_id, patient_id, date, treatment_code, insurance_provider_id, amount_paid)
SELECT
    s.appointment_id,
    d.id,
    p.id,
    s.appointment_date,
    s.treatment_code,
    i.insurance_provider_id,
    s.amount_paid
FROM staging_saludplus s
         JOIN doctor d ON d.email = s.doctor_email
         JOIN patient p ON p.email = s.patient_email
         JOIN insurance i ON i.name = s.insurance_provider;
