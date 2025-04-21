import Allergy from '../persistence/schemas/AllergySchema';

const allergyData = [
  { "code": "ICD-11: RA01.0", "designation": "Peanut Allergy", "description": "A condition where the immune system reacts abnormally to peanuts, causing symptoms ranging from mild hives to severe anaphylaxis." },
  { "code": "SNOMED CT: 40902003", "designation": "Shellfish Allergy", "description": "An allergic reaction to shellfish, such as shrimp, lobster, or crab. Symptoms can range from skin rashes to severe anaphylactic shock." },
  { "code": "ICD-11: RA03.0", "designation": "Milk Allergy", "description": "An immune system response to proteins in milk, most commonly seen in infants and young children. Symptoms may include hives, vomiting, and in severe cases, anaphylaxis." },
  { "code": "ICD-11: RA04.0", "designation": "Egg Allergy", "description": "An allergic reaction to proteins found in eggs, most common in children. Symptoms can range from mild rashes to severe respiratory issues." },
  { "code": "SNOMED CT: 80870005", "designation": "Tree Nut Allergy", "description": "An allergy to tree nuts such as almonds, walnuts, or hazelnuts. It can cause severe allergic reactions, including anaphylaxis." },
  { "code": "ICD-11: RA05.0", "designation": "Wheat Allergy", "description": "A condition where the body’s immune system reacts to proteins found in wheat. Symptoms include hives, digestive issues, and in some cases, anaphylaxis." },
  { "code": "ICD-11: RA06.0", "designation": "Penicillin Allergy", "description": "An allergy to penicillin and other related antibiotics. Symptoms can include rashes, fever, and severe reactions like anaphylaxis." },
  { "code": "ICD-11: RA07.0", "designation": "Sulfa Drugs Allergy", "description": "An allergy to sulfonamide drugs, commonly used as antibiotics. Symptoms may include skin reactions, fever, and anaphylaxis in severe cases." },
  { "code": "SNOMED CT: 2583000", "designation": "Aspirin Allergy", "description": "An allergic reaction to aspirin or other non-steroidal anti-inflammatory drugs (NSAIDs), leading to symptoms like skin reactions or respiratory problems." },
  { "code": "SNOMED CT: 309210001", "designation": "Local Anesthetics Allergy", "description": "An allergy to local anesthetics like lidocaine, which can cause reactions like rashes or breathing difficulties." },
  { "code": "SNOMED CT: 100312003", "designation": "Pollen Allergy", "description": "An allergic reaction to pollen from trees, grasses, or weeds, typically causing symptoms like sneezing, nasal congestion, and itchy eyes." },
  { "code": "SNOMED CT: 1151002", "designation": "Dust Mite Allergy", "description": "An allergy triggered by dust mites, microscopic organisms commonly found in bedding and furniture. Symptoms include sneezing, wheezing, and eczema." },
  { "code": "SNOMED CT: 328119003", "designation": "Mold Allergy", "description": "An allergic reaction to mold spores that can cause respiratory problems, skin rashes, and asthma exacerbations." },
  { "code": "SNOMED CT: 27902003", "designation": "Cat Dander Allergy", "description": "An allergy to proteins found in a cat's skin, saliva, or urine. Common symptoms include sneezing, coughing, and wheezing." },
  { "code": "SNOMED CT: 25816003", "designation": "Dog Dander Allergy", "description": "An allergic reaction to proteins from a dog’s skin cells, saliva, or urine. Symptoms may include sneezing, itching, and respiratory issues." },
  { "code": "ICD-11: RA10.0", "designation": "Latex Allergy", "description": "An allergy to latex, commonly found in gloves, balloons, and medical devices. Symptoms include hives, swelling, and severe reactions in some cases." },
  { "code": "SNOMED CT: 44608003", "designation": "Nickel Allergy", "description": "An allergy to nickel, a metal found in many jewelry items and everyday objects. Reactions usually involve skin rashes or itching." },
  { "code": "ICD-11: RA11.0", "designation": "Bee Sting Allergy", "description": "An allergic reaction to a bee sting, which can lead to swelling, pain, and in severe cases, anaphylaxis." },
  { "code": "ICD-11: RA12.0", "designation": "Fire Ant Sting Allergy", "description": "An allergy to the sting of fire ants, which can cause pain, swelling, and potentially life-threatening reactions like anaphylaxis." },
  { "code": "ICD-11: RA13.0", "designation": "Perfume Allergy", "description": "An allergy to certain chemicals used in perfumes and fragrances, leading to symptoms such as headaches, skin rashes, and respiratory problems." }
];


export const seedAllergies = async () => {
  try {
    await Allergy.insertMany(allergyData);
    console.log('✅ Allergy data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding allergy data:', error);
  }
};

