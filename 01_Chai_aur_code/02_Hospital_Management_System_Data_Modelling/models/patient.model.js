import mongoose from "mongoose";
const PatientSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    age: {type: Number, required: true},
    dateOfBirth: {
      type: Date,
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    diagonesedWith: {
      type: String,
      required: true,
    },
    address: {
      line1: {type: String, required: true},
      line2: {type: String},
      city: {type: String, required: true},
      state: {type: String, required: true},
      pinCode: {type: String, required: true},
      country: {type: String, required: true},
    },
    emergencyContact: {
      name: {type: String},
      relation: {type: String},
      phone: {type: String},
    },
    occupation: {
      type: String,
    },
    admittedIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    admissionDate: {
      type: Date,
    },
    dischargeDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Admitted", "Discharged", "Under Observation", "Referred"],
      default: "Under Observation",
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    roomNumber: {
      type: String,
    },
    ward: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    admittedIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
  },
  {timestamps: true}
);

export const PatientModel = mongoose.model("Patient", PatientSchema);
