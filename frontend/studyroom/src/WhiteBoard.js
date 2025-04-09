import React, { useRef, useState, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";

const WhiteBoard = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    console.log("CanvasRef:", canvasRef.current);
  }, []);

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  
  return (
    <div className="flex flex-col items-center p-4" style={{border:"2px solid black"}}>
      <h2 className="text-xl font-bold mb-4">Virtual Study Room - Whiteboard</h2>
      <CanvasDraw
        ref={canvasRef}
        brushColor={color}
        brushRadius={10}
        lazyRadius={5}
        canvasWidth={800}
        canvasHeight={400}
        hideGrid={true}
        className="border border-gray-300 rounded-lg shadow-lg"
      />
      <div className="flex space-x-4 mt-4">
        <button
          onClick={clearCanvas}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Clear
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border p-1 rounded"
        />
      </div>
    </div>
  );
};

export default WhiteBoard;