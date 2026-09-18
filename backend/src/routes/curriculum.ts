import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

/**
 * GET /api/curriculum
 * Returns all 5 domains, 15 skills, and 45 competency levels in a hierarchical structure.
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, name, description')
      .order('id');

    if (coursesError) {
      res.status(500).json({ success: false, message: coursesError.message });
      return;
    }

    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('id, course_id, name, description')
      .order('id');

    if (skillsError) {
      res.status(500).json({ success: false, message: skillsError.message });
      return;
    }

    const { data: levels, error: levelsError } = await supabase
      .from('skill_levels')
      .select('id, skill_id, level_number, title, description, difficulty')
      .order('level_number');

    if (levelsError) {
      res.status(500).json({ success: false, message: levelsError.message });
      return;
    }

    // Assemble hierarchical Domain -> Skill -> Level data
    const curriculum = courses.map((course, idx) => {
      const courseSkills = skills
        .filter((s) => s.course_id === course.id)
        .map((skill) => {
          const skillLevels = levels
            .filter((lvl) => lvl.skill_id === skill.id)
            .sort((a, b) => a.level_number - b.level_number);

          const slug = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return {
            id: skill.id,
            name: skill.name,
            slug,
            description: skill.description,
            levels: skillLevels,
          };
        });

      const slug = course.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const code = String(idx + 1).padStart(2, '0');

      return {
        id: course.id,
        code,
        name: course.name,
        slug,
        description: course.description,
        skills: courseSkills,
      };
    });

    res.status(200).json({
      success: true,
      data: curriculum,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error while fetching curriculum',
    });
  }
});

/**
 * GET /api/curriculum/:domainId
 * Returns a specific domain with its skills and levels.
 */
router.get('/:domainId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { domainId } = req.params;

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, name, description')
      .eq('id', domainId)
      .maybeSingle();

    if (courseError || !course) {
      res.status(404).json({ success: false, message: 'Domain not found' });
      return;
    }

    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('id, course_id, name, description')
      .eq('course_id', course.id)
      .order('id');

    if (skillsError) {
      res.status(500).json({ success: false, message: skillsError.message });
      return;
    }

    const skillIds = skills.map((s) => s.id);
    const { data: levels, error: levelsError } = await supabase
      .from('skill_levels')
      .select('id, skill_id, level_number, title, description, difficulty')
      .in('skill_id', skillIds)
      .order('level_number');

    if (levelsError) {
      res.status(500).json({ success: false, message: levelsError.message });
      return;
    }

    const courseSkills = skills.map((skill) => {
      const skillLevels = levels
        .filter((lvl) => lvl.skill_id === skill.id)
        .sort((a, b) => a.level_number - b.level_number);

      const slug = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        id: skill.id,
        name: skill.name,
        slug,
        description: skill.description,
        levels: skillLevels,
      };
    });

    const slug = course.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    res.status(200).json({
      success: true,
      data: {
        id: course.id,
        name: course.name,
        slug,
        description: course.description,
        skills: courseSkills,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
});

export default router;
