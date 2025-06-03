import React, { useRef, useState, useEffect } from 'react';

const WhiteboardPage = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [drawingActions, setDrawingActions] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth - 300;
    canvas.height = window.innerHeight - 150;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setContext(ctx);

    const currentSubject = sessionStorage.getItem('currentWhiteboardSubject');
    if (currentSubject) {
      const saved = localStorage.getItem(`whiteboard_${currentSubject}`);
      if (saved) setDrawingActions(JSON.parse(saved));
    }

    const handleResize = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);

      canvas.width = window.innerWidth - 300;
      canvas.height = window.innerHeight - 150;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.drawImage(tempCanvas, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!context || !canvasRef.current) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    drawingActions.forEach(action => {
      context.beginPath();
      context.strokeStyle = action.color;
      context.lineWidth = action.width;
      const pts = action.points;
      if (pts.length >= 2) {
        context.moveTo(pts[0], pts[1]);
        for (let i = 2; i < pts.length; i += 2) {
          context.lineTo(pts[i], pts[i + 1]);
        }
        context.stroke();
      }
    });
  }, [context, drawingActions]);

  useEffect(() => {
    const currentSubject = sessionStorage.getItem('currentWhiteboardSubject');
    if (currentSubject && drawingActions.length > 0) {
      localStorage.setItem(`whiteboard_${currentSubject}`, JSON.stringify(drawingActions));
    }
  }, [drawingActions]);

  useEffect(() => {
    const subject = localStorage.getItem('selectedSubject');
    if (subject) {
      sessionStorage.setItem('currentWhiteboardSubject', subject);
    }
  }, []);

  const startDrawing = (e) => {
    if (!canvasRef.current || !context) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.beginPath();
    context.moveTo(x, y);
    context.strokeStyle = currentColor;
    context.lineWidth = lineWidth;
    setDrawing(true);
    setCurrentPath([x, y]);
  };

  const draw = (e) => {
    if (!drawing || !context || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.lineTo(x, y);
    context.stroke();
    setCurrentPath([...currentPath, x, y]);
  };

  const endDrawing = () => {
    if (!drawing || !context) return;
    context.closePath();
    setDrawing(false);
    if (currentPath.length > 0) {
      setDrawingActions([...drawingActions, { points: currentPath, color: currentColor, width: lineWidth }]);
    }
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setDrawingActions([]);
    const currentSubject = sessionStorage.getItem('currentWhiteboardSubject') || 'default';
    localStorage.removeItem(`whiteboard_${currentSubject}`);
  };

  const undoLastAction = () => {
    const updated = [...drawingActions];
    updated.pop();
    setDrawingActions(updated);
    setCurrentPath([]);
  };

  return (
    <div>
      <div style={{ padding: '1rem' }}>
        <h2>Whiteboard - {sessionStorage.getItem('currentWhiteboardSubject') || 'Subject'}</h2>

        <div style={{ display: 'flex', marginBottom: '1rem' }}>
          <div style={{ marginRight: '1rem' }}>
            <label htmlFor="color-picker">Color: </label>
            <input
              id="color-picker"
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
            />
          </div>

          <div style={{ marginRight: '1rem' }}>
            <label htmlFor="line-width">Line Width: </label>
            <input
              id="line-width"
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
            />
            <span>{lineWidth}px</span>
          </div>

          <button onClick={undoLastAction} style={{ marginRight: '0.5rem' }}>
            Undo
          </button>
          <button onClick={clearCanvas} style={{ backgroundColor: 'red', color: 'white' }}>
            Clear
          </button>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          style={{
            border: '1px solid #ccc',
            backgroundColor: 'white',
            cursor: 'crosshair',
          }}
        />
      </div>
    </div>
  );
};

export default WhiteboardPage;
