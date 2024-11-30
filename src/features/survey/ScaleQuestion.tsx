import React, { useState } from "react";

const ScaleQuestion = ({ question, onChange }) => {
  const [value, setValue] = useState((question.scaleRange[0] + question.scaleRange[1]) / 2); // Default to middle of range
  const { low, medium, high } = question.labels;
  const [min, max] = question.scaleRange;

  const handleChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setValue(newValue);
    onChange(newValue);
  };

  const getLabel = () => {
    if (value < (max - min) / 3 + min) return low;
    if (value < ((max - min) * 2) / 3 + min) return medium;
    return high;
  };

  return (
    <div className="w-full">
      <h2 className="text-xl mb-4">{question.question}</h2>
      <div className="flex items-center justify-between w-full mb-4">
        <span className="text-gray-500">{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="w-full mx-4 appearance-none"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${
              ((value - min) / (max - min)) * 100
            }%, #e5e7eb ${((value - min) / (max - min)) * 100}%)`,
            height: "12px",
            borderRadius: "6px",
            outline: "none",
            transition: "background 0.3s ease",
          }}
        />
        <span className="text-gray-500">{max}</span>
      </div>
      <div className="text-center text-lg">
        <span className="font-bold text-3xl text-blue-600">{value}</span> -{" "}
        <span className="text-gray-600">{getLabel()}</span>
      </div>
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #3b82f6;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #3b82f6;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
        input[type="range"]::-ms-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #3b82f6;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        input[type="range"]::-ms-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default ScaleQuestion;
