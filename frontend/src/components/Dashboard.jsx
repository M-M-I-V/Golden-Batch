import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Card, 
  CardContent, 
  Slider, 
  Typography, 
  Grid, 
  Chip, 
  CircularProgress 
} from '@mui/material';
import FactoryIcon from '@mui/icons-material/Factory';
import SpeedIcon from '@mui/icons-material/Speed';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const Dashboard = () => {
  // State for inputs
  const [temperature, setTemperature] = useState(150);
  const [pressure, setPressure] = useState(30);

  // State for API result
  const [prediction, setPrediction] = useState(null);
  const [isGolden, setIsGolden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  // The function that talks to Python
  const getPrediction = async (temp, press) => {
    setLoading(true);
    setServerError(false);
    try {
      // POST request to your Flask API
      const response = await axios.post('http://localhost:5000/predict', {
        temperature: temp,
        pressure: press
      });

      setPrediction(response.data.prediction);
      setIsGolden(response.data.is_golden_batch);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setServerError(true);
    } finally {
      setLoading(false);
    }
  };

  // Run prediction automatically when inputs change
  // We use a small timeout (debounce) logic via useEffect is tricky with sliders, 
  // so we will call the API on the Slider's 'onChangeCommitted' event instead.
  // But to show initial state, we run once on mount.
  useEffect(() => {
    getPrediction(temperature, pressure);
  }, [pressure, temperature]); // Run once on load

  const handleTempChange = (event, newValue) => {
    setTemperature(newValue);
  };

  const handlePressureChange = (event, newValue) => {
    setPressure(newValue);
  };

  // Trigger API only when user releases the slider (saves server resources)
  const handleCommit = () => {
    getPrediction(temperature, pressure);
  };

  return (
    <Grid container spacing={3}>
      {/* LEFT SIDE: CONTROLS */}
      <Grid item xs={12} md={7}>
        <Card sx={{ height: '100%', backgroundColor: '#2c2c44', color: 'white', borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <FactoryIcon sx={{ mr: 1, color: '#64b5f6' }} />
              <Typography variant="h5">Machine Parameters</Typography>
            </Box>

            {/* Temperature Slider */}
            <Box mb={4} mt={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center">
                  <ThermostatIcon sx={{ color: '#ff7043', mr: 1 }} />
                  <Typography>Temperature</Typography>
                </Box>
                <Typography fontWeight="bold" color="#ff7043">{temperature}°C</Typography>
              </Box>
              <Slider
                value={temperature}
                min={100}
                max={200}
                step={1}
                onChange={handleTempChange}
                onChangeCommitted={handleCommit} // API call happens here
                valueLabelDisplay="auto"
                sx={{ color: '#ff7043' }}
              />
              <Typography variant="caption" color="grey.500">Optimal Range: &gt; 180°C</Typography>
            </Box>

            {/* Pressure Slider */}
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center">
                  <SpeedIcon sx={{ color: '#4db6ac', mr: 1 }} />
                  <Typography>Pressure</Typography>
                </Box>
                <Typography fontWeight="bold" color="#4db6ac">{pressure} PSI</Typography>
              </Box>
              <Slider
                value={pressure}
                min={10}
                max={50}
                step={1}
                onChange={handlePressureChange}
                onChangeCommitted={handleCommit} // API call happens here
                valueLabelDisplay="auto"
                sx={{ color: '#4db6ac' }}
              />
              <Typography variant="caption" color="grey.500">Optimal Range: &lt; 30 PSI</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* RIGHT SIDE: PREDICTION RESULT */}
      <Grid item xs={12} md={5}>
        <Card sx={{ 
          height: '100%', 
          borderRadius: 3,
          backgroundColor: isGolden ? '#1b5e20' : '#b71c1c', // Dynamic background
          color: 'white',
          transition: 'background-color 0.5s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ opacity: 0.8, mb: 2 }}>
              PREDICTED OUTCOME
            </Typography>

            {loading ? (
              <CircularProgress color="inherit" />
            ) : serverError ? (
               <Box>
                 <Typography variant="h4">⚠️ Error</Typography>
                 <Typography variant="body2">Backend Offline</Typography>
               </Box>
            ) : (
              <>
                {isGolden ? (
                  <CheckCircleIcon sx={{ fontSize: 80, mb: 2, color: '#69f0ae' }} />
                ) : (
                  <WarningIcon sx={{ fontSize: 80, mb: 2, color: '#ff8a80' }} />
                )}

                <Typography variant="h3" fontWeight="bold">
                  {prediction || "..."}
                </Typography>

                <Chip 
                  label={isGolden ? "GOLDEN BATCH" : "DEFECT RISK"} 
                  sx={{ 
                    mt: 2, 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: 'white', 
                    fontWeight: 'bold' 
                  }} 
                />
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;