const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    position: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    date_of_joining: {
        type: Date,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});

// Middleware to update the updated_at field on save
employeeSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
