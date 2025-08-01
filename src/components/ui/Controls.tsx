/**
 * Advanced UI Controls for Particle Dance Template Editor
 *
 * Provides enhanced parameter controls including sliders, toggles,
 * color pickers, and buttons with consistent styling and behavior.
 */

"use client";

import { useState } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
  className?: string;
  description?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = "",
  className = "",
  description,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
        <div className="min-w-0 flex-1">
          <label className="text-sm text-gray-300 font-medium">{label}</label>
          {description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded font-mono flex-shrink-0 self-start sm:self-center">
          {typeof value === "number" ? value.toFixed(step < 1 ? 1 : 0) : value}
          {unit}
        </span>
      </div>
      <div className="relative group">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 sm:h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
          style={{
            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${percentage}%, #374151 ${percentage}%, #374151 100%)`,
          }}
        />
        <div
          className="absolute top-1/2 w-4 h-4 sm:w-4 sm:h-4 bg-purple-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none shadow-lg group-hover:scale-110 transition-transform"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  className?: string;
}

export function Toggle({
  label,
  checked,
  onChange,
  description,
  className = "",
}: ToggleProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors gap-2 sm:gap-0 ${className}`}
    >
      <div className="flex-1 min-w-0">
        <label
          className="text-sm text-gray-300 font-medium cursor-pointer"
          onClick={() => onChange(!checked)}
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 touch-manipulation flex-shrink-0 self-start sm:self-center ${
          checked ? "bg-purple-600" : "bg-slate-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  className?: string;
}

export function ColorPicker({
  label,
  value,
  onChange,
  presets = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"],
  className = "",
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm text-gray-300 font-medium">{label}</label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
        <div
          className="w-10 h-10 sm:w-10 sm:h-10 rounded-lg border-2 border-slate-600 cursor-pointer relative overflow-hidden hover:border-purple-500 transition-colors touch-manipulation flex-shrink-0"
          style={{ backgroundColor: value }}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "color";
            input.value = value;
            input.onchange = (e) =>
              onChange((e.target as HTMLInputElement).value);
            input.click();
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
        </div>
        <div className="flex flex-wrap gap-1 flex-1">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`w-6 h-6 sm:w-6 sm:h-6 rounded border-2 transition-all hover:scale-110 touch-manipulation ${
                value === preset ? "border-white shadow-lg" : "border-slate-600"
              }`}
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  icon,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation";

  const variantClasses = {
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 shadow-lg hover:shadow-purple-500/25",
    secondary:
      "bg-slate-600 hover:bg-slate-700 text-white focus:ring-slate-500",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-red-500/25",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-green-500/25",
    ghost:
      "bg-transparent hover:bg-slate-700 text-gray-300 focus:ring-slate-500 border border-slate-600 hover:border-slate-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm gap-1.5 min-h-[36px]",
    md: "px-4 py-2 text-sm gap-2 min-h-[40px]",
    lg: "px-6 py-3 text-base gap-2 min-h-[44px]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: string }[];
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  className = "",
}: SelectProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm text-gray-300 font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors touch-manipulation min-h-[44px] text-base sm:text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.icon ? `${option.icon} ` : ""}
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  className = "",
}: NumberInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm text-gray-300 font-medium">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors touch-manipulation min-h-[44px] text-base sm:text-sm"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
