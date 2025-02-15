import React from "react";

interface HeadingProps {
  title: string;
}
const Heading = ({ title }: HeadingProps) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6">{title}</h1>
    </>
  );
};

export default Heading;
