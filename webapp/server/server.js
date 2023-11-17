const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Adatbázis kapcsolat konfigurációja
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'U7zHJki87@',
  database: 'evoskills_database',
});

// Kapcsolat tesztelése
db.connect((err) => {
  if (err) {
    console.error('Hiba a MySQL kapcsolódás során: ' + err.stack);
    return;
  }
  console.log('MySQL kapcsolat sikeresen létrehozva');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`A szerver fut a ${port}-es porton`);
});

// REST API kérések

// GET
app.get('/skills', (req, res) => {
  db.query('SELECT skill_name,skill_id FROM Skills ORDER by skill_name ASC', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      const transformed = results.map((skill) => ({skillId: skill.skill_id, skillName: skill.skill_name}));
      res.status(200).json(transformed);
    }
  });
});

app.get('/category', (req, res) => {
  db.query(`Select skill_id,skill_name,Skills.category_id,category_name, category_image,category_description
    from Skills,Categories
    Where Skills.category_id = Categories.category_id`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(flattenCategories(results));
    }
  });
});

app.get('/category/skills/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.query(`SELECT skill_links_id,skill_type,skill_link,skill_linkname FROM skill_links WHERE skill_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/category/skills', (req, res) => {
  db.query(`SELECT * FROM skills`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/category_names', (req, res) => {
  const id = parseInt(req.params.id);
  db.query(`SELECT category_name,category_id FROM categories`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/category/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.query(`SELECT * from skills where category_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/members', (req, res) => {
  db.query(`select member_name,Members.member_id,team_name
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

app.get('/memberskills', (req, res) => {
  db.query('SELECT * FROM MemberSkills', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/members/all', (req, res) => {
  db.query(`SELECT Members.member_id,member_name,skill_name,Skills.skill_id,skill_level,Teams.team_id,team_name
  FROM teammembers, Members 
  left join MemberSkills on Members.member_id = MemberSkills.member_id
  left join Skills on Skills.skill_id = MemberSkills.skill_id
  ,Teams WHERE Members.member_id = teammembers.member_id and Teams.team_id = teammembers.team_id;`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {

      res.status(200).json(flattenSkills(results));
    }
  });
});

app.get('/members/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.query(`select member_name,email,roles,teams_name,about FROM Members WHERE member_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

app.get('/members/:id/skills', (req, res) => {
  const id = parseInt(req.params.id);
  db.query(`select skill_name,skills.skill_id,skill_level from skills,memberskills where skills.skill_id = memberskills.skill_id and member_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/teams/:id/members', (req, res) => {
  const id = parseInt(req.params.id);
  db.query(`select member_name
  from Members,Teammembers
  Where Members.member_id = teammembers.member_id and team_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/teams/:id/members/skills', (req, res) => {
  const id = parseInt(req.params.id);
  db.query(`SELECT Members.member_id,member_name,skill_name,Skills.skill_id,skill_level,Teams.team_id,team_name 
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

app.get('/teams/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.query(`SELECT team_name FROM Teams WHERE team_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results[0].team_name);
    }
  });
});

app.get('/teams', (req, res) => {
  db.query('SELECT * FROM Teams', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/category/skills/members/:id', (req, res) => {
  const id = parseInt(req.params.id);  
  db.query(`Select member_name,Members.member_id, skill_level From members, memberskills Where Members.member_id = memberskills.member_id and skill_level >= 3 and skill_id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/category_links/:id', (req, res) => {
  const id = parseInt(req.params.id);  
  db.query(`select categorylinks_id, category_link, category_linkname from categories_links where category_id = ${id};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/teams/:id/members/add', (req, res) => {
  const id = parseInt(req.params.id);  
  db.query(`select m.member_id, m.member_name from Members as m left join
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
app.post('/skill_links', (req, res) => {
  const skillId = parseInt(req.body.skillId);
  const linkId = parseInt(req.body.linkId);
  db.query(`INSERT INTO skill_links (skill_id, skill_type, skill_link, skill_linkname) VALUES (${skillId}, ${linkId}, "", "");`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/category/skills', (req, res) => {
  const categoryId = parseInt(req.body.categoryId);
  db.query(`INSERT INTO skills (skill_id, skill_name, category_id) VALUES (null, "", ${categoryId});`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/category_links', (req, res) => {
  const categoryId = parseInt(req.body.categoryId);
  db.query(`INSERT INTO categories_links (categorylinks_id, category_id, category_link, category_linkname) VALUES (null,${categoryId}, "","");`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/teams', (req, res) => {
  const newTeam = req.body.newTeam;
  db.query(`INSERT INTO teams (team_id, team_name) VALUES (null, "${newTeam}");`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/teams/members', (req, res) => {
  const memberId = req.body.memberId;
  const teamId = req.body.teamId;
  db.query(`INSERT INTO teammembers (member_id, team_id) VALUES (${memberId}, ${teamId});`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/member/skill', (req, res) => {
  const member_id = parseInt(req.body.memberId);
  const skill_id = parseInt(req.body.skillId);
  const skill_level = parseInt(req.body.skillLevel);
  db.query(`INSERT INTO Memberskills (member_id, skill_id, skill_level) values (${member_id},${skill_id},${skill_level});`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

// UPDATE
app.put('/team_name', (req, res) => {
  const team_id = parseInt(req.body.teamId);
  const team_name = req.body.teamName;
  db.query(`UPDATE teams SET team_name = "${team_name}" WHERE team_id = ${team_id}; `, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.put('/member/skill', (req, res) => {
  const member_id = parseInt(req.body.memberId);
  const skill_id = parseInt(req.body.skillId);
  const skill_level = parseInt(req.body.skillLevel);
  db.query(`UPDATE MemberSkills SET skill_level = "${skill_level}" WHERE member_id = ${member_id} and skill_id = ${skill_id}; `, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

// DELETE
app.delete('/skill_links', (req, res) => {
  const skill_link_id = parseInt(req.body.linkId);
  db.query(`DELETE FROM skill_links WHERE skill_links_id = ${skill_link_id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.delete('/category/skills', (req, res) => {
  const skill_id = parseInt(req.body.skillId);
  db.query(`DELETE FROM skills WHERE skill_id = ${skill_id}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.delete('/category_links', (req, res) => {
  const categoryLinkId = parseInt(req.body.categoryLinkId);
  db.query(`DELETE FROM categories_links WHERE categorylinks_id = ${categoryLinkId}`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.delete('/teams', (req, res) => {
  const teamId = parseInt(req.body.teamId);
  db.query(`DELETE FROM teams WHERE team_id = ${teamId};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.delete('/teammembers', (req, res) => {
  const teamId = parseInt(req.body.teamId);
  db.query(`DELETE FROM teammembers where team_id = ${teamId};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.delete('/teams/member', (req, res) => {
  const teamId = parseInt(req.body.teamId);
  const memberId = parseInt(req.body.memberId);
  db.query(`DELETE FROM teammembers where team_id = ${teamId} AND member_id = ${memberId};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.delete('/member/skill', (req, res) => {
  const skillId = parseInt(req.body.skillId);
  const memberId = parseInt(req.body.memberId);
  console.log("Minden király");
  db.query(`DELETE FROM MemberSkills where skill_id = ${skillId} AND member_id = ${memberId};`, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
    } else {
      res.status(200).json(results);
    }
  });
});

// FUNCTIONS
function flattenSkills(SqlResultArray) {
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
        teamName: SqlResultArray[i].team_name
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

function flattenCategories(SqlResultArray){
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

// app.get('/', (req, res) => {
//     res.send("Hello World!");
// });

// app.get('/api/users', (req, res) => {
//     getUsers((err, results) => {
//       if (err) {
//         res.status(500).json({ error: 'Hiba történt az adatlekérdezés során' });
//         return;
//       }
//       res.json(results);
//     });
// });  
  
// const port = 3000;
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });



// // Kapcsolat létrehozása
// const connection = mysql.createConnection(dbConfig);



// // getMembers
// const getMembers = (callback) => {
//     const sql = 'USE evoskills_database';
//     connection.query(sql, (err, results) => {
//       if (err) {
//         return callback(err, null);
//       }
//       return callback(null, results);
//     });
// };

// console.log(getMembers);