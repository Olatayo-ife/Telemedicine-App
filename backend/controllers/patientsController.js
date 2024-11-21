const bcrypt = require('bcrypt');
const db = require('../models/db');

exports.register = async (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const [result] = await db.execute(
            'INSERT INTO Patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address]
        );
        res.status(201).json({ message: 'Patient registered successfully', patientId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM Patients WHERE email = ?', [email]);
        const patient = rows[0];

        if (patient && await bcrypt.compare(password, patient.password_hash)) {
            req.session.patientId = patient.id;
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err });
    }
};
