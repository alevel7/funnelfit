import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto  {
    phone: string;
    firstName: string;
    lastName: string;
    linkedInUrl: string;
    resumeUrl: string;
    certifications: { certCode: string; name:string, url: string }[];
    education: { degree: string; institution: string; year: number }[];
    expertise_areas: { code: string, name: string }[];
    years_experience: { min: number; max: number }
}
