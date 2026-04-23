import React from "react";
import styles from "./Input.module.css";

interface InputProps {
  type: "text" | "date" | "time" | "email" | "password";
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

function Input({
  type,
  name,
  value,
  onChange,
  placeholder,
  className,
  required,
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
    />
  );
}

export default Input;
