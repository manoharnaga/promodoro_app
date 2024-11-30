import React, { useState } from "react";

const SingleSelectQuestion = ({ question, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (value) => {
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div>
      <h2 className="text-xl mb-4">{question.question}</h2>
      {question.options.map((option, index) => (
        <label
          key={index}
          className={`block p-3 mb-2 rounded-lg text-lg cursor-pointer transition-all border ${
            selectedOption === option
              ? "bg-blue-100 border-blue-400 text-blue-600"
              : "bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600"
          }`}
          style={{
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <input
            type="radio"
            name={question.id}
            value={option}
            onChange={() => handleChange(option)}
            checked={selectedOption === option}
            className="hidden"
          />
          <span className="flex items-center">
            <span
              className={`w-6 h-6 mr-3 flex justify-center items-center rounded-full border-2 transition-all ${
                selectedOption === option
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-400 bg-white"
              }`}
            >
              {selectedOption === option && (
                <span className="w-3 h-3 bg-white rounded-full"></span>
              )}
            </span>
            {option}
          </span>
        </label>
      ))}
    </div>
  );
};

export default SingleSelectQuestion;
