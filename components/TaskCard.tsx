
import React from 'react';
import { Task, Priority, ColumnStatus } from '../types';
import { MoreVertical, Calendar, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onMove: (taskId: string, newStatus: ColumnStatus) => void;
  onDelete: (taskId: string) => void;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.LOW: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case Priority.MEDIUM: return 'bg-blue-100 text-blue-700 border-blue-200';
    case Priority.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
    case Priority.URGENT: return 'bg-rose-100 text-rose-700 border-rose-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onMove, onDelete }) => {
  const statuses = Object.values(ColumnStatus);
  const currentIndex = statuses.indexOf(task.status);

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <button 
          onClick={() => onDelete(task.id)}
          className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <h3 className="text-slate-800 font-semibold text-sm mb-1 line-clamp-2">{task.title}</h3>
      <p className="text-slate-500 text-xs mb-4 line-clamp-3 leading-relaxed">{task.description}</p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
        <div className="flex items-center text-slate-400 space-x-1">
          <Calendar size={12} />
          <span className="text-[10px]">{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {currentIndex > 0 && (
            <button 
              onClick={() => onMove(task.id, statuses[currentIndex - 1])}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-500"
              title="Move Back"
            >
              <ChevronLeft size={14} />
            </button>
          )}
          {currentIndex < statuses.length - 1 && (
            <button 
              onClick={() => onMove(task.id, statuses[currentIndex + 1])}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-500"
              title="Move Forward"
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
