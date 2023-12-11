import { QueryError, RowDataPacket } from "mysql2";

// FUNCTIONS
export function flattenSkills(SqlResultArray: RowDataPacket[]) {
    const members_by_id = new Map();
    for (let i = 0; i < SqlResultArray.length; i++) {
        const member = members_by_id.get(SqlResultArray[i].member_id);
        if (!member) {
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
        } else {

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

export function flattenCategories(SqlResultArray: RowDataPacket[]) {
    const categories_by_id = new Map();
    for (let i = 0; i < SqlResultArray.length; i++) {
        const category = categories_by_id.get(SqlResultArray[i].category_id);
        if (!category) {
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
        } else {
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

export function handleQueryResult(err: QueryError | null, res: any, results: RowDataPacket[]) {
    if (err) {
        res.status(500).json({ error: '' });
    } else {
        res.status(200).json(results);
    }
}

export function handleDataUpdateResult(err: QueryError | null, res: any) {
    if (err) {
        res.status(500).json({ error: 'Error during the query' });
    } else {
        res.status(200).json({ message: 'Success!' });
    }
}

export function handleTransformedResult(err: QueryError | null, res: any, results: RowDataPacket[]) {
    if (err) {
        res.status(500).json({ error: 'Error during the query' });
    } else {
        const transformed = results.map((skill) => ({ skillId: skill.skill_id, skillName: skill.skill_name }));
        res.status(200).json(transformed);
    }
}

export function handleSkillFlattenResult(err: QueryError | null, res: any, results: RowDataPacket[]) {
    if (err) {
        res.status(500).json({ error: 'Error during the query' });
    } else {
        res.status(200).json(flattenSkills(results));
    }
}

export function handleCategoryFlattenResult(err: QueryError | null, res: any, results: RowDataPacket[]) {
    if (err) {
        res.status(500).json({ error: 'Error during the query' });
    } else {
        res.status(200).json(flattenCategories(results));
    }
}

export function handleEmptyBracketsResult(err: QueryError | null, res: any) {
    if (err) {
        res.status(500).json({ error: 'Error during the query' });
    } else {
        res.status(200).json({});
    }
}

export function handleFirstSkillNameResult(err: QueryError | null, res: any, results: RowDataPacket[]) {
    if (err) {
        res.status(500).json({ error: 'Error during the query' });
    } else {
        res.status(200).json(results[0].skill_name);
    }
}

export function handleFirstResult(err: QueryError | null, res: any, results: RowDataPacket[]) {
    if (err) {
        res.status(500).json({ error: 'Error during the query' });
    } else {
        res.status(200).json(results[0]);
    }
}

export function handleFirstTeamNameResult(err: QueryError | null, res: any, results: RowDataPacket[]) {
    if (err) {
        res.status(500).json({ error: 'Error during the query' });
    } else {
        res.status(200).json(results[0].team_name);
    }
}