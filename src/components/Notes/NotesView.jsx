import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Network,
  Tag,
  Search,
  Pin,
  CheckSquare,
  Bold,
  Italic,
  Heading,
  List,
  Quote,
  Code,
  Download
} from 'lucide-react';
import GraphView from './GraphView';

// --- Pure JS Markdown Renderer (no external deps) ---
function markdownToHtml(md) {
  if (!md) return '';
  let html = md
    // Code blocks (``` ... ```)
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<pre class="md-pre"><code class="md-code ${lang ? 'lang-' + lang : ''}">${escHtml(code.trim())}</code></pre>`)
    // Headings
    .replace(/^###### (.+)$/gm, '<h6 class="md-h6">$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5 class="md-h5">$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    // Horizontal rule
    .replace(/^---+$/gm, '<hr class="md-hr" />')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
    // Checklist items
    .replace(/^- \[x\] (.+)$/gim, '<li class="md-li md-check-done"><span class="md-checkbox md-checked">✓</span> $1</li>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="md-li md-check-todo"><span class="md-checkbox">○</span> $1</li>')
    // Unordered list
    .replace(/^[-*] (.+)$/gm, '<li class="md-li md-ul-item">$1</li>')
    // Ordered list
    .replace(/^\d+\. (.+)$/gm, '<li class="md-li md-ol-item">$1</li>')
    // Inline bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
    // Wikilinks [[Note Title]]
    .replace(/\[\[([^\]]+)\]\]/g, '<span class="md-wikilink">[[<span>$1</span>]]</span>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li class="md-li[^>]*>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul class="md-list">${match}</ul>`)
    // Paragraphs: blank line separated blocks not already tagged
    .replace(/^(?!<[a-z]).+$/gm, (line) => line.trim() ? `<p class="md-p">${line}</p>` : '')
    // Clean up extra blank lines
    .replace(/\n{3,}/g, '\n\n');
  return html;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

export default function NotesView({ notes, onUpdateNotes, selectedNoteId, onSelectNote, darkMode }) {
  const [viewMode, setViewMode] = useState('editor');
  const [editTab, setEditTab] = useState('both');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  const activeNote = notes.find(n => n.id === selectedNoteId) || notes[0];
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || [])));

  const filteredNotes = notes.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'ALL' || (n.tags || []).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCreateNote = () => {
    const newNote = {
      id: 'note-' + Date.now(),
      title: 'Nova Nota ' + (notes.length + 1),
      icon: '📝',
      cover: 'https://images.unsplash.com/photo-1507842229451-7f01be8510ab',
      folder: 'Geral',
      tags: ['Ideias'],
      pinned: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      content: '# Nova Nota\n\nEscreva suas ideias aqui em Markdown...\n\n- [ ] Tarefa 1\n- [ ] Tarefa 2'
    };
    onUpdateNotes([newNote, ...notes]);
    onSelectNote(newNote.id);
  };

  const handleUpdateActiveNote = (fields) => {
    onUpdateNotes(notes.map(n => n.id === activeNote.id ? { ...n, ...fields, updatedAt: new Date().toISOString().split('T')[0] } : n));
  };

  const handleDeleteActiveNote = () => {
    if (confirm('Excluir esta nota permanentemente?')) {
      const remaining = notes.filter(n => n.id !== activeNote.id);
      onUpdateNotes(remaining);
      if (remaining.length > 0) onSelectNote(remaining[0].id);
    }
  };

  const insertSyntax = (syntax, wrapper = '') => {
    const textarea = document.getElementById('note-markdown-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = wrapper ? wrapper + (selected || 'texto') + wrapper : syntax + ' ' + selected;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    handleUpdateActiveNote({ content: newContent });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const exportAsMarkdown = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeNote.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.md';
    link.click();
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <div className={'px-6 py-3 border-b flex items-center justify-between ' + (darkMode ? 'bg-[#181920] border-gray-800' : 'bg-gray-50 border-gray-200')}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('editor')}
            className={'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ' + (viewMode === 'editor' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200')}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Editor Notion</span>
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ' + (viewMode === 'graph' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200')}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Grafo Obsidian</span>
          </button>
        </div>

        {viewMode === 'editor' && activeNote && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-900/50 border border-gray-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setEditTab('write')}
                className={'px-2.5 py-1 rounded-lg font-medium ' + (editTab === 'write' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200')}
              >
                Escrever
              </button>
              <button
                onClick={() => setEditTab('both')}
                className={'px-2.5 py-1 rounded-lg font-medium hidden md:inline-block ' + (editTab === 'both' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200')}
              >
                Dividido
              </button>
              <button
                onClick={() => setEditTab('preview')}
                className={'px-2.5 py-1 rounded-lg font-medium ' + (editTab === 'preview' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200')}
              >
                Leitura
              </button>
            </div>

            <button
              onClick={exportAsMarkdown}
              className="p-1.5 rounded-xl border border-gray-700 text-gray-400 hover:text-gray-100 hover:bg-gray-800"
              title="Baixar Nota em Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteActiveNote}
              className="p-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10"
              title="Excluir Nota"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {viewMode === 'graph' ? (
        <div className="flex-1 p-6">
          <GraphView
            notes={notes}
            onSelectNote={(id) => {
              onSelectNote(id);
              setViewMode('editor');
            }}
            darkMode={darkMode}
          />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className={'w-80 flex-shrink-0 border-r flex flex-col ' + (darkMode ? 'bg-[#15161e] border-gray-800' : 'bg-gray-50/50 border-gray-200')}>
            <div className="p-3 border-b border-inherit space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filtrar notas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-gray-900/40 border border-gray-800 outline-none focus:border-purple-500 text-inherit"
                  />
                </div>
                <button
                  onClick={handleCreateNote}
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30"
                  title="Criar Nova Nota"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {allTags.length > 0 && (
                <div className="flex items-center gap-1 overflow-x-auto py-1 text-[11px] no-scrollbar">
                  <button
                    onClick={() => setSelectedTag('ALL')}
                    className={'px-2 py-0.5 rounded-full font-medium whitespace-nowrap ' + (selectedTag === 'ALL' ? 'bg-purple-600 text-white' : 'bg-gray-800/60 text-gray-400 hover:text-gray-200')}
                  >
                    Todas ({notes.length})
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={'px-2 py-0.5 rounded-full font-medium whitespace-nowrap ' + (selectedTag === tag ? 'bg-purple-600 text-white' : 'bg-gray-800/60 text-gray-400 hover:text-gray-200')}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredNotes.map(note => {
                const isSelected = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={'p-3 rounded-xl cursor-pointer transition-all duration-150 border ' + (isSelected ? 'bg-purple-600/15 border-purple-500/40 text-purple-300 shadow-sm' : 'border-transparent hover:bg-gray-800/30 text-gray-400 hover:text-gray-200')}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl flex-shrink-0">{note.icon || '📝'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-semibold text-xs truncate text-inherit">
                            {note.title}
                          </h4>
                          {note.pinned && <Pin className="w-3 h-3 text-purple-400 flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                          {note.content.replace(/[#*[\]`>_-]/g, '').slice(0, 50)}...
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-[10px] text-gray-500">{note.updatedAt}</span>
                          {(note.tags || []).slice(0, 2).map(t => (
                            <span key={t} className="text-[9px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {activeNote ? (
            <div className="flex-1 flex flex-col overflow-hidden bg-inherit">
              <div className="p-6 border-b border-inherit pb-4 space-y-3">
                {activeNote.cover && (
                  <div className="h-28 w-full rounded-2xl overflow-hidden relative group mb-2 shadow-inner">
                    <img src={activeNote.cover} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        const newCover = prompt('Link da imagem de capa:', activeNote.cover);
                        if (newCover !== null) handleUpdateActiveNote({ cover: newCover });
                      }}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Alterar Capa
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const emoji = prompt('Escolha um emoji para esta nota:', activeNote.icon || '📝');
                      if (emoji) handleUpdateActiveNote({ icon: emoji });
                    }}
                    className="text-3xl p-1 rounded-xl hover:bg-gray-800/40 transition-colors"
                  >
                    {activeNote.icon || '📝'}
                  </button>
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => handleUpdateActiveNote({ title: e.target.value })}
                    className="flex-1 text-2xl font-bold bg-transparent outline-none border-none text-inherit placeholder-gray-500"
                    placeholder="Título da nota..."
                  />
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <input
                      type="text"
                      value={(activeNote.tags || []).join(', ')}
                      onChange={(e) => handleUpdateActiveNote({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      placeholder="Tags separadas por vírgula..."
                      className="bg-transparent border-b border-gray-800 focus:border-purple-500 outline-none text-inherit text-xs px-1"
                    />
                  </div>
                  <span>•</span>
                  <span>Atualizado em {activeNote.updatedAt}</span>
                </div>

                <div className="flex items-center gap-1 pt-2 border-t border-inherit/40 overflow-x-auto text-xs text-gray-400">
                  <button onClick={() => insertSyntax('', '**')} className="p-1.5 hover:bg-gray-800 rounded" title="Negrito">
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertSyntax('', '*')} className="p-1.5 hover:bg-gray-800 rounded" title="Itálico">
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertSyntax('#')} className="p-1.5 hover:bg-gray-800 rounded" title="Título">
                    <Heading className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertSyntax('- [ ]')} className="p-1.5 hover:bg-gray-800 rounded" title="Checklist">
                    <CheckSquare className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertSyntax('-')} className="p-1.5 hover:bg-gray-800 rounded" title="Lista">
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertSyntax('>')} className="p-1.5 hover:bg-gray-800 rounded" title="Citação">
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertSyntax('\`\`\`\n', '\n\`\`\`')} className="p-1.5 hover:bg-gray-800 rounded" title="Código">
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertSyntax('[[', ']]')} className="px-2 py-1 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded font-mono text-[11px]" title="Wikilink Obsidian">
                    [[Link]]
                  </button>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {(editTab === 'write' || editTab === 'both') && (
                  <div className={'flex-1 p-6 overflow-y-auto ' + (editTab === 'both' ? 'border-r border-inherit' : '')}>
                    <textarea
                      id="note-markdown-textarea"
                      value={activeNote.content}
                      onChange={(e) => handleUpdateActiveNote({ content: e.target.value })}
                      className="w-full h-full min-h-[400px] bg-transparent outline-none border-none resize-none font-mono text-sm leading-relaxed text-inherit"
                      placeholder="Escreva em Markdown aqui..."
                    />
                  </div>
                )}

                {(editTab === 'preview' || editTab === 'both') && (
                  <div
                    className="flex-1 p-6 overflow-y-auto max-w-none text-inherit text-sm md-preview"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(activeNote.content) }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Nenhuma nota selecionada
            </div>
          )}
        </div>
      )}
    </div>
  );
}
