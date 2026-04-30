import React from "react";
import styles from "./Input.module.css";

interface InputProps {
  type: "text" | "date" | "time" | "email" | "password" | "number";
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  min?: number;
  step?: number;
  disabled?: boolean;
}

function Input({
  type,
  name,
  value,
  onChange,
  placeholder,
  className,
  required,
  min,
  step,
  disabled,
}: InputProps) {
  const types = {
    text: {
      style: styles.text,
    },
    date: {
      style: styles.date,
    },
    time: {
      style: styles.time,
    },
    email: {
      style: styles.email,
    },
    password: {
      style: styles.password,
    },
    number: {
      style: styles.number,
    },
  };

  const { style } = types[type];

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${styles.input} ${style} ${className}`}
      required={required}
      min={min}
      step={step}
      disabled={disabled}
    />
  );
}

export default Input;
