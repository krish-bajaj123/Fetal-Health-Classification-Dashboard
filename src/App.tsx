/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DashboardForm } from './components/DashboardForm';
import { ChatbotPanel } from './components/ChatbotPanel';
import {
  SCAN_FIELDS,
  CTGMeasurementKey,
  PRESET_PROFILES,
  ChatMessage,
} from './types';
import { Stethoscope } from 'lucide-react';

const DIRECT_API_URL =
  'https://capml.augi.ca/api/hosted-models/18d776f2b2a9c69a126494dd67c08b83/predict';
const PROXY_API_URL = '/api/predict';

export default function App() {
  // Pre-load with the Normal preset so the user can immediately submit or edit
  const initialValues: Record<CTGMeasurementKey, string> = {} as Record<
    CTGMeasurementKey,
    string
  >;
  for (const field of SCAN_FIELDS) {
    initialValues[field.key] = String(PRESET_PROFILES.normal.values[field.key]);
  }

  const [values, setValues] = useState<Record<CTGMeasurementKey, string>>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<CTGMeasurementKey, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      content:
        'Hello! Fill out the 21 scan measurements on the dashboard and click "Submit profile" to classify fetal health status.\n\nIntended categories: normal, suspect, and pathological.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleFieldChange = (key: CTGMeasurementKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleApplyPreset = (presetKey: 'normal' | 'suspect' | 'pathological') => {
    const preset = PRESET_PROFILES[presetKey];
    if (!preset) return;

    const newValues: Record<CTGMeasurementKey, string> = {} as Record<
      CTGMeasurementKey,
      string
    >;
    for (const field of SCAN_FIELDS) {
      newValues[field.key] = String(preset.values[field.key]);
    }

    setValues(newValues);
    setErrors({});

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `preset-${Date.now()}`,
        sender: 'system',
        content: `Loaded ${preset.name} values (${preset.description}). Click "Submit profile" to evaluate.`,
        timestamp: time,
      },
    ]);
  };

  const handleClear = () => {
    const emptyValues: Record<CTGMeasurementKey, string> = {} as Record<
      CTGMeasurementKey,
      string
    >;
    for (const field of SCAN_FIELDS) {
      emptyValues[field.key] = '';
    }
    setValues(emptyValues);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation: Require all 21 values
    const newErrors: Partial<Record<CTGMeasurementKey, string>> = {};
    const numericRow: Record<string, number> = {};

    for (const field of SCAN_FIELDS) {
      const rawVal = values[field.key];
      if (rawVal === undefined || rawVal === null || rawVal.trim() === '') {
        newErrors[field.key] = 'This measurement is required';
      } else {
        const num = Number(rawVal);
        if (isNaN(num)) {
          newErrors[field.key] = 'Must be a valid number';
        } else {
          numericRow[field.key] = num;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: `val-err-${Date.now()}`,
          sender: 'bot',
          isError: true,
          content: `Please enter all 21 numerical measurements before submitting (${Object.keys(newErrors).length} missing or invalid).`,
          timestamp: time,
        },
      ]);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message to conversation
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: `Submitted profile: 21 scan measurements (Baseline FHR: ${numericRow['baseline value']} bpm, Accelerations: ${numericRow['accelerations']})`,
      timestamp: currentTime,
      metadata: {
        submittedValues: numericRow,
      },
    };

    setMessages((prev) => [...prev, userMsg]);

    const requestPayload = {
      rows: [numericRow],
    };

    try {
      let data: any = null;

      // Send POST request (trying direct endpoint first, then proxy fallback)
      try {
        const directResponse = await fetch(DIRECT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload),
        });

        if (directResponse.ok) {
          data = await directResponse.json();
        } else {
          throw new Error(`Direct request failed with HTTP ${directResponse.status}`);
        }
      } catch (directError) {
        // Fallback to proxy
        const proxyResponse = await fetch(PROXY_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload),
        });

        if (!proxyResponse.ok) {
          const errBody = await proxyResponse.text().catch(() => '');
          throw new Error(errBody || `HTTP ${proxyResponse.status} ${proxyResponse.statusText}`);
        }

        data = await proxyResponse.json();
      }

      // Read the returned classification from: response.result.predictions[0].prediction
      const returnedValue = data?.result?.predictions?.[0]?.prediction;

      if (returnedValue !== undefined && returnedValue !== null) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          // Exactly as required: “The model’s predicted fetal health class is: [returned value].”
          content: `The model’s predicted fetal health class is: ${returnedValue}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metadata: {
            prediction: String(returnedValue),
          },
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('Unexpected response format from prediction API.');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        isError: true,
        content: `Error: Unable to retrieve classification from the model API. (${err.message || 'Network request failed'})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        content:
          'Chat history cleared. Enter scan measurements and click "Submit profile" to run classification.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Fetal Health Classification
              </h1>
              <p className="text-xs text-slate-500">
                Cardiotocogram Scan Measurements & Prediction Model
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Model Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area: Two Panels on One Page */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Dashboard Form (7 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <DashboardForm
              values={values}
              errors={errors}
              isLoading={isLoading}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              onApplyPreset={handleApplyPreset}
              onClear={handleClear}
            />
          </div>

          {/* Right Panel: Chatbot Panel (5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
            <ChatbotPanel
              messages={messages}
              isLoading={isLoading}
              onClearHistory={handleClearHistory}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400">
        <p>
          Fetal Health Classification Dashboard &bull; For demonstration only. This prediction is not a medical diagnosis.
        </p>
      </footer>
    </div>
  );
}
