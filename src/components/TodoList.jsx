import React, { useState, useMemo } from 'react';
import { Check, Trash2, CheckCircle2, ListTodo, Plus, Filter } from 'lucide-react';

const TodoList = ({ todos, setTodos }) => {
    const [todoInput, setTodoInput] = useState('');
    const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

    const handleAddTodo = () => {
        const text = todoInput.trim();
        if (text) {
            setTodos([{ id: Date.now(), text, completed: false, createdAt: Date.now() }, ...todos]);
            setTodoInput('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    const clearCompleted = () => {
        setTodos(todos.filter(t => !t.completed));
    };

    const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);

    const filteredTodos = useMemo(() => {
        if (filter === 'active') return todos.filter(t => !t.completed);
        if (filter === 'completed') return todos.filter(t => t.completed);
        return todos;
    }, [todos, filter]);

    return (
        <div className="glass-panel rounded-3xl p-5 flex flex-col max-h-[420px] select-none transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <ListTodo size={15} className="text-white/70" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">Tasks</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                        {completedCount}/{todos.length}
                    </span>
                </div>

                {/* Filter / Clear completed */}
                <div className="flex items-center gap-1 text-[11px]">
                    {completedCount > 0 && (
                        <button
                            onClick={clearCompleted}
                            className="text-[10px] text-white/40 hover:text-rose-400 mr-1 transition-colors"
                            title="Clear all completed tasks"
                        >
                            Clear done
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 mb-2.5 bg-white/5 p-1 rounded-xl">
                {['all', 'active', 'completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-1 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${filter === f ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-3 pr-1">
                {filteredTodos.map(t => (
                    <div
                        key={t.id}
                        className={`flex items-center gap-3 p-2 rounded-xl transition-all group ${t.completed ? 'bg-white/5 opacity-60' : 'hover:bg-white/5'}`}
                    >
                        <button
                            onClick={() => toggleTodo(t.id)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${t.completed
                                ? 'bg-emerald-500 border-emerald-500 text-black shadow-sm'
                                : 'border-white/30 hover:border-white'
                                }`}
                        >
                            {t.completed && <Check size={12} strokeWidth={3} className="text-white" />}
                        </button>

                        <span className={`flex-1 text-xs leading-snug break-words font-medium ${t.completed ? 'line-through text-white/40' : 'text-white/90'
                            }`}>
                            {t.text}
                        </span>

                        <button
                            onClick={() => deleteTodo(t.id)}
                            title="Delete task"
                            className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-rose-400 p-1 transition-all"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                ))}

                {filteredTodos.length === 0 && (
                    <div className="text-white/30 text-xs text-center py-6 font-mono">
                        {filter === 'completed' ? 'No completed tasks' : filter === 'active' ? 'No active tasks' : 'No tasks yet. Enjoy your day!'}
                    </div>
                )}
            </div>

            {/* Add Task Input */}
            <div className="relative">
                <input
                    type="text"
                    value={todoInput}
                    onChange={(e) => setTodoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                    placeholder="+ Add a new task (Press Enter)..."
                    className="w-full bg-white/5 rounded-xl pl-3 pr-9 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:bg-white/10 border border-white/10 focus:border-white/25 transition-all"
                />
                <button
                    onClick={handleAddTodo}
                    disabled={!todoInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white disabled:opacity-20 transition-all p-1"
                >
                    <Plus size={14} />
                </button>
            </div>
        </div>
    );
};

export default React.memo(TodoList);
