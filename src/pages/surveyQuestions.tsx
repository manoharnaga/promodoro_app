import React, { useState } from "react";
import surveyQuestions from "../../public/assets/survey_questions.json";
import SingleSelectQuestion from "@/features/survey/SingleSelectQuestion";
import MultiSelectQuestion from "@/features/survey/MultiSelectQuestion";
import ScaleQuestion from "@/features/survey/ScaleQuestion";

const SurveyPage = () => {
  const [responses, setResponses] = useState({});

  const handleResponseChange = (questionId, answer) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: answer,
    }));
  };

  return (
    <div className="text-2xl container bg-white min-h-screen  min-w-full flex flex-col items-center justify-center">
      <h1 className="text-center text-3xl mb-4">Survey Questions</h1>
      {surveyQuestions.map((question) => (
        <div key={question.id} className="mb-6">
          <Question
            question={question}
            onChange={(answer) => handleResponseChange(question.id, answer)}
          />
        </div>
      ))}
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded"
        onClick={() => console.log(responses)}
      >
        Submit
      </button>
    </div>
  );
};

const Question = ({ question, onChange }) => {
  switch (question.type) {
    case "single-select":
      return (
        <SingleSelectQuestion
          question={question}
          onChange={onChange}
        />
      );
    case "multi-select":
      return (
        <MultiSelectQuestion
          question={question}
          onChange={onChange}
        />
      );
    case "scale":
      return (
        <ScaleQuestion
          question={question}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};

export default SurveyPage;
