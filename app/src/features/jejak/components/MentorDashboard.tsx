'use client';

import { useState } from 'react';
import { Header } from '@/components/layouts/Header';
import { Sidebar, SidebarItem } from '@/components/layouts/Sidebar';
import { LayoutDashboard, Users, BookOpen } from 'lucide-react';
import { MentorContent } from './MentorContent';
import { StudentContent } from './StudentContent';

export const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'mentoring' | 'achievements'>('mentoring');

  return (
    <div className="flex h-screen bg-semeru-50">
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          onClick={() => setActiveTab('mentoring')}
          isActive={activeTab === 'mentoring'}
        />
        <SidebarItem
          icon={<BookOpen className="h-5 w-5" />}
          label="My Achievements"
          onClick={() => setActiveTab('achievements')}
          isActive={activeTab === 'achievements'}
        />
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'mentoring' ? <MentorContent /> : <StudentContent />}
          </div>
        </main>
      </div>
    </div>
  );
};