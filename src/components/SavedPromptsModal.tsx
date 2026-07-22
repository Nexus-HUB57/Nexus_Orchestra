import React, { useState } from 'react';
import {
  BookMarked,
  X,
  Search,
  Plus,
  Trash2,
  Copy,
  Check,
  Send,
  Tag,
} from 'lucide-react';
import { SavedPrompt } from '../types';

interface SavedPromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPrompts: SavedPrompt[];
  setSavedPrompts: React.Dispatch<React.SetStateAction<SavedPrompt[]>>;
  onUsePrompt: (promptText: string) => void;
}

export const SavedPromptsModal: React.FC<SavedPromptsModalProps> = ({
  isOpen,
  onClose,
  savedPrompts,
  setSavedPrompts,
  onUsePrompt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newCat, setNewCat] = useState<SavedPrompt['category']>('General');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'General', 'Coding', 'Creative', 'Analysis', 'Image'];

  const filteredPrompts = savedPrompts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddPrompt = () => {
    if (!newTitle.trim() || !newText.trim()) return;

    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      prompt: newText.trim(),
      category: newCat,
      createdAt: new Date().toLocaleDateString(),
    };

    setSavedPrompts((prev) => [newPrompt, ...prev]);
    setNewTitle('');
    setNewText('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Saved Prompts Library</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved prompts..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Custom Prompt
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Add Form Drawer */}
        {isAdding && (
          <div className="p-4 bg-indigo-50/60 border-b border-indigo-100 space-y-3">
            <p className="text-xs font-bold text-indigo-900">Create New Prompt Bookmark</p>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Prompt Title"
                  className="flex-1 bg-white border border-indigo-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="bg-white border border-indigo-200 rounded-xl px-2 py-1.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="Coding">Coding</option>
                  <option value="Creative">Creative</option>
                  <option value="Analysis">Analysis</option>
                  <option value="Image">Image</option>
                </select>
              </div>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Full prompt text..."
                rows={3}
                className="w-full bg-white border border-indigo-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none font-mono"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPrompt}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                >
                  Save Prompt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prompts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredPrompts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <BookMarked className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No saved prompts found.</p>
            </div>
          ) : (
            filteredPrompts.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:border-indigo-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{item.title}</span>
                    <span className="px-2 py-0.2 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-full border border-slate-200">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                </div>

                <p className="text-xs text-slate-700 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 line-clamp-3">
                  {item.prompt}
                </p>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Prompt"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopy(item.prompt, item.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Copy Text"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      onUsePrompt(item.prompt);
                      onClose();
                    }}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    Use Prompt
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
