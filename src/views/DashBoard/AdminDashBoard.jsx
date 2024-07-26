import React, { useEffect, useRef } from 'react';

const TwoColorLine = ({ value1, value2 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Define the start and end points
    const startX = 50;
    const startY = canvas.height / 2;
    const endX = canvas.width - 50;
    const endY = canvas.height / 2;

    // Calculate the total value and percentage
    const totalValue = value1 + value2;
    const percentage1 = value1 / totalValue;
    const percentage2 = value2 / totalValue;

    // Calculate the mid points
    const midX1 = startX + (endX - startX) * percentage1;
    const midX2 = startX + (endX - startX) * percentage2;

    // Draw the first segment
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(midX1, startY);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw the second segment
    ctx.beginPath();
    ctx.moveTo(midX1, startY);
    ctx.lineTo(endX, startY);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.stroke();
  }, [value1, value2]);

  return (
    <canvas ref={canvasRef} width={600} height={200} style={{ border: '1px solid black' }} />
  );
};

const App = () => {
  const [value1, setValue1] = React.useState(40);
  const [value2, setValue2] = React.useState(60);

  return (
    <div>
      <h1>Two Color Line</h1>
      <TwoColorLine value1={value1} value2={value2} />
      <div>
        <label>
          Value 1:
          <input type="number" value={value1} onChange={(e) => setValue1(Number(e.target.value))} />
        </label>
      </div>
      <div>
        <label>
          Value 2:
          <input type="number" value={value2} onChange={(e) => setValue2(Number(e.target.value))} />
        </label>
      </div>
    </div>
  );
};

export default App;
