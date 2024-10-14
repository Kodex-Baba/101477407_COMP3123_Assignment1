const express = require("express");
const { body, validationResult } = require('express-validator');
const Employees = require("../models/employees");
const router = express.Router();

// GET /api/v1/emp/employees
// Get All employees
router.get("/employees", (req, res) => {
    // Get all employees from MongoDB
    Employees.find()
        .then((employees) => {
            res.status(200).json({ data: employees });
        })
        .catch((err) => {
            res.status(500).json({ message: "Error retrieving employees", error: err.message });
        });
});

// Add NEW Employee
// POST /api/v1/emp/employees
router.post("/employees", [
    body('first_name').notEmpty().withMessage('First name is required.'),
    body('last_name').notEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('position').notEmpty().withMessage('Position is required.'),
    body('salary').isNumeric().withMessage('Salary must be a number.'),
    body('date_of_joining').isISO8601().withMessage('Valid date of joining is required.'), // Ensure it is a valid date
    body('department').notEmpty().withMessage('Department is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const employeeData = req.body;
    try {
        const employee = new Employees(employeeData);
        const newEmployee = await employee.save();
        res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
    } catch (err) {
        res.status(500).json({ message: "Error creating employee", error: err.message });
    }
});

// Get Employee By ID
// GET /api/v1/emp/employees/:employeeid
router.get("/employees/:employeeid", async (req, res) => {
    try {
        const employee = await Employees.findById(req.params.employeeid);
        if (employee) {
            res.status(200).json({ message: "Employee found", employee: employee });
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving employee", error: err.message });
    }
});

// Update existing Employee By Id
// PUT /api/v1/emp/employees/:employeeid
router.put(
    "/employees/:employeeid",
    [
        body('first_name').optional().notEmpty().withMessage('First name is required.'),
        body('last_name').optional().notEmpty().withMessage('Last name is required.'),
        body('email').optional().isEmail().withMessage('Valid email is required.'),
        body('position').optional().notEmpty().withMessage('Position is required.'),
        body('salary').optional().isNumeric().withMessage('Salary must be a number.'),
        body('date_of_joining').optional().isISO8601().toDate().withMessage('Valid date of joining is required.'),
        body('department').optional().notEmpty().withMessage('Department is required.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Update employee by ID
            const updatedEmployee = await Employees.findByIdAndUpdate(req.params.employeeid, req.body, { new: true, runValidators: true });

            if (updatedEmployee) {
                res.status(200).json({ message: "Employee details updated", employee: updatedEmployee });
            } else {
                res.status(404).json({ message: "Employee not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Error updating employee", error: err.message });
        }
    }
);

// Delete employee by employee id
// DELETE /api/v1/emp/employees?eid=xxx
router.delete("/employees", async (req, res) => {
    const employeeId = req.query.eid; // Get the employee ID from query parameters

    try {
        const deletedEmployee = await Employees.findByIdAndDelete(employeeId);

        if (deletedEmployee) {
            res.status(200).json({ message: "Employee deleted successfully" });
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Employee could not be deleted", error: err.message });
    }
});

module.exports = router;

