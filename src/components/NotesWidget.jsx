import React from 'react';

const NotesWidget = () => {
    return (
        <div className="glass-panel p-5 rounded-3xl flex-1 flex flex-col min-h-[200px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Notes</h3>
            <textarea
                className="w-full h-full bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-white/80 placeholder-white/20 custom-scrollbar"
                placeholder="Type something..."
            ></textarea>
        </div>
    );
};

export default NotesWidget;
