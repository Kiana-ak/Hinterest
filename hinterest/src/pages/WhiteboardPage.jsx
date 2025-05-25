import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const WhiteboardPage = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [drawingActions, setDrawingActions] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 300; // Leave some space for controls
    canvas.height = window.innerHeight - 150; // Leave space for navbar and controls
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setContext(ctx);

    // Load saved drawings for this subject
    const currentSubject = sessionStorage.getItem('currentWhiteboardSubject');
    if (currentSubject) {
      const savedDrawings = localStorage.getItem(`whiteboard_${currentSubject}`);
      if (savedDrawings) {
        setDrawingActions(JSON.parse(savedDrawings));
      }
    }

    // Handle window resize
    const handleResize = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
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

  // Redraw all paths when drawingActions change
  useEffect(() => {
    if (context && drawingActions.length > 0) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      drawingActions.forEach(action => {
        context.beginPath();
        context.strokeStyle = action.color;
        context.lineWidth = action.width;
        
        const points = action.points;
        context.moveTo(points[0], points[1]);
        
        for (let i = 2; i < points.length; i += 2) {
          context.lineTo(points[i], points[i + 1]);
        }
        
        context.stroke();
      });
    }
  }, [context, drawingActions]);

  // Save drawings when they change
  useEffect(() => {
    const currentSubject = sessionStorage.getItem('currentWhiteboardSubject');
    if (currentSubject && drawingActions.length > 0) {
      localStorage.setItem(`whiteboard_${currentSubject}`, JSON.stringify(drawingActions));
    }
  }, [drawingActions]);

  // Set current subject when component mounts
  useEffect(() => {
    const subject = localStorage.getItem('selectedSubject');
    if (subject) {
      sessionStorage.setItem('currentWhiteboardSubject', subject);
    }
  }, []);

  const startDrawing = (e) => {
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
    if (!drawing) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
    
    setCurrentPath([...currentPath, x, y]);
  };

  const endDrawing = () => {
    if (!drawing) return;
    
    context.closePath();
    setDrawing(false);
    
    if (currentPath.length > 0) {
      setDrawingActions([
        ...drawingActions,
        {
          points: currentPath,
          color: currentColor,
          width: lineWidth
        }
      ]);
    }
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setDrawingActions([]);
    
    const currentSubject = sessionStorage.getItem('currentWhiteboardSubject');
    if (currentSubject) {
      localStorage.removeItem(`whiteboard_${currentSubject}`);
    }
  };

  const undoLastAction = () => {
    if (drawingActions.length === 0) return;
    
    const newDrawingActions = [...drawingActions];
    newDrawingActions.pop();
    setDrawingActions(newDrawingActions);
  };

  return (
    <div>
      <Navbar />
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
              style={{ marginRight: '1rem' }}
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
              style={{ marginRight: '1rem' }}
            />
            <span>{lineWidth}px</span>
          </div>
          
          <button 
            onClick={undoLastAction} 
            style={{ 
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Undo
          </button>
          
          <button 
            onClick={clearCanvas} 
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
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
            cursor: 'crosshair'
          }}
        />
      </div>
    </div>
  );
};

export default WhiteboardPage;