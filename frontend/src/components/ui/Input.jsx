import React from "react";

export default function Input({
  icon: Icon,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  ...props
}) {
  return (
    <div className="field-group">
      {label && <label className="field-label">{label}</label>}
      <div className="field-wrap">
        {Icon && <Icon className="field-icon" size={17} />}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className="field-input"
          placeholder={placeholder}
          {...props}
        />
      </div>
    </div>
  );
}
