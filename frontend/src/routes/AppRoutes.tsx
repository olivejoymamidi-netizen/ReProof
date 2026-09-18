import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

import { Login } from '../pages/Login';
import { Intro } from '../pages/Intro';
import { Dashboard } from '../pages/Dashboard';
import { Domains } from '../pages/Domains';
import { Assessment } from '../pages/Assessment';
import { Submission } from '../pages/Submission';
import { SkillGap } from '../pages/SkillGap';
import { Practice } from '../pages/Practice';
import { ChangedCondition } from '../pages/ChangedCondition';
import { ReProof } from '../pages/ReProof';
import { Result } from '../pages/Result';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public Gateway / Story Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/intro" element={<Intro />} />

        {/* Protected Routes — Require authentication, redirect to /login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/submission" element={<Submission />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/changed-condition" element={<ChangedCondition />} />
          <Route path="/reproof" element={<ReProof />} />
          <Route path="/re-proof" element={<ReProof />} />
          <Route path="/result" element={<Result />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

