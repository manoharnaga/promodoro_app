import React, { useState } from "react";

const MultiSelectQuestion = ({ question, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (option) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions);
  };

  return (
    <div>
      <h2 className="text-xl mb-4">{question.question}</h2>
      {question.options.map((option, index) => (
        <label
          key={index}
          className={`block p-3 mb-2 rounded-lg text-lg cursor-pointer transition-all border ${
            selectedOptions.includes(option)
              ? "bg-green-100 border-green-400 text-green-600"
              : "bg-white border-gray-300 hover:bg-green-50 hover:border-green-400 hover:text-green-600"
          }`}
          style={{
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <input
            type="checkbox"
            value={option}
            onChange={() => handleChange(option)}
            className="hidden"
          />
          <span className="flex items-center">
            <span
              className={`w-6 h-6 mr-3 flex justify-center items-center rounded-md border-2 transition-all ${
                selectedOptions.includes(option)
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-400 bg-white"
              }`}
            >
              {selectedOptions.includes(option) && (
                <span className="w-3 h-3 bg-white rounded"></span>
              )}
            </span>
            {option}
          </span>
        </label>
      ))}
    </div>
  );
};

export default MultiSelectQuestion;