import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const QuickLinks = ({ links, setLinks, isZenMode }) => {
    const [addLinkModal, setAddLinkModal] = useState(false);
    const [newLinkData, setNewLinkData] = useState({ title: '', url: '' });

    const handleAddLink = () => {
        let url = newLinkData.url;
        if (!url.startsWith('http')) url = 'https://' + url;
        setLinks([...links, { id: Date.now(), title: newLinkData.title || 'Link', url }]);
        setAddLinkModal(false);
        setNewLinkData({ title: '', url: '' });
    };

    const handleDeleteLink = (e, id) => {
        e.preventDefault();
        setLinks(links.filter(l => l.id !== id));
    };

    return (
        <>
            <div className={`fixed bottom-8 flex gap-3 p-2 glass-panel rounded-2xl transition-all duration-500 ${isZenMode ? 'translate-y-32 opacity-0' : 'translate-y-0 opacity-100'}`}>
                {links.map(link => (
                    <a
                        key={link.id}
                        href={link.url}
                        className="relative group w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/20 hover:-translate-y-1 transition-all"
                    >
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                            alt=""
                            className="w-5 h-5 opacity-70 group-hover:opacity-100"
                        />
                        <button
                            onClick={(e) => handleDeleteLink(e, link.id)}
                            className="absolute -top-1 -right-1 bg-white/10 hover:bg-red-500 w-4 h-4 rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        >
                            ✕
                        </button>
                    </a>
                ))}
                <button
                    onClick={() => setAddLinkModal(true)}
                    className="w-10 h-10 rounded-xl border border-dashed border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all text-white/50 hover:text-white"
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* Add Link Modal */}
            {addLinkModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel p-6 rounded-2xl w-full max-w-sm bg-[#1a1a1a]">
                        <h3 className="font-bold mb-4">Add Shortcut</h3>
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-2 text-sm focus:outline-none"
                            autoFocus
                            value={newLinkData.title}
                            onChange={e => setNewLinkData({ ...newLinkData, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="URL"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-4 text-sm focus:outline-none"
                            value={newLinkData.url}
                            onChange={e => setNewLinkData({ ...newLinkData, url: e.target.value })}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setAddLinkModal(false)}
                                className="px-3 py-1.5 text-xs text-white/50 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddLink}
                                className="px-4 py-1.5 bg-white text-black rounded-lg text-xs font-bold"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickLinks;
