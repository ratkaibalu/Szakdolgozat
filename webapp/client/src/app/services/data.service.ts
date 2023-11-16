import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MemberModel, SkillModel } from '../shared/models/data.model';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private apiUrl = 'http://localhost:3000'; // Módosítsd a helyes URL-re

  constructor(private http: HttpClient) { }

  // GET
  getMembers() {
    return this.http.get(`${this.apiUrl}/members`);
  }

  getTeams() {
    return this.http.get(`${this.apiUrl}/teams`);
  }

  getCategories() {
    return this.http.get<MemberModel[]>(`${this.apiUrl}/category`);
  }

  getSkillNames(): Observable<SkillModel[]> {
    return this.http.get<SkillModel[]>(`${this.apiUrl}/skills`);
  }

  getAllMembersWithSkills(): Observable<MemberModel[]> {
    return this.http.get<MemberModel[]>(`${this.apiUrl}/members/all`);
  }

  getSpecificMember(member_id: number){
    return this.http.get(`${this.apiUrl}/members/${member_id}`);
  }

  getSpecificMemberSkills(member_id: number){
    return this.http.get(`${this.apiUrl}/members/${member_id}/skills`);
  }

  getTeamMembers(team_id: number) {
    return this.http.get(`${this.apiUrl}/teams/${team_id}/members`);
  }

  getTeamById(team_id: number){
    return this.http.get(`${this.apiUrl}/teams/${team_id}`);
  }

  getTeamMemberSkills(team_id: number): Observable<MemberModel[]> {
    return this.http.get<MemberModel[]>(`${this.apiUrl}/teams/${team_id}/members/skills`);
  }

  getSkillLinks(skillId: number){
    return this.http.get<MemberModel[]>(`${this.apiUrl}/category/skills/${skillId}`);
  }

  getCategoryLinks(category_id: number){
    return this.http.get<MemberModel[]>(`${this.apiUrl}/category_links/${category_id}`);
  }

  getCategoryWithSkills(category_id: number){

    return this.http.get<MemberModel[]>(`${this.apiUrl}/category/${category_id}`);
  }

  getAllCategoryNames(){
    return this.http.get(`${this.apiUrl}/category_names`);
  }

  getCategoriesWithSkills(){
    return this.http.get(`${this.apiUrl}/category/skills`);
  }

  getBestMembers(skillId: number){
    return this.http.get(`${this.apiUrl}/category/skills/members/${skillId}`);
  }

  getDropdownMembers(teamId: number){
    return this.http.get(`${this.apiUrl}/teams/${teamId}/members/add`);
  }

  // POST
  postNewLink(skillId: number, linkId: number) {
    const data = { skillId, linkId };
    return this.http.post(`${this.apiUrl}/skill_links`, data);
  }

  postNewSkill(categoryId: number){
    const data = { categoryId };
    console.log(data);
    
    return this.http.post(`${this.apiUrl}/category/skills`, data);
  }

  postNewCategoryLink(categoryId: number){
    const data = { categoryId };
    return this.http.post(`${this.apiUrl}/category_links`, data);
  }

  postNewTeam(){
    const data = { newTeam : "New Team" };
    return this.http.post(`${this.apiUrl}/teams`, data);
  }

  postMemberToTeam(memberId: number,teamId: number){
    const data = { memberId,teamId };
    return this.http.post(`${this.apiUrl}/teams/members`, data);
  }

  postNewMemberSkillLevel(memberId: number, skillId: number, skillLevel: number){
    const data = { memberId, skillId, skillLevel };
    return this.http.post(`${this.apiUrl}/member/skill`, data);
  }

  //UPDATE
  putTeamName(teamId: number, teamName: string){
    const data = { teamId, teamName };
    return this.http.put(`${this.apiUrl}/team_name`, data);
  }

  putMemberSkillLevel(memberId: number, skillId: number, skillLevel: number){
    const data = { memberId, skillId, skillLevel };
    return this.http.put(`${this.apiUrl}/member/skill`, data);
  }

  //DELETE
  deleteLink(linkId: number){
    const data = { linkId };
    return this.http.delete(`${this.apiUrl}/skill_links`, {body: data});
  }

  deleteSkill(skillId: number){
    const data = { skillId };
    return this.http.delete(`${this.apiUrl}/category/skills`, {body: data});
  }

  deleteCategoryLink(categoryLinkId:number){
    const data = { categoryLinkId };
    return this.http.delete(`${this.apiUrl}/category_links`, {body: data});
  }

  deleteTeam(teamId: number){
    const data = { teamId };
    return this.http.delete(`${this.apiUrl}/teams`, {body: data});
  }
  deleteTeamMembers(teamId: number){
    const data = { teamId };
    return this.http.delete(`${this.apiUrl}/teammembers`, {body: data});
  }

  deleteMembers(teamId: number, memberId: number){
    const data = { teamId, memberId };
    return this.http.delete(`${this.apiUrl}/teams/member`, {body: data});
  }
}
