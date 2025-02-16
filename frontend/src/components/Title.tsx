import React from "react";

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <h1 className="text-3xl flex items-center justify-center font-bold mb-6 text-gray-800 bg-gray-100">
      {text}
    </h1>
  );
};

export default Title;
