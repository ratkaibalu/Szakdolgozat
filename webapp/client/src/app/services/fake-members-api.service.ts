import { Injectable } from "@angular/core";
import { MemberModel,SkillModel,TeamModel, TeamWithMembersModel } from "../shared/models/data.model";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class FakeMembersService {
    private teams: TeamModel[] = [
        {
            id: 1,
            name: "Webserver1"
        },
        {
            id: 2,
            name: "Webserver2"
        },
        {
            id: 3,
            name: "Webserver3"
        },
        {
            id: 4,
            name: "Webserver4"
        },
        {
            id: 5,
            name: "Security1"
        },
    ]
    
    private skills: SkillModel[] = [
        {
            name: "Angular",
            category: "Frontend",
        },
        {
            name: "React",
            category: "Frontend",
        },
        {
            name: "C++",
            category: "Backend",
        },
        {
            name: "C#",
            category: "Backend",
        },
        {
            name: "C",
            category: "Backend",
        },
        {
            name: "Ruby",
            category: "Backend",
        },
        {
            name: "Python",
            category: "Backend",
        },
        {
            name: "Valami",
            category: "Frontend",
        },
        {
            name: "Akármi",
            category: "Frontend",
        },
    ]

    private members: MemberModel[] = [
        {
            id: 'fe',
            name: 'János',
            skills: [{
                skill: {
                    name:'C++',
                    category: 'backend',
                    },
                level: 4
                },
            ],
            team_id: 4,
        },
        {
            id: 'fe',
            name: 'S',
            skills: [
                {
                    skill: {
                        name:'c++',
                        category: 'backend',
                        },
                    level: 3
                },
                {
                    skill: {
                        name:'JavaScript',
                        category: 'frontend',
                        },
                    level: 1
                },
                {
                    skill: {
                        name:'React',
                        category: 'frontend',
                        },
                    level: 2
                },
                {
                    skill: {
                        name:'Angular',
                        category: 'frontend',
                        },
                    level: 3
                },
                {
                    skill: {
                        name:'c++',
                        category: 'backend',
                        },
                    level: 4
                },
                {
                    skill: {
                        name:'c',
                        category: 'backend',
                        },
                    level: 2
                },
            ],
            team_id: 1,
        },
        {
            id: 'fe',
            name: 'ASD',
            skills: [{
                skill: {
                    name:'c++',
                    category: 'backend',
                    },
                level: 3
            },],
            team_id: 4,
        },
        {
            id: 'fe',
            name: 'Anna',
            skills: [{
                skill: {
                    name:'c++',
                    category: 'backend',
                    },
                level: 1
            },],
            team_id: 4,
            teamName: "Webserver4"
        },
        {
            id: 'fe',
            name: 'Pityuka',
            skills: [{
                skill: {
                    name:'c++',
                    category: 'backend',
                    },
                level: 2
            },],
            team_id: 3,
            teamName: "Webserver3"
        },
    ];

    constructor() {}

    getMemberList(): Observable<MemberModel[]> {
        return of(this.members);
    }

    getAllSkill(): Observable<SkillModel[]> {
        return of(this.skills);
    }

    getTeamList(): Observable<TeamModel[]> {
        return of(this.teams);
    }

    getTeamListWithMembers(): Observable<TeamWithMembersModel[]>{
        const teamsWithMembers: TeamWithMembersModel[] = [];
        this.members.forEach(member => {
            this.teams.forEach( team => {
                if (member.team_id === team.id) {
                    const foundTeam = teamsWithMembers.find((t) => t.id === team.id);
                    if (foundTeam) {
                        foundTeam.members.push(member);
                    }else{
                        teamsWithMembers.push({
                            id: team.id,
                            name: team.name,
                            members: [member]
                        })
                    }
                }
            })
        });
        return of(teamsWithMembers);
    }
    /*
    getMember(memberId: number) // : Observable<DetailedMemberModel> {
        // return this.http.get('/member')
    }

    editMember() {
        // ...
    }

    searchMember() {

    }
    */
}