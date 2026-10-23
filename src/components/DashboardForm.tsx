import React from 'react';
import {
  SCAN_FIELDS,
  CTGMeasurements,
  CTGMeasurementKey,
  PRESET_PROFILES,
} from '../types';
import { Activity, RotateCcw, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DashboardFormProps {
  values: Record<CTGMeasurementKey, string>;
  errors: Partial<Record<CTGMeasurementKey, string>>;
  isLoading: boolean;
  onChange: (key: CTGMeasurementKey, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onApplyPreset: (presetKey: 'normal' | 'suspect' | 'pathological') => void;
  onClear: () => void;
}

export const DashboardForm: React.FC<DashboardFormProps> = ({
  values,
  errors,
  isLoading,
  onChange,
  onSubmit,
  onApplyPreset,
  onClear,
}) => {
  // Count how many of the 21 fields have been filled
  const filledCount = SCAN_FIELDS.filter(
    (field) => values[field.key] !== undefined && values[field.key].trim() !== ''
  ).length;

  const categories = [
    'Heart Rate & Movement',
    'Decelerations',
    'Variability',
    'Histogram Analysis',
  ] as const;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
      {/* Panel Header */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-semibold text-slate-900">
                Scan Measurements Dashboard
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Enter all 21 cardiotocography numerical measurements below.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
                filledCount === 21
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {filledCount === 21 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-400" />
              )}
              {filledCount} of 21 fields completed
            </span>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Load preset:
          </span>
          <button
            type="button"
            onClick={() => onApplyPreset('normal')}
            className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition border border-slate-200 hover:border-blue-200 cursor-pointer"
            title="Load normal scan measurements sample"
          >
            Normal Sample
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('suspect')}
            className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition border border-slate-200 hover:border-blue-200 cursor-pointer"
            title="Load suspect scan measurements sample"
          >
            Suspect Sample
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('pathological')}
            className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition border border-slate-200 hover:border-blue-200 cursor-pointer"
            title="Load pathological scan measurements sample"
          >
            Pathological Sample
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-xs px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-500 transition border border-slate-200 ml-auto flex items-center gap-1 cursor-pointer"
            title="Clear all fields"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>

      {/* Form Form Body */}
      <form onSubmit={onSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
          {categories.map((category) => {
            const fieldsInCategory = SCAN_FIELDS.filter(
              (f) => f.category === category
            );

            return (
              <div
                key={category}
                className="bg-slate-50/60 rounded-lg p-4 border border-slate-200/80"
              >
                <h3 className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  {category}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {fieldsInCategory.map((field) => {
                    const hasError = !!errors[field.key];
                    const val = values[field.key] ?? '';

                    return (
                      <div key={field.key} className="flex flex-col">
                        <label
                          htmlFor={`field-${field.key}`}
                          className="text-xs font-medium text-slate-700 mb-1 flex items-center justify-between"
                        >
                          <span title={`API field key: ${field.key}`}>
                            {field.label}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {field.key}
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            id={`field-${field.key}`}
                            type="number"
                            step={field.step}
                            value={val}
                            onChange={(e) => onChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            disabled={isLoading}
                            className={`w-full px-3 py-2 text-sm bg-white rounded-md border transition-all outline-none focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 ${
                              hasError
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100 text-red-900 bg-red-50/30'
                                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100 text-slate-900'
                            }`}
                          />
                        </div>
                        {hasError && (
                          <span className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {errors[field.key]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Footer with Submit button */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          {filledCount < 21 && (
            <p className="text-xs text-amber-600 mb-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              All 21 scan measurements are required before submission ({21 - filledCount} remaining).
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-5 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Evaluating measurements...
              </>
            ) : (
              <>
                <span>Submit profile</span>
                <span className="text-xs bg-blue-700/60 px-2 py-0.5 rounded text-blue-100">
                  21 values
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
