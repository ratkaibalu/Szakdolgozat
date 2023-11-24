export interface MemberModel {
    memberName: string;
    id: string;
    skills: SkillMemberModel[];
    teamId: number;
    teamName?: string;
    description? :string;
}

export interface SkillModel {
    skillId: string;
    skillName: string;
}

export interface SkillMemberModel extends SkillModel {
    skillLevel: number;
}


export interface TeamModel {
    id: number;
    name: string;
}

export interface TeamWithMembersModel extends TeamModel {
    members: MemberModel[];
}

/**
 * For skill table display.
 */
export interface CellInfo {
    content: string;
    cssClass: string;
}

export type MemberCell = Omit<MemberModel, 'skills'> & {
    skillCells: CellInfo[];
} 
