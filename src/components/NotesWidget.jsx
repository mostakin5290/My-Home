import React, { useState } from 'react';
import { FileText, Copy, Check, Trash2 } from 'lucide-react';
import { useStickyState } from '../hooks/useStickyState';

const NotesWidget = () => {
    const [notes, setNotes] = useStickyState('', 'scratchpad_notes');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!notes) return;
        navigator.clipboard.writeText(notes);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const handleClear = () => {
        if (notes && window.confirm('Clear all notes?')) {
            setNotes('');
        }
    };

    const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
    const charCount = notes.length;

    return (
        <div className="glass-panel p-5 rounded-3xl flex-1 flex flex-col min-h-[220px] select-none transition-all duration-300">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70">
                    <FileText size={14} className="text-white/60" />
                    <span>Quick Notes</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={handleCopy}
                        title="Copy note"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                    <button
                        onClick={handleClear}
                        title="Clear notes"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>

            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full flex-1 bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-white/90 placeholder-white/25 custom-scrollbar font-sans select-text"
                placeholder="Jot down quick thoughts, ideas, or links (auto-saved)..."
            ></textarea>

            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-mono">
                <span>{wordCount} words · {charCount} chars</span>
                <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Saved
                </span>
            </div>
        </div>
    );
};

export default React.memo(NotesWidget);
