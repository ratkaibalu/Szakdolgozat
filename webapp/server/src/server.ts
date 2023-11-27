import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;

import express, { Application, Request } from "express";
import mysql, { RowDataPacket, Connection } from "mysql2";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { AuthController } from './auth-controller';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//Adatbázis kapcsolat konfigurációja
const db = mysql.createConnection({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

const auth = new AuthController(express.Router(), db);
auth.registerEndpoints();
app.use("/api/auth", auth.Router);

//Kapcsolat tesztelése
db.connect((err) => {
  if (err) {
    console.error('Hiba a MySQL kapcsolódás során: ' + err.stack);
    return;
  }
  console.log('MySQL kapcsolat sikeresen létrehozva');
});



// REST API kérések


const dataRouter = express.Router();
// GET
dataRouter.get('/skills', (req, res) => {
  db.query<RowDataPacket[]>('SELECT skill_name,skill_id FROM Skills ORDER by skill_name ASC', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      const transformed = results.map((skill) => ({skillId: skill.skill_id, skillName: skill.skill_name}));
      res.status(200).json(transformed);
    }
  });
});

dataRouter.get('/skills/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.query<RowDataPacket[]>(`SELECT skill_name FROM Skills WHERE skill_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results[0].skill_name);
    }
  });
});

dataRouter.get('/category', (req, res) => {
  db.query<RowDataPacket[]>(`Select skill_id,skill_name,Skills.category_id,category_name, category_image,category_description
    from Skills,Categories
    Where Skills.category_id = Categories.category_id`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(flattenCategories(results));
    }
  });
});

dataRouter.get('/category/skills/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.query<RowDataPacket[]>(`SELECT skill_links_id,skill_type,skill_link,skill_linkname FROM skill_links WHERE skill_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.get('/category/skills', (req, res) => {
  db.query<RowDataPacket[]>(`SELECT * FROM skills`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.get('/category_names', (req: Request, res) => {
  const id = parseInt(req.params.id as string);
  db.query<RowDataPacket[]>(`SELECT category_name,category_id FROM categories`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.get('/category/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.query<RowDataPacket[]>(`SELECT * from skills where category_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.get('/members', (req, res) => {
  db.query<RowDataPacket[]>(`select member_name,Members.member_id,team_name
  from Members,Teams, Teammembers
  Where Members.member_id = teammembers.member_id and Teams.team_id = teammembers.team_id
  Order by member_name asc;`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.get('/memberskills', (req, res) => {
  db.query<RowDataPacket[]>('SELECT * FROM MemberSkills', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.get('/members/all', (req, res) => {
  db.query<RowDataPacket[]>(`
SELECT 
  Members.member_id,
  member_name,
  skill_name,
  Skills.skill_id,
  skill_level,
  Teams.team_id,
  team_name
FROM teammembers
JOIN Members ON Members.member_id = teammembers.member_id
LEFT JOIN MemberSkills ON Members.member_id = MemberSkills.member_id
LEFT JOIN Skills ON Skills.skill_id = MemberSkills.skill_id
JOIN Teams ON Teams.team_id = teammembers.team_id
WHERE canBeInMultipleTeam = false
UNION
SELECT 
  members.member_id,
  member_name,
  skill_name,
  skills.skill_id,
  skill_level,
  NULL AS team_id,
  NULL AS team_name
FROM members
LEFT JOIN memberskills ON Members.member_id = MemberSkills.member_id
LEFT JOIN Skills ON Skills.skill_id = memberskills.skill_id
WHERE canBeInMultipleTeam = true;`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {

      res.status(200).json(flattenSkills(results));
    }
  });
});

dataRouter.get('/members/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  
  db.query<RowDataPacket[]>(`select member_name,email,roles,teams_name,about FROM Members WHERE member_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

dataRouter.get('/members/:id/skills', (req, res) => {
  const id = parseInt(req.params.id);
  db.query<RowDataPacket[]>(`select skill_name,skills.skill_id,skill_level from skills,memberskills where skills.skill_id = memberskills.skill_id and member_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.get('/teams/:id/members', (req, res) => {
  const id = parseInt(req.params.id);
  db.query<RowDataPacket[]>(`select member_name
  from Members,Teammembers
  Where Members.member_id = teammembers.member_id and team_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.get('/teams/:id/members/skills', (req, res) => {
  const id = parseInt(req.params.id);
  db.query<RowDataPacket[]>(`SELECT Members.member_id,member_name,skill_name,Skills.skill_id,skill_level,Teams.team_id,team_name 
  FROM Teammembers,Members 
  left join MemberSkills on Members.member_id = MemberSkills.member_id
  left join Skills on Skills.skill_id = MemberSkills.skill_id
  ,Teams WHERE Members.member_id = teammembers.member_id and Teams.team_id = teammembers.team_id AND Teams.team_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(flattenSkills(results));
    }
  });
});

dataRouter.get('/teams/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.query<RowDataPacket[]>(`SELECT team_name FROM Teams WHERE team_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results[0].team_name);
    }
  });
});

dataRouter.get('/teams', (req, res) => {
  db.query<RowDataPacket[]>('SELECT * FROM Teams', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
  
});

dataRouter.get('/category/skills/members/:id', (req, res) => {
  const id = parseInt(req.params.id);  
  db.query<RowDataPacket[]>(`Select member_name,Members.member_id, skill_level From members, memberskills Where Members.member_id = memberskills.member_id and skill_level >= 3 and skill_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.get('/category/:id/name', (req, res) => {
  const id = parseInt(req.params.id);  
  db.query<RowDataPacket[]>(`Select category_name, category_description From categories Where category_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.get('/category_links/:id', (req, res) => {
  const id = parseInt(req.params.id);  
  db.query<RowDataPacket[]>(`select categorylinks_id, category_link, category_linkname from categories_links where category_id = ${id};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.get('/teams/:id/members/add', (req, res) => {
  const id = parseInt(req.params.id);  
  db.query<RowDataPacket[]>(`select m.member_id, m.member_name from Members as m left join
  (select member_id, member_name from (
    Select * from Members natural join Teammembers where canBeInMultipleTeam is false
    union 
    select * from Members natural join Teammembers where canBeInMultipleTeam is true and team_id = ${id}
  ) as un ) as ub on m.member_id = ub.member_id
  where ub.member_id is null;`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

// POST

dataRouter.post('/skill_links', (req, res) => {
  const skillId = parseInt(req.body.skillId);
  const linkId = parseInt(req.body.linkId);
  db.query<RowDataPacket[]>(`INSERT INTO skill_links (skill_id, skill_type, skill_link, skill_linkname) VALUES (${skillId}, ${linkId}, "", "");`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.post('/category/skills', (req, res) => {
  const categoryId = parseInt(req.body.categoryId);
  db.query<RowDataPacket[]>(`INSERT INTO skills (skill_id, skill_name, category_id) VALUES (null, "", ${categoryId});`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.post('/category_links', (req, res) => {
  const categoryId = parseInt(req.body.categoryId);
  db.query<RowDataPacket[]>(`INSERT INTO categories_links (categorylinks_id, category_id, category_link, category_linkname) VALUES (null,${categoryId}, "","");`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.post('/teams', (req, res) => {
  const newTeam = req.body.newTeam;
  db.query<RowDataPacket[]>(`INSERT INTO teams (team_id, team_name) VALUES (null, "${newTeam}");`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.post('/teams/members', (req, res) => {
  const memberId = req.body.memberId;
  const teamId = req.body.teamId;
  db.query<RowDataPacket[]>(`INSERT INTO teammembers (member_id, team_id) VALUES (${memberId}, ${teamId});`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.post('/member/skill', (req, res) => {
  const member_id = parseInt(req.body.memberId);
  const skill_id = parseInt(req.body.skillId);
  const skill_level = parseInt(req.body.skillLevel);
  db.query<RowDataPacket[]>(`INSERT INTO Memberskills (member_id, skill_id, skill_level) values (${member_id},${skill_id},${skill_level});`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json({});
    }
  });
});

// UPDATE
dataRouter.put('/team_name', (req, res) => {
  const team_id = parseInt(req.body.teamId);
  const team_name = req.body.teamName;
  db.query<RowDataPacket[]>(`UPDATE teams SET team_name = "${team_name}" WHERE team_id = ${team_id}; `, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.put('/member/skill', (req, res) => {
  const member_id = parseInt(req.body.memberId);
  const skill_id = parseInt(req.body.skillId);
  const skill_level = parseInt(req.body.skillLevel);
  db.query<RowDataPacket[]>(`UPDATE MemberSkills SET skill_level = "${skill_level}" WHERE member_id = ${member_id} and skill_id = ${skill_id}; `, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json({message: 'Success!'});
    }
  });
});

dataRouter.put('/member/profile/name', (req, res) => {
  const member_id = parseInt(req.body.memberId);
  const member_name = req.body.memberName;
  
  db.query<RowDataPacket[]>(`UPDATE Members SET member_name = "${member_name}" WHERE member_id = ${member_id};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json({message: 'Success!'});
    }
  });
});

dataRouter.put('/member/profile/teamsname', (req, res) => {
  const member_id = parseInt(req.body.memberId);
  const teams_name = req.body.memberTeamsName;
  
  db.query<RowDataPacket[]>(`UPDATE Members SET teams_name = "${teams_name}" WHERE member_id = ${member_id};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json({message: 'Success!'});
    }
  });
});

dataRouter.put('/member/profile/email', (req, res) => {
  const member_id = parseInt(req.body.memberId);
  const email = req.body.memberEmail;
  db.query<RowDataPacket[]>(`UPDATE Members SET email = "${email}" WHERE member_id = ${member_id};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json({message: 'Success!'});
    }
  });
});

dataRouter.put('/member/profile/roles', (req, res) => {
  const member_id = parseInt(req.body.memberId);
  const roles = req.body.memberRoles;
  db.query<RowDataPacket[]>(`UPDATE Members SET roles = "${roles}" WHERE member_id = ${member_id};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json({message: 'Success!'});
    }
  });
});

dataRouter.put('/member/profile/about', (req, res) => {
  const member_id = parseInt(req.body.memberId);
  const about = req.body.memberAbout;
  db.query<RowDataPacket[]>(`UPDATE Members SET about = "${about}" WHERE member_id = ${member_id};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json({message: 'Success!'});
    }
  });
});

dataRouter.put('/category/description', (req, res) => {
  const category_id = parseInt(req.body.categoryId);
  const description = req.body.categoryDescription;
  
  db.query<RowDataPacket[]>(`UPDATE categories SET category_description = "${description}" WHERE category_id = ${category_id};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json({message: 'Success!'});
    }
  });
});

dataRouter.put('/category/linkname', (req, res) => {
  const linkId = parseInt(req.body.linkId);
  const linkName = req.body.categoryLinkName;
  
  db.query<RowDataPacket[]>(`UPDATE categories_links SET category_linkname = "${linkName}" WHERE categorylinks_id = ${linkId};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json({message: 'Success!'});
    }
  });
});

dataRouter.put('/category/link', (req, res) => {
  const linkId = parseInt(req.body.linkId);
  const link = req.body.categoryLink;  
  db.query<RowDataPacket[]>(`UPDATE categories_links SET category_link = "${link}" WHERE categorylinks_id = ${linkId};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json({message: 'Success!'});
    }
  });
});


// DELETE
dataRouter.delete('/skill_links', (req, res) => {
  const skill_link_id = parseInt(req.body.linkId);
  db.query<RowDataPacket[]>(`DELETE FROM skill_links WHERE skill_links_id = ${skill_link_id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.delete('/category/skills', (req, res) => {
  const skill_id = parseInt(req.body.skillId);
  db.query<RowDataPacket[]>(`DELETE FROM skills WHERE skill_id = ${skill_id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.delete('/category_links', (req, res) => {
  const categoryLinkId = parseInt(req.body.categoryLinkId);
  db.query<RowDataPacket[]>(`DELETE FROM categories_links WHERE categorylinks_id = ${categoryLinkId}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.delete('/teams', (req, res) => {
  const teamId = parseInt(req.body.teamId);
  db.query<RowDataPacket[]>(`DELETE FROM teams WHERE team_id = ${teamId};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.delete('/teammembers', (req, res) => {
  const teamId = parseInt(req.body.teamId);
  db.query<RowDataPacket[]>(`DELETE FROM teammembers where team_id = ${teamId};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.delete('/teams/member', (req, res) => {
  const teamId = parseInt(req.body.teamId);
  const memberId = parseInt(req.body.memberId);
  db.query<RowDataPacket[]>(`DELETE FROM teammembers where team_id = ${teamId} AND member_id = ${memberId};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

dataRouter.delete('/member/skill', (req, res) => {
  const skillId = parseInt(req.body.skillId);
  const memberId = parseInt(req.body.memberId);
  db.query<RowDataPacket[]>(`DELETE FROM MemberSkills where skill_id = ${skillId} AND member_id = ${memberId};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

// FUNCTIONS
function flattenSkills(SqlResultArray: RowDataPacket[]) {
  const members_by_id = new Map();
  for(let i=0; i < SqlResultArray.length; i++){
    const member = members_by_id.get(SqlResultArray[i].member_id);
    if(!member){
      members_by_id.set(SqlResultArray[i].member_id, {
        memberId: SqlResultArray[i].member_id,
        memberName: SqlResultArray[i].member_name,
        skills: [{
          skillName: SqlResultArray[i].skill_name,
          skillId: SqlResultArray[i].skill_id,
          skillLevel: SqlResultArray[i].skill_level
        }],
        teamId: SqlResultArray[i].team_id,
        teamName: SqlResultArray[i].team_name ? SqlResultArray[i].team_name : 'Several teams'
      });
    }else{

      member.skills = [
        ...member.skills,
        {
          skillName: SqlResultArray[i].skill_name,
          skillId: SqlResultArray[i].skill_id,
          skillLevel: SqlResultArray[i].skill_level
        },
      ];
    }
  }
  return Array.from(members_by_id.values());
}

function flattenCategories(SqlResultArray: RowDataPacket[]){
  const categories_by_id = new Map();
  for(let i=0; i < SqlResultArray.length; i++){
    const category = categories_by_id.get(SqlResultArray[i].category_id);
    if(!category){
      categories_by_id.set(SqlResultArray[i].category_id, {
        categoryId: SqlResultArray[i].category_id,
        categoryName: SqlResultArray[i].category_name,
        categoryImage: SqlResultArray[i].category_image,
        categoryDescription: SqlResultArray[i].category_description,
        skills: [{
          skillId: SqlResultArray[i].skill_id,
          skillName: SqlResultArray[i].skill_name
        }]
      });
    }else{
      category.skills = [
        ...category.skills,
        {
          skillId: SqlResultArray[i].skill_id,
          skillName: SqlResultArray[i].skill_name
        }
      ]
    }
  }
  return Array.from(categories_by_id.values());
}

app.use("/api", auth.authGuard.bind(auth), dataRouter);

app.listen(port, () => {
  console.log(`A szerver fut a ${port}-es porton`);
});