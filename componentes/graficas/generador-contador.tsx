import React from "react";

interface GeneradorContadorProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: "blue" | "red" | "green" | "yellow" | "purple" | "pink" | "indigo";
}

const colorClasses = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900",
    border: "border-blue-200 dark:border-blue-700",
    iconBg: "bg-blue-700 dark:bg-blue-500",
    title: "text-blue-700 dark:text-blue-300",
    count: "text-blue-900 dark:text-blue-100",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900",
    border: "border-red-200 dark:border-red-700",
    iconBg: "bg-red-700 dark:bg-red-500",
    title: "text-red-700 dark:text-red-300",
    count: "text-red-900 dark:text-red-100",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900",
    border: "border-green-200 dark:border-green-700",
    iconBg: "bg-green-700 dark:bg-green-500",
    title: "text-green-700 dark:text-green-300",
    count: "text-green-900 dark:text-green-100",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-900",
    border: "border-yellow-200 dark:border-yellow-700",
    iconBg: "bg-yellow-700 dark:bg-yellow-500",
    title: "text-yellow-700 dark:text-yellow-300",
    count: "text-yellow-900 dark:text-yellow-100",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900",
    border: "border-purple-200 dark:border-purple-700",
    iconBg: "bg-purple-700 dark:bg-purple-500",
    title: "text-purple-700 dark:text-purple-300",
    count: "text-purple-900 dark:text-purple-100",
  },
  pink: {
    bg: "bg-pink-100 dark:bg-pink-900",
    border: "border-pink-200 dark:border-pink-700",
    iconBg: "bg-pink-700 dark:bg-pink-500",
    title: "text-pink-700 dark:text-pink-300",
    count: "text-pink-900 dark:text-pink-100",
  },
  indigo: {
    bg: "bg-indigo-100 dark:bg-indigo-900",
    border: "border-indigo-200 dark:border-indigo-700",
    iconBg: "bg-indigo-700 dark:bg-indigo-500",
    title: "text-indigo-700 dark:text-indigo-300",
    count: "text-indigo-900 dark:text-indigo-100",
  },
};

const GeneradorContador: React.FC<GeneradorContadorProps> = ({
  title,
  count,
  icon,
  color,
}) => {
  const classes = colorClasses[color];

  return (
    <div
      className={`${classes.bg} ${classes.border} rounded-lg p-4 flex items-center`}
    >
      <div className={`${classes.iconBg} p-2 rounded-full text-white mr-3`}>
        {icon}
      </div>
      <div>
        <div className={`text-sm ${classes.title}`}>{title}</div>
        <div className={`text-2xl font-bold ${classes.count}`}>
          {count || 0}
        </div>
      </div>
    </div>
  );
};

export default GeneradorContador;
