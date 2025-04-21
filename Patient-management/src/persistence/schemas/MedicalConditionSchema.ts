import { IMedicalConditionPersistence } from '../../dataschema/IMedicalConditionPersistence';
import mongoose from 'mongoose';

const MedicalCondition = new mongoose.Schema(
  {
    code: { 
      type: String,
      unique: true,
      required: [true, 'Please enter code']
    },

    designation: {
      type: String,
      unique: true,
      required: [true, 'Please enter designation'],
      index: true,
    },

    description: {
      type: String,
      required: false,  
      default: "",  
      trim: true,
      index: true,
    },

    commonSymptoms: {
      type: [String],
      validate: [
        {
          validator: function (val: string[]) {
            return val.length > 0; 
          },
          message: 'A medical condition must have at least one common symptom.',
        },
        {
          validator: function (val: string[]) {
            return val.every(symptom => symptom.trim().length > 0); 
          },
          message: 'Each symptom must be a non-empty string.',
        }
      ],
      default: [],
    },
    
     

  },
  { timestamps: true },
);

export default mongoose.model<IMedicalConditionPersistence & mongoose.Document>('MedicalCondition', MedicalCondition);
