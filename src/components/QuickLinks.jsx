import React, { useState } from 'react';
import { Plus, Globe, X, ExternalLink, Sparkles, Rocket } from 'lucide-react';
import GoogleAppsModal from './GoogleAppsModal';

const POPULAR_SHORTCUTS = [
    { title: 'Google', url: 'https://google.com' },
    { title: 'GitHub', url: 'https://github.com' },
    { title: 'ChatGPT', url: 'https://chatgpt.com' },
    { title: 'YouTube', url: 'https://youtube.com' },
    { title: 'Reddit', url: 'https://reddit.com' },
    { title: 'Notion', url: 'https://notion.so' },
    { title: 'Twitter / X', url: 'https://x.com' },
];

const getDomain = (url) => {
    try {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        return new URL(fullUrl).hostname;
    } catch (e) {
        return '';
    }
};

const QuickLinks = ({ links, setLinks, isZenMode }) => {
    const [addLinkModal, setAddLinkModal] = useState(false);
    const [googleAppsOpen, setGoogleAppsOpen] = useState(false);
    const [newLinkData, setNewLinkData] = useState({ title: '', url: '' });
    const [imgErrors, setImgErrors] = useState({});

    const handleAddLink = () => {
        if (!newLinkData.url) return;
        let url = newLinkData.url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const domain = getDomain(url);
        const title = newLinkData.title.trim() || domain.replace('www.', '') || 'Link';

        setLinks([...links, { id: Date.now(), title, url }]);
        setAddLinkModal(false);
        setNewLinkData({ title: '', url: '' });
    };

    const addPreset = (preset) => {
        if (links.some(l => l.url === preset.url)) return;
        setLinks([...links, { id: Date.now(), title: preset.title, url: preset.url }]);
    };

    const handleDeleteLink = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        setLinks(links.filter(l => l.id !== id));
    };

    return (
        <>
            {/* macOS Translucent Frosted Dark Glass Dock */}
            <div
                className={`fixed bottom-5 flex items-end gap-2 px-3.5 py-2.5 rounded-[24px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all duration-500 max-w-[94vw] overflow-x-auto custom-scrollbar select-none z-20 ${isZenMode ? 'translate-y-32 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
                style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(20, 20, 25, 0.45) 100%)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                }}
            >
                
                {/* 1. macOS Launchpad / Google Applications Icon */}
                <button
                    onClick={() => setGoogleAppsOpen(true)}
                    title="Applications Launchpad"
                    className="relative group w-12 h-12 rounded-[22%] bg-gradient-to-br from-[#2a2a2c] to-[#1a1a1c] hover:from-[#3a3a3c] hover:to-[#222224] border border-white/15 hover:border-white/30 flex flex-col items-center justify-center transition-all hover:-translate-y-2 hover:scale-110 shadow-lg shrink-0 cursor-pointer"
                >
                    {/* 9-Dot Apple Launchpad icon */}
                    <div className="grid grid-cols-3 gap-1 p-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4285F4] shadow-xs"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EA4335] shadow-xs"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] shadow-xs"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#34A853] shadow-xs"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4285F4] shadow-xs"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EA4335] shadow-xs"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] shadow-xs"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#34A853] shadow-xs"></div>
                    </div>
                    {/* Active dot indicator under icon */}
                    <div className="w-1 h-1 rounded-full bg-white/50 mt-0.5"></div>
                </button>

                {/* macOS Dock Divider */}
                <div className="w-px h-8 bg-white/15 mx-1 mb-2 shrink-0"></div>

                {/* 2. Shortuts */}
                {links.map(link => {
                    const domain = getDomain(link.url);
                    const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : '';
                    const hasError = !faviconUrl || imgErrors[link.id];

                    return (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={link.title || link.url}
                            className="relative group w-12 h-12 rounded-[22%] bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 flex flex-col items-center justify-center transition-all hover:-translate-y-2 hover:scale-110 shadow-md shrink-0"
                        >
                            {!hasError ? (
                                <img
                                    src={faviconUrl}
                                    alt={link.title}
                                    onError={() => setImgErrors(prev => ({ ...prev, [link.id]: true }))}
                                    className="w-6 h-6 rounded-md opacity-85 group-hover:opacity-100 transition-opacity"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                                    {link.title ? link.title.charAt(0) : <Globe size={13} />}
                                </div>
                            )}
                            <div className="w-1 h-1 rounded-full bg-white/40 mt-0.5"></div>

                            {/* Delete button on hover */}
                            <button
                                onClick={(e) => handleDeleteLink(e, link.id)}
                                title="Remove shortcut"
                                className="absolute -top-1 -right-1 bg-neutral-900 hover:bg-rose-500 text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/20"
                            >
                                <X size={10} />
                            </button>
                        </a>
                    );
                })}

                {/* 3. Add Shortcut Button */}
                <button
                    onClick={() => setAddLinkModal(true)}
                    title="Add Shortcut"
                    className="w-12 h-12 rounded-[22%] border border-dashed border-white/20 hover:border-white/50 flex items-center justify-center bg-white/5 hover:bg-white/15 transition-all hover:-translate-y-1.5 text-white/50 hover:text-white shrink-0 cursor-pointer"
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Google Apps Launchpad Modal */}
            <GoogleAppsModal
                isOpen={googleAppsOpen}
                onClose={() => setGoogleAppsOpen(false)}
            />

            {/* Add Shortcut Modal (macOS Dark sheet style) */}
            {addLinkModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setAddLinkModal(false)}
                >
                    <div
                        className="bg-[#1c1c1e]/90 backdrop-blur-3xl border border-white/15 p-6 rounded-[24px] w-full max-w-sm shadow-2xl space-y-4 text-white"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <ExternalLink size={15} /> Add Dock Shortcut
                            </h3>
                            <button onClick={() => setAddLinkModal(false)} className="text-white/40 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        <div>
                            <label className="text-[11px] font-medium text-white/60 mb-1 block">Title (optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. GitHub"
                                className="w-full bg-white/10 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                                autoFocus
                                value={newLinkData.title}
                                onChange={e => setNewLinkData({ ...newLinkData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-medium text-white/60 mb-1 block">URL</label>
                            <input
                                type="text"
                                placeholder="https://example.com"
                                className="w-full bg-white/10 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                                value={newLinkData.url}
                                onChange={e => setNewLinkData({ ...newLinkData, url: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && handleAddLink()}
                            />
                        </div>

                        <div>
                            <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-2 font-medium">Quick Suggestions</span>
                            <div className="flex flex-wrap gap-1.5">
                                {POPULAR_SHORTCUTS.map(preset => (
                                    <button
                                        key={preset.title}
                                        onClick={() => addPreset(preset)}
                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        <Plus size={10} /> {preset.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                            <button
                                onClick={() => setAddLinkModal(false)}
                                className="px-4 py-1.5 text-xs text-white/60 hover:text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddLink}
                                className="px-5 py-1.5 bg-white text-black hover:bg-neutral-200 rounded-xl text-xs font-semibold transition-all shadow-md"
                            >
                                Add to Dock
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default React.memo(QuickLinks);
