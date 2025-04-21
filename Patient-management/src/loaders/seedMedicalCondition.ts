import MedicalCondition from '../persistence/schemas/MedicalConditionSchema';

const medicalConditionData = [
  { code: "A04.0", designation: "Cholera", description: "Cholera is an acute diarrheal infection caused by ingestion of food or water contaminated with the bacterium Vibrio cholerae.", commonSymptoms: ["Severe watery diarrhea", "Vomiting", "Dehydration", "Muscle cramps"], }, 
  { code: "A08.0", designation: "Rotavirus enteritis", description: "Rotavirus enteritis is an infection of the intestines caused by rotavirus, leading to gastroenteritis.", commonSymptoms: ["Watery diarrhea", "Vomiting", "Fever", "Abdominal pain"], }, 
  { code: "B20", designation: "Human Immunodeficiency Virus (HIV) disease", description: "HIV disease is caused by the human immunodeficiency virus, which attacks the immune system.", commonSymptoms: ["Fatigue", "Weight loss", "Fever", "Night sweats", "Recurrent infections"], }, 
  { code: "B50", designation: "Plasmodium falciparum malaria", description: "Plasmodium falciparum malaria is a severe form of malaria caused by the parasite Plasmodium falciparum.", commonSymptoms: ["High fever", "Chills", "Headache", "Nausea", "Vomiting", "Anemia"], }, 
  { code: "2A20.0", designation: "Malignant neoplasm of lung", description: "Malignant neoplasm of the lung refers to lung cancer, which can be primary or metastatic.", commonSymptoms: ["Persistent cough", "Coughing up blood", "Chest pain", "Weight loss"], }, 
  { code: "2F44.0", designation: "Malignant neoplasm of the breast", description: "Malignant neoplasm of the breast is breast cancer, which can spread to other parts of the body.", commonSymptoms: ["Lump in the breast", "Changes in breast shape or size", "Skin changes", "Nipple discharge"], }, 
  { code: "3A01.1", designation: "Iron deficiency anemia", description: "Iron deficiency anemia is a condition where there is a lack of red blood cells due to insufficient iron.", commonSymptoms: ["Fatigue", "Weakness", "Pale skin", "Shortness of breath", "Dizziness"], }, 
  { code: "4A44", designation: "Hereditary hemochromatosis", description: "Hereditary hemochromatosis is a genetic disorder causing excessive iron absorption.", commonSymptoms: ["Joint pain", "Fatigue", "Liver disease", "Diabetes", "Heart problems"], }, 
  { code: "5A11", designation: "Type 1 diabetes mellitus", description: "Type 1 diabetes mellitus is an autoimmune condition where the body does not produce insulin.", commonSymptoms: ["Frequent urination", "Excessive thirst", "Hunger", "Weight loss", "Fatigue"], }, 
  { code: "5B55", designation: "Obesity", description: "Obesity is a condition characterized by excessive body fat accumulation.", commonSymptoms: ["Increased body weight", "Difficulty losing weight", "Fatigue", "Joint pain"], }, 
  { code: "6A80", designation: "Major depressive disorder", description: "Major depressive disorder is a mental health condition characterized by persistent sadness and loss of interest.", commonSymptoms: ["Persistent sadness", "Loss of interest", "Changes in appetite", "Sleep disturbances", "Feelings of worthlessness"], }, 
  { code: "6C40", designation: "Generalized anxiety disorder", description: "Generalized anxiety disorder is a mental health condition characterized by excessive, uncontrollable worry.", commonSymptoms: ["Persistent worry", "Restlessness", "Fatigue", "Difficulty concentrating", "Muscle tension"], }, 
  { code: "FB20.1", designation: "Osteoporosis with pathological fracture", description: "Osteoporosis with pathological fracture is a condition where bones become weak and brittle, leading to fractures.", commonSymptoms: ["Bone pain", "Fractures from minor injuries", "Loss of height", "Stooped posture"], }, 
  { code: "FB81.1", designation: "Osteoarthritis of the knee", description: "Osteoarthritis of the knee is a degenerative joint disease affecting the knee.", commonSymptoms: ["Knee pain", "Stiffness", "Swelling", "Reduced range of motion"], }, 
  { code: "FB81.2", designation: "Osteoarthritis of the hip", description: "Osteoarthritis of the hip is a degenerative joint disease affecting the hip.", commonSymptoms: ["Hip pain", "Stiffness", "Swelling", "Reduced range of motion"], }, 
  { code: "FB80.1", designation: "Rheumatoid arthritis", description: "Rheumatoid arthritis is an autoimmune disorder causing inflammation in the joints.", commonSymptoms: ["Joint pain", "Swelling", "Stiffness", "Fatigue"], }, 
  { code: "FA24.0", designation: "Fracture of femur", description: "", commonSymptoms: ["Severe pain", "Swelling", "Bruising", "Inability to walk"], },
  { code: "FA22.0", designation: "Fracture of radius and ulna", description: "Fracture of the radius and ulna is a break in the forearm bones.", commonSymptoms: ["Pain", "Swelling", "Deformity","Difficulty moving the arm"], },
  { code: "FA21.0", designation: "Dislocation of shoulder", description: "Dislocation of the shoulder is when the upper arm bone pops out of the shoulder socket.", commonSymptoms: ["Severe pain", "Shoulder deformity", "Swelling", "Inability to move the arm"], },
  { code: "FB70.0", designation: "Low back pain", description: "Low back pain is discomfort in the lower back region", commonSymptoms: ["Persistent pain", "Stiffness", "Muscle spasms", "Difficulty moving"], },
];


export const seedMedicalConditions = async () => {
  try {
    await MedicalCondition.insertMany(medicalConditionData);
    console.log('✅ Medical condition data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding medical condition data:', error);
  }
};

