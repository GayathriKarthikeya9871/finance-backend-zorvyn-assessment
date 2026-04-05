const db = require('../config/database');

const createRecord = (req, res) => {
    const { amount, type, category, date, notes } = req.body;
    const created_by = req.user.id;

    if (!amount || !type || !category || !date) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ error: "Type must be 'income' or 'expense'" });
    }

    const sql = `INSERT INTO records (amount, type, category, date, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [amount, type, category, date, notes || "", created_by];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: "Database error while creating record" });
        }
        res.status(201).json({
            message: "Record created successfully",
            record: { id: this.lastID, amount, type, category, date, notes, created_by }
        });
    });
};

const getRecords = (req, res) => {
    const { type, category, date } = req.query;
    
    let sql = `SELECT * FROM records WHERE 1=1`;
    const params = [];

    if (type) {
        sql += ` AND type = ?`;
        params.push(type);
    }
    if (category) {
        sql += ` AND category = ?`;
        params.push(category);
    }
    if (date) {
        sql += ` AND date = ?`;
        params.push(date);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Database error while fetching records" });
        }
        res.status(200).json(rows);
    });
};

const updateRecord = (req, res) => {
    const { id } = req.params;
    const { amount, type, category, date, notes } = req.body;

    const sql = `UPDATE records SET amount = ?, type = ?, category = ?, date = ?, notes = ? WHERE id = ?`;
    const params = [amount, type, category, date, notes || "", id];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: "Database error while updating" });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.status(200).json({ message: "Record updated successfully" });
    });
};

const deleteRecord = (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM records WHERE id = ?`;

    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ error: "Database error while deleting" });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.status(200).json({ message: "Record deleted successfully" });
    });
};

const getSummary = (req, res) => {
    const sql = `SELECT type, SUM(amount) as total FROM records GROUP BY type`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Database error while fetching summary" });
        }

        let income = 0;
        let expenses = 0;

        rows.forEach(row => {
            if (row.type === 'income') income = row.total;
            if (row.type === 'expense') expenses = row.total;
        });

        res.status(200).json({
            total_income: income,
            total_expenses: expenses,
            net_balance: income - expenses
        });
    });
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord, getSummary };