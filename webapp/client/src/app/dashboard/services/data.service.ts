import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MemberModel, SkillMemberModel, SkillModel } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  protected readonly apiUrl = '/api';

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

  getSkillName(skillId: number): Observable<SkillModel> {
    return this.http.get<SkillModel>(`${this.apiUrl}/skills/${skillId}`)
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

  getCategoryNameAndDesc(category_id: number){
    return this.http.get<MemberModel[]>(`${this.apiUrl}/category/${category_id}/name`);
  }

  getCategoryWithSkills(category_id: number){

    return this.http.get<MemberModel[]>(`${this.apiUrl}/category/${category_id}`);
  }

  getAllCategoryNames(){
    return this.http.get(`${this.apiUrl}/category_names`);
  }

  getCategoriesWithSkills(): Observable<SkillMemberModel[]> {
    return this.http.get<SkillMemberModel[]>(`${this.apiUrl}/category/skills`);
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

  putMemberName(memberId: number, memberName: string){
    const data = { memberId, memberName };
    return this.http.put(`${this.apiUrl}/member/profile/name`, data);
  }

  putMemberTeamsName(memberId: number, memberTeamsName: string){
    const data = { memberId, memberTeamsName };
    return this.http.put(`${this.apiUrl}/member/profile/teamsname`, data);
  }

  putMemberEmail(memberId: number, memberEmail: string){
    const data = { memberId, memberEmail };
    return this.http.put(`${this.apiUrl}/member/profile/email`, data);
  }

  putMemberRoles(memberId: number, memberRoles: string){
    const data = { memberId, memberRoles };
    return this.http.put(`${this.apiUrl}/member/profile/roles`, data);
  }

  putMemberAbout(memberId: number, memberAbout: string){
    const data = { memberId, memberAbout };
    return this.http.put(`${this.apiUrl}/member/profile/about`, data);
  }

  putCategoryDescription(categoryId: number, categoryDescription: string){
    const data = { categoryId, categoryDescription };
    return this.http.put(`${this.apiUrl}/category/description`, data);
  }

  putCategoryLinkName(linkId: number, categoryLinkName: string){
    const data = { linkId, categoryLinkName };
    return this.http.put(`${this.apiUrl}/category/linkname`, data);
  }

  putCategoryLink(linkId: number, categoryLink: string){
    const data = { linkId, categoryLink };
    return this.http.put(`${this.apiUrl}/category/link`, data);
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

  deleteMemberSkill(skillId: number, memberId: number){
    const data = {skillId, memberId};
    return this.http.delete(`${this.apiUrl}/member/skill`, {body: data});
  }
}
