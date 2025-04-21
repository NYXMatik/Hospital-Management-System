import { Mapper } from "../core/infra/Mapper";
import { IMedicalRecordDTO } from "../dto/IMedicalRecordDTO";
import { IMedicalRecordAllergyDTO } from "../dto/IMedicalRecordAllergyDTO";
import { IMedicalRecordPersistence } from "../dataschema/IMedicalRecordPersistence";
import { MedicalRecord } from "../domain/MedicalRecord";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Allergy } from "../domain/Allergy";
import { MedicalCondition } from "../domain/MedicalCondition";
import { AllergyMap } from "./AllergyMap";
import { MedicalConditionMap } from "./MedicalConditionMap";

export class MedicalRecordMap extends Mapper<MedicalRecord> {

  public static toDTO(medicalRecord: MedicalRecord): IMedicalRecordDTO {
    return {
      userId: medicalRecord.userId,
      medicalConditions: medicalRecord.medicalConditions.map(mc => mc.medicalConditionId.value),
      allergies: medicalRecord.allergies.map(a => a.allergyId.value),
      freeTexts: medicalRecord.freeTexts
    } as IMedicalRecordDTO;
  }
  public static touserDTO(medicalRecord: MedicalRecord): IMedicalRecordDTO {
    const medicalConditions: string[] =[];
    const allergies: string[] =[];
    for (let i = 0; i < medicalRecord.medicalConditions.length; i++) {
      medicalConditions.push(medicalRecord.medicalConditions[i].toString());
    }
    for (let i = 0; i < medicalRecord.allergies.length; i++) {
      allergies.push(medicalRecord.allergies[i].toString());
    }
    return {
      userId: medicalRecord.userId,
      medicalConditions,
      allergies,
      freeTexts: medicalRecord.freeTexts
    } as IMedicalRecordDTO;
  }

  public static toDTOWithAllergy(medicalRecord: MedicalRecord): IMedicalRecordAllergyDTO {    

    const dto: IMedicalRecordAllergyDTO = {
      userId: medicalRecord.userId,
      medicalConditions: medicalRecord.medicalConditions.map(mc => ({
        medicalConditionId: mc.props.medicalConditionId,
        name: mc.props.designation,
        description: mc.props.description,
        commonSymptoms: mc.props.commonSymptoms


      })),
      allergies: medicalRecord.allergies.map(a => ({
        code: a.props.allergyId,
        designation: a.props.designation,
        description: a.props.description
      })),

      freeTexts: medicalRecord.freeTexts
    };

    return dto;
  }
  public static toDTOuser(medicalRecord: MedicalRecord): IMedicalRecordAllergyDTO {    

    const dto: IMedicalRecordAllergyDTO = {
      userId: medicalRecord.userId,
      medicalConditions: medicalRecord.medicalConditions.map(mc => ({
        medicalConditionId: mc.props.medicalConditionId.value,
        name: mc.props.designation.value,
        description: mc.props.description.value,
        commonSymptoms: mc.props.commonSymptoms.value


      })),
      allergies: medicalRecord.allergies.map(a => ({
        code: a.props.allergyId.value,
        designation: a.props.designation.value,
        description: a.props.description.value
      })),

      freeTexts: medicalRecord.freeTexts
    };

    return dto;
  }
  public static async toDomain(raw: IMedicalRecordPersistence): Promise<MedicalRecord> {
    console.log('raw:', raw);


    const medicalRecordOrError = MedicalRecord.create({
      userId: raw.userId,
      medicalConditions: await MedicalConditionMap.toDomainListName(raw.medicalConditions),
      allergies: await AllergyMap.toDomainList(raw.allergies),
      freeTexts: raw.freeTexts
    }, new UniqueEntityID(raw.userId));

    medicalRecordOrError.isFailure ? console.log(medicalRecordOrError.error) : '';

    return medicalRecordOrError.isSuccess ? medicalRecordOrError.getValue() : null;
  }
  public static async toDomainList(rawRecords: IMedicalRecordPersistence[]): Promise<MedicalRecord[]> {
    const medicalRecords = await Promise.all(rawRecords.map(raw => this.toDomain(raw)));
    return medicalRecords.filter(mr => mr !== null) as MedicalRecord[];
  }
  public static toPersistence(medicalRecord: MedicalRecord): IMedicalRecordPersistence {
    return {
      userId: medicalRecord.userId,
      medicalConditions: medicalRecord.medicalConditions,
      allergies: medicalRecord.allergies,
      freeTexts: medicalRecord.freeTexts
    };
  }
}