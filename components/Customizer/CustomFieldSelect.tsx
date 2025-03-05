import React from 'react'

interface OptionNode {
  entityId: number
  name: string
  value: string
}

interface OptionEdge {
  node: OptionNode
}

interface SelectProps {
  options: OptionEdge[]
  onChange: (value: string) => void
}

export const CustomFieldSelect: React.FC<SelectProps> = ({
  options,
  onChange,
}) => {
  const hasOptions = options.length > 0
  if (!hasOptions) return null
  return (
    <div className="w-full">
      <select
        className="w-full p-2 border-common rounded-full cursor-pointer text-center text-xs"
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option, idx) => (
          <option
            key={option.node.entityId}
            className="text-center text-xs"
            selected={idx === 0}
            value={option.node.value}
          >
            {option.node.value}
          </option>
        ))}
      </select>
    </div>
  )
}
