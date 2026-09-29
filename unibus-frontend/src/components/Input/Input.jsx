import { useId } from "react"
import "./Input.css"

function Input({
  label,
  id,
  placeholder,
  value,
  onChange,
  type = "text",
  ...props
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="input-container">
      {label && <label htmlFor={inputId}>{label}</label>}

      <input
        {...props}
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Input
