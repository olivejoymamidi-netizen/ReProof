import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  curriculumDomains,
  findDomain,
  findSkill,
} from '../data/curriculumData';
import type { DomainItem, SkillItem, CompetencyLevelItem } from '../types';

export const Domains: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Restore selection from URL search params, then localStorage, then default to first
  const initialDomainId =
    searchParams.get('domainId') ||
    localStorage.getItem('reproof_selected_domain') ||
    curriculumDomains[0].id;

  const initialDomain = findDomain(initialDomainId);

  const initialSkillId =
    searchParams.get('skillId') ||
    localStorage.getItem('reproof_selected_skill') ||
    initialDomain.skills?.[0]?.id ||
    '';

  const [selectedDomainId, setSelectedDomainId] = useState<string>(initialDomain.id);
  const [selectedSkillId, setSelectedSkillId] = useState<string>(initialSkillId);

  const activeDomain: DomainItem = findDomain(selectedDomainId);
  const activeSkills: SkillItem[] = activeDomain.skills || [];
  const activeSkill: SkillItem = findSkill(activeDomain.id, selectedSkillId);
  const activeLevels: CompetencyLevelItem[] = activeSkill.levels || [];

  // Sync state changes to URL and localStorage for seamless refresh resilience
  useEffect(() => {
    localStorage.setItem('reproof_selected_domain', activeDomain.id);
    if (activeSkill) {
      localStorage.setItem('reproof_selected_skill', activeSkill.id);
    }
    setSearchParams(
      {
        domainId: activeDomain.id,
        skillId: activeSkill?.id || '',
      },
      { replace: true }
    );
  }, [activeDomain.id, activeSkill?.id, setSearchParams]);

  const handleDomainSelect = (domain: DomainItem) => {
    setSelectedDomainId(domain.id);
    const firstSkill = domain.skills?.[0];
    if (firstSkill) {
      setSelectedSkillId(firstSkill.id);
    }
  };

  const handleSkillSelect = (skill: SkillItem) => {
    setSelectedSkillId(skill.id);
  };

  const handleStartAssessment = (level: CompetencyLevelItem) => {
    localStorage.setItem('reproof_selected_domain', activeDomain.id);
    localStorage.setItem('reproof_selected_skill', activeSkill.id);
    localStorage.setItem('reproof_selected_level', String(level.levelNumber));

    navigate(
      `/knowledge-check?domainId=${activeDomain.id}&skillId=${activeSkill.id}&levelId=${level.levelNumber}`
    );
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex flex-col justify-between bg-[#FAF9F6] text-graphite-900 pb-20">
      <main className="max-w-[1440px] mx-auto w-full px-6 sm:px-10 py-10 sm:py-14 flex flex-col justify-start space-y-12">
        {/* Header Intent Block */}
        <div className="pb-8 border-b border-ivory-300">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-graphite-500 uppercase mb-4">
            <span className="inline-block w-1.5 h-1.5 bg-cobalt-700"></span>
            <span>Competency Matrix // 3-Stage Assessment Entry</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.04em] text-graphite-900 uppercase leading-[0.95] mb-4">
            What do you want to prove?
          </h1>

          <p className="text-base sm:text-lg text-graphite-600 max-w-3xl font-normal leading-relaxed">
            Select a competency domain to reveal its targeted technical skills, then choose a calibrated benchmark level to launch your evaluation sandbox.
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-3 pt-6 font-mono text-[11px] uppercase tracking-wider text-graphite-500">
            <span className="text-cobalt-700 font-bold">01. Select Domain</span>
            <span>&rarr;</span>
            <span className={activeDomain ? 'text-cobalt-700 font-bold' : 'text-graphite-400'}>
              02. Select Skill ({activeSkills.length} Available)
            </span>
            <span>&rarr;</span>
            <span className={activeSkill ? 'text-cobalt-700 font-bold' : 'text-graphite-400'}>
              03. Select Level (3 Competencies)
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STAGE 1: The 5 Available Competency Domains */}
        {/* ------------------------------------------------------------- */}
        <section aria-label="Available Competency Domains">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-300 mb-4">
            <div className="font-mono text-xs uppercase tracking-widest text-graphite-500 font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-graphite-900 inline-block" />
              <span>STAGE 01 // 5 CORE DOMAINS</span>
            </div>
            <span className="font-mono text-[11px] text-graphite-400 uppercase">
              Click a domain to inspect skills
            </span>
          </div>

          <div
            className="border-t border-b border-ivory-300 divide-y divide-ivory-300 bg-white"
            id="domains-container"
          >
            {curriculumDomains.map((domain) => {
              const isSelected = domain.id === activeDomain.id;

              return (
                <div
                  key={domain.id}
                  onClick={() => handleDomainSelect(domain)}
                  className={`group cursor-pointer py-6 sm:py-7 px-5 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-150 relative ${
                    isSelected
                      ? 'bg-[#F2F1ED] border-l-4 border-cobalt-700'
                      : 'hover:bg-ivory-100 hover:translate-x-0.5 border-l-4 border-transparent'
                  }`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8 flex-1">
                    <span
                      className={`font-mono text-xs sm:text-sm font-bold tracking-wider ${
                        isSelected ? 'text-cobalt-700' : 'text-graphite-400 group-hover:text-cobalt-700'
                      }`}
                    >
                      {domain.code}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h2
                          className={`text-xl sm:text-2xl font-extrabold uppercase tracking-tight transition-colors ${
                            isSelected
                              ? 'text-cobalt-700'
                              : 'text-graphite-900 group-hover:text-cobalt-700'
                          }`}
                        >
                          {domain.name}
                        </h2>
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-ivory-200 text-graphite-600 border border-ivory-300 uppercase">
                          {domain.skills?.length || 3} SKILLS
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-graphite-600 font-normal leading-relaxed">
                        {domain.description}
                      </p>

                      <div className="text-[10px] font-mono text-graphite-400 pt-0.5">
                        Focus: {domain.subtopics}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                    <span
                      className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                        isSelected
                          ? 'text-cobalt-700'
                          : 'text-graphite-500 group-hover:text-cobalt-700'
                      }`}
                    >
                      <span>{isSelected ? 'Domain Active' : 'Select Domain'}</span>
                      <span className="text-sm">&rarr;</span>
                    </span>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-cobalt-700 bg-cobalt-700'
                          : 'border-graphite-400 group-hover:border-cobalt-700'
                      }`}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* STAGE 2: The 3 Skills belonging exclusively to active domain */}
        {/* ------------------------------------------------------------- */}
        <section
          id="skills-container"
          aria-label={`Skills for ${activeDomain.name}`}
          className="space-y-4 pt-2"
        >
          <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
            <div className="font-mono text-xs uppercase tracking-widest text-cobalt-700 font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-cobalt-700 inline-block" />
              <span>
                STAGE 02 // SKILLS FOR {activeDomain.name.toUpperCase()} (EXACTLY {activeSkills.length} SKILLS)
              </span>
            </div>
            <span className="font-mono text-[11px] text-graphite-500 uppercase">
              Active Domain: {activeDomain.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activeSkills.map((skill, idx) => {
              const isSkillSelected = skill.id === activeSkill.id;

              return (
                <div
                  key={skill.id}
                  onClick={() => handleSkillSelect(skill)}
                  className={`p-6 border transition-all duration-150 cursor-pointer flex flex-col justify-between rounded-[2px] relative ${
                    isSkillSelected
                      ? 'bg-white border-cobalt-700 shadow-sm ring-1 ring-cobalt-700'
                      : 'bg-white border-ivory-300 hover:border-graphite-400 hover:bg-ivory-50'
                  }`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSkillSelected}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cobalt-700">
                        SKILL 0{idx + 1}
                      </span>
                      {isSkillSelected && (
                        <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-cobalt-700 text-white font-semibold tracking-wider">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black uppercase text-graphite-900 tracking-tight">
                      {skill.name}
                    </h3>

                    <p className="text-xs text-graphite-600 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-ivory-200 flex items-center justify-between font-mono text-[10px]">
                    <span className="text-graphite-400 uppercase">3 COMPETENCY LEVELS</span>
                    <span
                      className={`font-bold uppercase tracking-wider ${
                        isSkillSelected ? 'text-cobalt-700' : 'text-graphite-700'
                      }`}
                    >
                      {isSkillSelected ? 'Selected ✓' : 'Select Skill →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* STAGE 3: The 3 Levels (Level 1, Level 2, Level 3) for skill */}
        {/* ------------------------------------------------------------- */}
        <section
          id="levels-container"
          aria-label={`Levels for ${activeSkill.name}`}
          className="space-y-5 pt-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
            <div className="font-mono text-xs uppercase tracking-widest text-graphite-900 font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-600 inline-block" />
              <span>
                STAGE 03 // COMPETENCY LEVELS FOR: {activeSkill.name.toUpperCase()}
              </span>
            </div>
            <span className="font-mono text-[11px] text-graphite-500 uppercase">
              {activeDomain.name} / {activeSkill.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeLevels.map((lvl) => {
              const difficultyBadgeClass =
                lvl.difficulty === 'Beginner'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : lvl.difficulty === 'Intermediate'
                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                  : 'bg-purple-50 text-purple-800 border-purple-300';

              return (
                <div
                  key={lvl.id}
                  className="p-7 bg-white border border-ivory-300 flex flex-col justify-between rounded-[2px] shadow-sm hover:border-graphite-700 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Level Meta Tag & Difficulty Indicator */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cobalt-700">
                        LEVEL 0{lvl.levelNumber}
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase px-2.5 py-0.5 border font-semibold tracking-wider ${difficultyBadgeClass}`}
                      >
                        {lvl.difficulty} Difficulty
                      </span>
                    </div>

                    {/* Level Name */}
                    <h4 className="text-xl font-extrabold uppercase tracking-tight text-graphite-900">
                      {lvl.title}
                    </h4>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-graphite-600 leading-relaxed">
                      {lvl.description}
                    </p>

                    <div className="pt-3 border-t border-ivory-200">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-graphite-500 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-cobalt-700" />
                        <span>Isolated Empirical Sandbox Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Start Assessment Action Button */}
                  <div className="pt-6 mt-6 border-t border-ivory-200">
                    <button
                      type="button"
                      onClick={() => handleStartAssessment(lvl)}
                      className="w-full py-3.5 px-4 bg-graphite-900 hover:bg-cobalt-700 text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-3 cursor-pointer rounded-[2px]"
                    >
                      <span>Start Knowledge Check</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
