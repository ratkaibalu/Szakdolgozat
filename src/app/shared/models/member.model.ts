export interface MemberModel {
    name: string;
    id: string;
    skills: SkillModel[];
    teamName: string;
}

export interface SkillModel {
    name: string;
    category: string;
    level: number;
}

export interface TeamModel {
    id: string;
    name: string;
}