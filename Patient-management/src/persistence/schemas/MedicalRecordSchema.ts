import { IMedicalRecordPersistence } from '../../dataschema/IMedicalRecordPersistence';
import mongoose from 'mongoose';
import { MedicalCondition } from '../../domain/MedicalCondition';
import { CommonSymptoms } from '../../domain/CommonSymptoms';

const AllergySchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please enter allergy code'],
  },
  designation: {
    type: String,
    required: [true, 'Please enter allergy designation'],
  },
  description: {
    type: String,
    required: [true, 'Please enter allergy description'],
  }
}, { _id: false });

const ConditionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please enter condition code'],
  },
  name: {
    type: String,
    required: [true, 'Please enter condition name'],
  },
  description: {
    type: String,
    required: [true, 'Please enter allergy description'],
  },
  commonSymptoms: {
    type: [String],
    required: [true, 'Please enter common symptoms'],
  }
}, { _id: false });


const MedicalRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'Please enter user ID'],
      index: true,
    },
    medicalConditions: {
      type: [ConditionSchema],
      required: true,
    },
    allergies: {
      type: [AllergySchema],
      required: true,
    },

    freeTexts: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

MedicalRecordSchema.methods.updateMedicalConditions = async function (newMedicalConditions: any[]): Promise<void> {
  this.medicalConditions = newMedicalConditions;
  await this.save();
};

MedicalRecordSchema.methods.updateAllergies = async function (newAllergies: any[]): Promise<void> {
  this.allergies = newAllergies;
  await this.save();
};

export default mongoose.model<IMedicalRecordPersistence & mongoose.Document>('MedicalRecord', MedicalRecordSchema);