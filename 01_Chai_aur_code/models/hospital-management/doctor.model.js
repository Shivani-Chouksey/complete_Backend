import mongoose from "mongoose";

const worksIn_Hospital_Hours_Schema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const doctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    email: {
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
    address: {
      line1: {type: String},
      line2: {type: String},
      city: {type: String},
      state: {type: String},
      pinCode: {type: String},
      country: {type: String},
    },
    profileImageUrl: {
      type: String,
    },
    salary: {
      type: Number,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    certifications: {
      type: [String],
    },
    specialization: {
      type: [String], // e.g. Cardiology, Pediatrics, etc.
      required: true,
    },
    experienceInYears: {
      type: Number,
      required: true,
    },
    languagesSpoken: {
      type: [String],
    },
    biography: {
      type: String,
    },
    availableForConsultation: {
      type: Boolean,
      default: true,
    },
    worksInHospitals: {
      type: [worksIn_Hospital_Hours_Schema],
    },
  },
  {timestamps: true}
);

// Virtual for full name
doctorSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const DoctorModel = mongoose.model("Doctor", doctorSchema);
