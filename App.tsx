
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Layers, 
  BarChart3, 
  Settings, 
  Bell, 
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ListTodo,
  Loader2
} from 'lucide-react';
import { Task, ColumnStatus, Priority, KanbanState } from './types';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import { generateTasksFromProject } from './services/geminiService';

const STORAGE_KEY = 'zenkanban_pro_state';

const INITIAL_STATE: KanbanState = {
  projectName: "Marketing Campaign Q4",
  tasks: [
    {
      id: '1',
      title: 'Design high-fidelity mockups',
      description: 'Create Figma prototypes for the new landing page and user dashboard.',
      status: ColumnStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      createdAt: Date.now() - 86400000 * 2,
      tags: ['Design']
    },
    {
      id: '2',
      title: 'Refactor auth service',
      description: 'Implement JWT refresh tokens and secure cookie storage for enhanced security.',
      status: ColumnStatus.TODO,
      priority: Priority.URGENT,
      createdAt: Date.now() - 86400000,
      tags: ['Dev']
    },
    {
      id: '3',
      title: 'Monthly newsletter copy',
      description: 'Draft the content for the October newsletter focusing on the new features.',
      status: ColumnStatus.DONE,
      priority: Priority.LOW,
      createdAt: Date.now() - 86400000 * 5,
      tags: ['Content']
    }
  ]
};

const App: React.FC = () => {
  const [state, setState] = useState<KanbanState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('board');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addTask = useCallback((taskData: { title: string; description: string; priority: Priority; status: ColumnStatus }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...taskData,
      createdAt: Date.now(),
      tags: []
    };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: ColumnStatus) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  }, []);

  const handleAISuggestions = async () => {
    const prompt = window.prompt("Briefly describe your project/goal to get AI-generated tasks:", state.projectName);
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const suggestedTasks = await generateTasksFromProject(prompt);
      const newTasks: Task[] = suggestedTasks.map((t: any) => ({
        id: crypto.randomUUID(),
        title: t.title,
        description: t.description,
        priority: t.priority as Priority,
        status: ColumnStatus.BACKLOG,
        createdAt: Date.now(),
        tags: ['AI']
      }));
      setState(prev => ({ ...prev, tasks: [...prev.tasks, ...newTasks] }));
    } catch (err) {
      alert("AI task generation failed. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredTasks = state.tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTaskCount = (status: ColumnStatus) => filteredTasks.filter(t => t.status === status).length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col p-6 space-y-8 sticky top-0 h-screen">
        <div className="flex items-center space-x-2 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Layers size={24} />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">ZenKanban</span>
        </div>

        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setActiveTab('board')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'board' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            <span>Project Board</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
            <Bell size={20} />
            <span>Notifications</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-slate-100 space-y-1">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-4 md:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{state.projectName}</h1>
            <p className="text-slate-400 text-sm flex items-center">
              <Clock size={14} className="mr-1" /> Updated just now
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm outline-none"
              />
            </div>

            <button
              onClick={handleAISuggestions}
              disabled={isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              <span className="hidden sm:inline">AI Helper</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-200 flex items-center space-x-2 hover:bg-slate-800 active:scale-[0.98] transition-all"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </header>

        {/* Board View */}
        <div className="flex-1 overflow-x-auto p-4 md:p-8">
          <div className="flex space-x-6 min-h-full pb-8">
            {Object.values(ColumnStatus).map(status => (
              <div key={status} className="flex-shrink-0 w-80 flex flex-col">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center space-x-2">
                    <h2 className="font-bold text-slate-700 text-sm uppercase tracking-widest">{status}</h2>
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {getTaskCount(status)}
                    </span>
                  </div>
                  <button onClick={() => setIsModalOpen(true)} className="p-1 hover:bg-slate-200 rounded-md text-slate-400 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-4 flex-1">
                  {filteredTasks
                    .filter(t => t.status === status)
                    .map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onMove={moveTask} 
                        onDelete={deleteTask}
                      />
                    ))}
                  
                  {getTaskCount(status) === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl h-32 flex flex-col items-center justify-center p-4 text-center">
                      <ListTodo className="text-slate-300 mb-2" size={24} />
                      <span className="text-slate-400 text-[10px] font-medium uppercase tracking-tight">Empty Column</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addTask} 
      />
    </div>
  );
};

export default App;
