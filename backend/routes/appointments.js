exports.bookAppointment = async (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
            [patient_id, doctor_id, appointment_date, appointment_time, 'scheduled']
        );
        res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err });
    }
};
