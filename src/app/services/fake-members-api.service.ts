import { Injectable } from "@angular/core";
import { MemberModel } from "../shared/models/member.model";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class FakeMembersService {
    private members: MemberModel[] = [
        {
            id: 'fe',
            name: 'Karcsi',
            skills: [{
                name:'c++',
                category: 'backend',
                level: 3
            },],
            teamName: 'web4',
        },
        {
            id: 'fe',
            name: 'Sanyi',
            skills: [
                {
                    name:'C++',
                    category: 'backend',
                    level: 3
                },
                {
                    name: 'Java',
                    category: 'backend',
                    level: 100
                },
                {
                    name: 'Angular',
                    category: 'frontend',
                    level: 100
                },
                {
                    name: 'C#',
                    category: 'backend',
                    level: 100
                },
                {
                    name: 'Python',
                    category: 'backend',
                    level: 100
                },
                {
                    name: 'C',
                    category: 'backend',
                    level: 100
                },
                {
                    name: 'React',
                    category: 'frontend',
                    level: 100
                }
            ],
            teamName: 'web1',
        },
        {
            id: 'fe',
            name: 'Isti',
            skills: [{
                name:'c++',
                category: 'backend',
                level: 3
            },],
            teamName: 'panel',
        },
        {
            id: 'fe',
            name: 'Anna',
            skills: [{
                name:'c++',
                category: 'backend',
                level: 3
            },],
            teamName: 'web4',
        },
        {
            id: 'fe',
            name: 'Pityuka',
            skills: [{
                name:'c++',
                category: 'backend',
                level: 3
            },],
            teamName: 'web4',
        },
    ];

    constructor() {}

    getMemberList(): Observable<MemberModel[]> {

        return of(this.members);
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