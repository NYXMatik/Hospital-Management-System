import { IAllergyPersistence } from '../../dataschema/IAllergyPersistence';
import mongoose from 'mongoose';

const Allergy = new mongoose.Schema(
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

  },
  { timestamps: true },
);

export default mongoose.model<IAllergyPersistence & mongoose.Document>('Allergy', Allergy);
