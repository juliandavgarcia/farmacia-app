import React from "react";

interface GeneradorContadorProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const GeneradorContador: React.FC<GeneradorContadorProps> = ({
  title,
  count,
  icon,
  color,
}) => {
  return (
    <div
      className={`bg-${color}-100 border border-${color}-200 rounded-lg p-4 flex items-center`}
    >
      <div className={`bg-${color}-500 p-2 rounded-full text-white mr-3`}>
        {icon}
      </div>
      <div>
        <div className={`text-sm text-${color}-800`}>{title}</div>
        <div className={`text-2xl font-bold text-${color}-900`}>
          {count || 0}
        </div>
      </div>
    </div>
  );
};

export default GeneradorContador;
