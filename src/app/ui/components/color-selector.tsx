"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "../lib/utlis"

interface ColorOption {
  value: string
  label: string
  color: string // CSS color value (hex, rgb, etc)
}

interface ColorSelectorProps extends Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, 'onChange'> {
  selectedValue?: string
  options: ColorOption[]
  onChange?: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
}

function ColorSelector({
  className,
  selectedValue,
  options,
  onChange,
  size = 'md',
  ...props
}: ColorSelectorProps) {
  const sizeClasses = {
    sm: "gap-2",
    md: "gap-3", 
    lg: "gap-4"
  }

  return (
    <RadioGroupPrimitive.Root
      data-slot="color-selector"
      className={cn("flex flex-wrap", sizeClasses[size], className)}
      value={selectedValue}
      onValueChange={onChange}
      {...props}
    >
      {options.map((option) => (
        <ColorSelectorItem 
          key={option.value} 
          value={option.value} 
          label={option.label}
          color={option.color}
          size={size}
        />
      ))}
    </RadioGroupPrimitive.Root>
  )
}

interface ColorSelectorItemProps extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  label: string
  color: string
  size?: 'sm' | 'md' | 'lg'
}

function ColorSelectorItem({
  className,
  label,
  color,
  size = 'md',
  ...props
}: ColorSelectorItemProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  }

  const ringSize = {
    sm: "ring-2",
    md: "ring-2", 
    lg: "ring-3"
  }

  return (
    <RadioGroupPrimitive.Item
      data-slot="color-selector-item"
      title={label}
      className={cn(
        "relative rounded-full border-2 border-gray-200 cursor-pointer transition-all duration-200",
        "hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "data-[state=checked]:border-primary data-[state=checked]:scale-110",
        `data-[state=checked]:${ringSize[size]} data-[state=checked]:ring-primary data-[state=checked]:ring-offset-2`,
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
      {...props}
    >
      {/* Inner circle for checked state */}
      <div className="absolute inset-1 rounded-full bg-white/20 opacity-0 data-[state=checked]:opacity-100 transition-opacity" />
    </RadioGroupPrimitive.Item>
  )
}

export { ColorSelector, type ColorOption }