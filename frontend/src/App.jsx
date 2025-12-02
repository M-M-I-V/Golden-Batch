import React, { useState, useCallback } from 'react';

// === API Configuration and Helpers ===

const API_BASE_URL = 'http://127.0.0.1:5000/predict';
const MAX_RETRIES = 5;

/**
 * Custom hook for managing the simulator's state and logic.
 */
const useSimulator = () => {
    // 1. Input State: Stores the values for the manufacturing parameters
    const [inputs, setInputs] = useState({
        temperature: 150, // Default mid-range value
        pressure: 5,    // Default mid-range value
    });

    // 2. UI/Process State
    const [prediction, setPrediction] = useState(null); // 'Pass', 'Fail', or null
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper to update individual input fields
    const handleInputChange = useCallback((name, value) => {
        setInputs(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
    }, []);

    // Function to handle the API call with exponential backoff
    const simulateBatch = useCallback(async () => {
        setLoading(true);
        setPrediction(null);
        setError(null);

        const payload = {
            temperature: inputs.temperature,
            pressure: inputs.pressure,
        };

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                // Exponential backoff logic
                if (attempt > 0) {
                    const delay = Math.pow(2, attempt) * 1000;
                    console.log(`Retrying API call in ${delay / 1000}s... (Attempt ${attempt + 1})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                const response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                // API call successful, update prediction and break loop
                setPrediction(data.prediction === 'Pass' ? 'Pass' : 'Fail');
                setLoading(false);
                return;

            } catch (err) {
                console.error('Simulation error:', err);
                if (attempt === MAX_RETRIES - 1) {
                    setError(`Failed to connect to backend after ${MAX_RETRIES} attempts. Ensure Python server is running on ${API_BASE_URL}. Error: ${err.message}`);
                    setLoading(false);
                }
            }
        }
    }, [inputs]);

    return { inputs, prediction, loading, error, handleInputChange, simulateBatch };
};

/**
 * Main application component.
 * @returns {JSX.Element} The Golden Batch Simulator UI.
 */
export default function App() {
    const { inputs, prediction, loading, error, handleInputChange, simulateBatch } = useSimulator();

    // --- Component for individual slider input ---
    const SliderInput = ({ label, name, value, min, max, step, unit }) => (
        <div className="p-4 bg-white/5 rounded-xl shadow-lg border border-indigo-700/50">
            <label className="text-lg font-semibold text-indigo-200 block mb-3">
                {label} ({unit})
            </label>
            <div className="flex items-center space-x-4">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                    className="w-full h-2 bg-indigo-900 rounded-lg appearance-none cursor-pointer range-lg"
                    style={{ '--tw-ring-color': '#4f46e5' }} // Custom styling hook for thumb/track
                />
                <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                    className="w-24 p-2 text-center text-lg bg-indigo-900 border border-indigo-600 rounded-lg text-white font-mono focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                />
            </div>
            <div className="flex justify-between text-sm mt-1 text-indigo-400">
                <span>Min: {min}</span>
                <span>Max: {max}</span>
            </div>
        </div>
    );

    // --- Component for prediction result display ---
    const PredictionDisplay = () => {
        let statusText = 'Awaiting Simulation...';
        let statusColor = 'bg-gray-700 border-gray-500';

        if (loading) {
            statusText = 'Running AI Model...';
            statusColor = 'bg-yellow-600/70 border-yellow-400 animate-pulse';
        } else if (error) {
            statusText = 'Connection Error';
            statusColor = 'bg-red-700 border-red-500';
        } else if (prediction === 'Pass') {
            statusText = 'GOLDEN BATCH (Pass):';
            statusColor = 'bg-green-700 border-green-400';
        } else if (prediction === 'Fail') {
            statusText = 'BATCH FAILURE (Fail)';
            statusColor = 'bg-red-700 border-red-500';
        }

        return (
            <div className="w-full text-center mt-8">
                <div className={`p-6 rounded-2xl shadow-2xl border-4 ${statusColor} transition-all duration-500`}>
                    <h2 className="text-3xl font-extrabold text-white tracking-wider">
                        PREDICTION RESULT
                    </h2>
                    <p className="mt-2 text-xl font-mono">
                        {statusText}
                    </p>
                </div>
                {error && (
                    <div className="mt-4 p-4 bg-red-900 border border-red-600 text-red-200 rounded-lg text-sm text-left font-mono">
                        **Backend Error:** {error}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-8 flex justify-center items-start">
            <div className="w-full max-w-4xl bg-gray-800 rounded-3xl shadow-[0_0_50px_rgba(79,46,229,0.3)] p-6 sm:p-10 my-8">

                {/* Header */}
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-400 tracking-tight">
                        <span className="text-yellow-400">🏭</span> Golden Batch Simulator
                    </h1>
                    <p className="text-lg text-gray-400 mt-2 font-light">
                        Digital Twin: Predict Quality Control before production.
                    </p>
                </header>

                {/* Main Control Panel */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-indigo-300 border-b border-indigo-800 pb-3">
                        Machine Parameter Inputs
                    </h2>

                    {/* Input Sliders */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SliderInput
                            label="temperature"
                            name="temperature"
                            value={inputs.temperature}
                            min={100}
                            max={200}
                            step={1}
                            unit="°C"
                        />
                        <SliderInput
                            label="pressure"
                            name="pressure"
                            value={inputs.pressure}
                            min={10}
                            max={50}
                            step={1}
                            unit="bar"
                        />
                    </div>

                    {/* Simulation Action Button */}
                    <div className="pt-8 flex justify-center">
                        <button
                            onClick={simulateBatch}
                            disabled={loading}
                            className={`
                                w-full sm:w-2/3 lg:w-1/2 p-4 text-xl font-bold rounded-xl shadow-2xl transition duration-300
                                ${loading
                                    ? 'bg-gray-500 cursor-not-allowed flex items-center justify-center'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white transform hover:scale-[1.01] active:scale-95 ring-4 ring-indigo-300/30'
                                }
                            `}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    SIMULATING...
                                </>
                            ) : (
                                'RUN DIGITAL TWIN SIMULATION'
                            )}
                        </button>
                    </div>

                    {/* Output Area */}
                    <PredictionDisplay />

                </div>

                {/* Footer / Debug Info */}
                <div className="mt-12 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
                    <p>PMAX-EMAX Hackathon 2025 Entry | Backend API: {API_BASE_URL}</p>
                </div>

            </div>
        </div>
    );
}