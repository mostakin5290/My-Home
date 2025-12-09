import React, { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';

const TodoList = ({ todos, setTodos }) => {
    const [todoInput, setTodoInput] = useState('');

    const handleAddTodo = () => {
        if (todoInput) {
            setTodos([...todos, { id: Date.now(), text: todoInput, completed: false }]);
            setTodoInput('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <div className="glass-panel rounded-3xl p-5 flex flex-col max-h-[400px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">Tasks</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-3">
                {todos.map(t => (
                    <div key={t.id} className="flex items-start gap-3 group">
                        <button
                            onClick={() => toggleTodo(t.id)}
                            className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${t.completed
                                    ? `bg-white/80 border-transparent text-black`
                                    : 'border-white/30 hover:border-white'
                                }`}
                        >
                            {t.completed && <Check size={10} strokeWidth={4} />}
                        </button>
                        <span className={`flex-1 text-sm leading-tight ${t.completed ? 'line-through text-white/30' : 'text-white/90'
                            }`}>
                            {t.text}
                        </span>
                        <button
                            onClick={() => deleteTodo(t.id)}
                            className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
                {todos.length === 0 && (
                    <div className="text-white/20 text-xs text-center py-4">No tasks yet</div>
                )}
            </div>
            <input
                type="text"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                placeholder="+ Add task"
                className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:bg-white/10 placeholder-white/30 transition-all"
            />
        </div>
    );
};

export default TodoList;
