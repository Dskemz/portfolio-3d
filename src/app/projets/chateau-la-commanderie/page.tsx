'use client';

import React from 'react';
import { Metadata } from 'next';
import HeroSection from '@/components/projects/ChateauLaCommanderie/HeroSection';
import GammeSection from '@/components/projects/ChateauLaCommanderie/GammeSection';
import TexturesSection from '@/components/projects/ChateauLaCommanderie/TexturesSection';
import TechBreakdownSection from '@/components/projects/ChateauLaCommanderie/TechBreakdownSection';
import PackshotsSection from '@/components/projects/ChateauLaCommanderie/PackshotsSection';
import ProjectFooter from '@/components/projects/ChateauLaCommanderie/ProjectFooter';

export default function ChateauLaCommanderiePage() {
  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Gamme Section */}
      <GammeSection />

      {/* Textures Section */}
      <TexturesSection />

      {/* Technical Breakdown Section */}
      <TechBreakdownSection />

      {/* Packshots Section */}
      <PackshotsSection />

      {/* Project Footer / Navigation */}
      <ProjectFooter />
    </div>
  );
}
