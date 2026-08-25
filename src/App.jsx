import React, { useState, useEffect } from 'react';
import { useStorage } from './hooks/useStorage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/Mobile/BottomNav';
import QuickSearchModal from './components/QuickSearchModal';
import PomodoroModal from './components/Pomodoro/PomodoroModal';
import AuthModal from './components/Auth/AuthModal';

// Views
import DashboardView from './components/Dashboard/DashboardView';
import NotesView from './components/Notes/NotesView';
import FinanceView from './components/Finance/FinanceView';
import BooksView from './components/Books/BooksView';
import TasksView from './components/Tasks/TasksView';
import CalendarView from './components/Calendar/CalendarView';
import HabitsView from './components/Habits/HabitsView';
import JournalView from './components/Journal/JournalView';
import SettingsView from './components/Settings/SettingsView';
import ProductivityView from './components/Productivity/ProductivityView';
import JarvisWidget from './components/Jarvis/JarvisWidget';

export default function App() {
  const {
    data,
    setData,
    updateSection,
    clearWorkspaceToEmpty,
    resetToSampleData,
    importFullData,
    user,
    isLoggedIn,
    authLoading,
    isSyncing,
    lastSynced,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    resetPassword,
    syncToCloudNow,
    syncFromCloudNow
  } = useStorage();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(data.notes?.[0]?.id || null);
  const [jarvisActionPrompt, setJarvisActionPrompt] = useState(null);

  // Global Pomodoro State
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState('focus');
  const [pomodoroSessions, setPomodoroSessions] = useState(0);

  // Background Pomodoro Interval
  useEffect(() => {
    let interval = null;
    if (pomodoroActive && pomodoroTimeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTimeLeft === 0) {
      setPomodoroActive(false);
      if (pomodoroMode === 'focus') {
        setPomodoroSessions((s) => s + 1);
        setPomodoroMode('shortBreak');
        setPomodoroTimeLeft(5 * 60);
      } else {
        setPomodoroMode('focus');
        setPomodoroTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTimeLeft, pomodoroMode]);

  // Sync dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickAction = (actionType) => {
    if (actionType === 'new-note') {
      setActiveTab('notes');
    }
  };

  // Badge calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.slice(0, 7);
  const pendingTasksCount = (data.tasks || []).filter((t) => t.status !== 'done').length;
  const booksThisMonthCount = (data.books || []).filter(
    (b) => b.status === 'completed' && (b.monthRead === currentMonthStr || b.finishDate?.startsWith(currentMonthStr))
  ).length;

  return (
    <div
      className={'flex h-screen w-screen overflow-hidden font-sans select-none ' + (
        darkMode ? 'bg-[#0f1015] text-gray-100 dark' : 'bg-gray-100 text-gray-800'
      )}
    >
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenPomodoro={() => setIsPomodoroOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        user={user}
        isLoggedIn={isLoggedIn}
        isSyncing={isSyncing}
        pomodoroActive={pomodoroActive}
        pomodoroTimeLeft={pomodoroTimeLeft}
        notesCount={(data.notes || []).length}
        tasksPendingCount={pendingTasksCount}
        booksMonthCount={booksThisMonthCount}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header
          activeTab={activeTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenPomodoro={() => setIsPomodoroOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          user={user}
          isLoggedIn={isLoggedIn}
          isSyncing={isSyncing}
          onQuickAction={handleQuickAction}
          darkMode={darkMode}
        />

        <main className="flex-1 overflow-y-auto bg-inherit pb-20 md:pb-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              data={data}
              onNavigate={(tab) => setActiveTab(tab)}
              onUpdateTasks={(tasks) => updateSection('tasks', tasks)}
              onUpdateHabits={(habits) => updateSection('habits', habits)}
              onOpenPomodoro={() => setIsPomodoroOpen(true)}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView
              notes={data.notes || []}
              onUpdateNotes={(notes) => updateSection('notes', notes)}
              selectedNoteId={selectedNoteId}
              onSelectNote={(id) => setSelectedNoteId(id)}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceView
              data={data}
              onUpdateTransactions={(txs) => updateSection('transactions', txs)}
              onUpdateBills={(bills) => updateSection('bills', bills)}
              onUpdateDebts={(debts) => updateSection('debts', debts)}
              onUpdateCreditCards={(cards) => updateSection('creditCards', cards)}
              onUpdateFinanceProfile={(profile) => updateSection('financeProfile', profile)}
              onUpdateGoals={(goals) => updateSection('financeGoals', goals)}
              onAskJarvis={(prompt) => setJarvisActionPrompt(prompt)}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'books' && (
            <BooksView
              data={data}
              onUpdateBooks={(books) => updateSection('books', books)}
              onUpdateGoal={(goal) => updateSection('readingGoalYear', goal)}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={data.tasks || []}
              onUpdateTasks={(tasks) => updateSection('tasks', tasks)}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              events={data.calendarEvents || []}
              tasks={data.tasks || []}
              weeklySchedule={data.weeklySchedule || []}
              onUpdateEvents={(evs) => updateSection('calendarEvents', evs)}
              onUpdateWeeklySchedule={(sched) => updateSection('weeklySchedule', sched)}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'habits' && (
            <HabitsView
              habits={data.habits || []}
              onUpdateHabits={(habits) => updateSection('habits', habits)}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'journal' && (
            <JournalView
              entries={data.journalEntries || []}
              onUpdateEntries={(entries) => updateSection('journalEntries', entries)}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              data={data}
              updateSection={updateSection}
              onResetData={resetToSampleData}
              onClearData={clearWorkspaceToEmpty}
              onImportData={importFullData}
              user={user}
              isLoggedIn={isLoggedIn}
              isSyncing={isSyncing}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}

          {activeTab === 'productivity' && (
            <ProductivityView darkMode={darkMode} />
          )}
        </main>
      </div>

      <JarvisWidget 
        data={data} 
        updateSection={updateSection} 
        darkMode={darkMode} 
        actionPrompt={jarvisActionPrompt}
        onClearActionPrompt={() => setJarvisActionPrompt(null)}
      />

      {/* Global Quick Search Spotlight Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        data={data}
        onNavigate={(tab) => {
          if (tab) setActiveTab(tab);
        }}
        onSelectNote={(id) => setSelectedNoteId(id)}
        darkMode={darkMode}
      />

      {/* Global Pomodoro Timer Modal */}
      <PomodoroModal
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        darkMode={darkMode}
        timeLeft={pomodoroTimeLeft}
        setTimeLeft={setPomodoroTimeLeft}
        isActive={pomodoroActive}
        setIsActive={setPomodoroActive}
        mode={pomodoroMode}
        setMode={setPomodoroMode}
        sessionsCompleted={pomodoroSessions}
        setSessionsCompleted={setPomodoroSessions}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        darkMode={darkMode}
        notesCount={(data.notes || []).length}
        tasksPendingCount={pendingTasksCount}
      />

      {/* Global Auth & Cloud Sync Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        isLoggedIn={isLoggedIn}
        isSyncing={isSyncing}
        lastSynced={lastSynced}
        loginWithGoogle={loginWithGoogle}
        loginWithEmail={loginWithEmail}
        registerWithEmail={registerWithEmail}
        logout={logout}
        resetPassword={resetPassword}
        syncToCloudNow={syncToCloudNow}
        darkMode={darkMode}
      />
    </div>
  );
}
