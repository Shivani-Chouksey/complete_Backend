import mongoose from "mongoose";
const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    establishedYear: {
      type: Number,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    alternatePhone: {
      type: String,
    },
    website: {
      type: String,
    },
    ownershipType: {
      type: String,
      enum: ["Private", "Government", "Charitable", "Corporate"],
      required: true,
    },
    specializedIn: {
      type: [String], // e.g. Cardiology, Oncology
    },
    email: {
      type: String,
      required: true,
    },
    specializedIn: [{type: String}],
    numberOfBeds: {
      type: Number,
      required: true,
    },
    numberOfDoctors: {
      type: Number,
      required: true,
    },

    numberOfPatients: {
      type: Number,
      required: true,
    },
    numberOfNurses: {
      type: Number,
      required: true,
    },
    numberOfAmbulances: {
      type: Number,
      required: true,
    },
    numberOfDepartments: {
      type: Number,
      required: true,
    },
    numberOfRooms: {
      type: Number,
      required: true,
    },
    numberOfWards: {
      type: Number,
      required: true,
    },
    numberOfPharmacies: {
      type: Number,
      required: true,
    },
    numberOfLabs: {
      type: Number,
      required: true,
    },
    numberOfOTs: {
      type: Number,
      required: true,
    },
    numberOfICUs: {
      type: Number,
      required: true,
    },
    numberOfEmergencyRooms: {
      type: Number,
      required: true,
    },
    numberOfWaitingRooms: {
      type: Number,
      required: true,
    },
    numberOfReceptionAreas: {
      type: Number,
      required: true,
    },
    numberOfCafeterias: {
      type: Number,
      required: true,
    },
    docters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Docter",
      },
    ],
  },

  {timestamps: true}
);

export const HospitalModel = mongoose.model("Hospital", hospitalSchema);
