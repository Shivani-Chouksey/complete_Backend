import mongoose from "mongoose";

const Medical_Record_Schema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    visitDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    visitType: {
      type: String,
      enum: ["Outpatient", "Inpatient", "Emergency", "Teleconsultation"],
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: {
      type: [String],
      required: true,
    },
    treatmentPlan: {
      type: String,
      required: true,
    },
    medicationsPrescribed: {
      type: [String],
      required: true,
    },
    dosageInstructions: {
      type: String,
    },
    vitalSigns: {
      temperature: String,
      bloodPressure: String,
      heartRate: String,
      respiratoryRate: String,
      oxygenSaturation: String,
    },
    allergies: {
      type: [String],
    },
    labTests: [
      {
        testName: String,
        result: String,
        unit: String,
        referenceRange: String,
        date: Date,
      },
    ],
    imagingReports: [
      {
        type: String, // e.g., X-Ray, MRI
        description: String,
        fileUrl: String,
        date: Date,
      },
    ],
    surgicalHistory: {
      type: [String],
    },
    medicalHistory: {
      type: [String],
    },
    familyHistory: {
      type: [String],
    },
    lifestyleFactors: {
      smoking: Boolean,
      alcohol: Boolean,
      physicalActivity: String,
      diet: String,
    },
    followUpDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Recovered", "Referred", "Under Treatment"],
      default: "Active",
    },
  },
  {timestamps: true}
);

export const Medical_Record_Model = mongoose.model("Medical_Record", Medical_Record_Schema);
