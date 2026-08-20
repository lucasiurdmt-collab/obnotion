import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';

export default function GraphView({ notes, onSelectNote, darkMode }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const graphNodes = notes.map((note, index) => {
      const angle = (index / Math.max(notes.length, 1)) * 2 * Math.PI;
      const radius = 120 + Math.random() * 80;
      return {
        id: note.id,
        title: note.title,
        icon: note.icon || '📝',
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: 18,
        tags: note.tags || []
      };
    });

    const graphLinks = [];
    notes.forEach(note => {
      const matches = note.content.match(/\[\[(.*?)\]\]/g);
      if (matches) {
        matches.forEach(match => {
          const targetTitle = match.replace('[[', '').replace(']]', '').trim();
          const targetNote = notes.find(n => n.title.toLowerCase().includes(targetTitle.toLowerCase()) || targetTitle.toLowerCase().includes(n.title.toLowerCase()));
          if (targetNote && targetNote.id !== note.id) {
            graphLinks.push({ source: note.id, target: targetNote.id });
          }
        });
      }

      notes.forEach(otherNote => {
        if (otherNote.id !== note.id) {
          const sharedTag = (note.tags || []).some(tag => (otherNote.tags || []).includes(tag));
          if (sharedTag) {
            const exists = graphLinks.some(l => (l.source === note.id && l.target === otherNote.id) || (l.source === otherNote.id && l.target === note.id));
            if (!exists && Math.random() > 0.4) {
              graphLinks.push({ source: note.id, target: otherNote.id });
            }
          }
        }
      });
    });

    setNodes(graphNodes);
    setLinks(graphLinks);
  }, [notes]);

  useEffect(() => {
    let animationFrameId;
    const simulate = () => {
      setNodes(prevNodes => {
        const newNodes = prevNodes.map(n => ({ ...n }));

        for (let i = 0; i < newNodes.length; i++) {
          for (let j = i + 1; j < newNodes.length; j++) {
            const n1 = newNodes[i];
            const n2 = newNodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 280) {
              const force = (280 - dist) / dist * 0.3;
              n1.vx -= dx * force * 0.05;
              n1.vy -= dy * force * 0.05;
              n2.vx += dx * force * 0.05;
              n2.vy += dy * force * 0.05;
            }
          }
        }

        links.forEach(link => {
          const source = newNodes.find(n => n.id === link.source);
          const target = newNodes.find(n => n.id === link.target);
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = (dist - 130) * 0.02;
            source.vx += (dx / dist) * force;
            source.vy += (dy / dist) * force;
            target.vx -= (dx / dist) * force;
            target.vy -= (dy / dist) * force;
          }
        });

        newNodes.forEach(n => {
          if (draggedNode && draggedNode.id === n.id) return;
          const centerDist = Math.sqrt(n.x * n.x + n.y * n.y) || 1;
          n.vx -= (n.x / centerDist) * 0.2;
          n.vy -= (n.y / centerDist) * 0.2;
          n.vx *= 0.88;
          n.vy *= 0.88;
          n.x += n.vx;
          n.y += n.vy;
        });

        return newNodes;
      });

      animationFrameId = requestAnimationFrame(simulate);
    };

    animationFrameId = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [links, draggedNode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.scale(zoom, zoom);

    links.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    nodes.forEach(node => {
      const isHovered = hoveredNode && hoveredNode.id === node.id;
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = darkMode ? '#1e1b4b' : '#ede9fe';
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#c084fc' : '#8b5cf6';
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();

      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.icon || '📝', node.x, node.y);

      ctx.font = '500 12px sans-serif';
      ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
      ctx.fillText(node.title.length > 18 ? node.title.slice(0, 16) + '...' : node.title, node.x, node.y + node.radius + 14);
    });

    ctx.restore();
  }, [nodes, links, hoveredNode, zoom, pan, darkMode]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const x = (clientX - canvas.width / 2 - pan.x) / zoom;
    const y = (clientY - canvas.height / 2 - pan.y) / zoom;
    return { x, y, clientX, clientY };
  };

  const handleMouseDown = (e) => {
    const { x, y, clientX, clientY } = getCanvasCoords(e);
    const clickedNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) <= n.radius + 5);
    if (clickedNode) {
      setDraggedNode(clickedNode);
    } else {
      setIsDragging(true);
      setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    const { x, y, clientX, clientY } = getCanvasCoords(e);
    if (draggedNode) {
      setNodes(prev => prev.map(n => n.id === draggedNode.id ? { ...n, x, y, vx: 0, vy: 0 } : n));
    } else if (isDragging) {
      setPan({ x: clientX - dragStart.x, y: clientY - dragStart.y });
    } else {
      const hover = nodes.find(n => Math.hypot(n.x - x, n.y - y) <= n.radius + 5);
      setHoveredNode(hover || null);
    }
  };

  const handleMouseUp = (e) => {
    if (draggedNode) {
      const { x, y } = getCanvasCoords(e);
      if (Math.hypot(draggedNode.x - x, draggedNode.y - y) < 8) {
        onSelectNote(draggedNode.id);
      }
      setDraggedNode(null);
    }
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl border border-inherit bg-inherit flex flex-col">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1.5 rounded-xl bg-gray-900/70 backdrop-blur-md border border-gray-800 shadow-xl">
        <button onClick={() => setZoom(z => Math.min(3, z * 1.2))} className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" title="Aumentar Zoom">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom(z => Math.max(0.3, z * 0.8))} className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" title="Diminuir Zoom">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" title="Centralizar">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-4 left-4 z-10 p-2.5 rounded-xl bg-gray-900/70 backdrop-blur-md border border-gray-800 shadow-xl text-xs text-gray-300 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span>Grafo Obsidian ({nodes.length} notas • {links.length} conexões)</span>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={(e) => { e.preventDefault(); setZoom(z => Math.max(0.3, Math.min(3, z * (e.deltaY < 0 ? 1.1 : 0.9)))); }}
        className="w-full h-full cursor-grab active:cursor-grabbing flex-1"
      />
    </div>
  );
}