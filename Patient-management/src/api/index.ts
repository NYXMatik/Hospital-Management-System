import { Router } from 'express';
import medicalCondition from './routes/MedicalConditionRoute';
import allergy from './routes/AllergyRoute';
import medicalRecord from './routes/MedicalRecordRoute';
import medicalRecordAllergyRoute from './routes/MedicalRecordAllergyRoute';


export default () => {
	const app = Router();

	//auth(app);
	medicalCondition(app);
	allergy(app);
	medicalRecord(app);
	medicalRecordAllergyRoute(app);
	
	return app
}