import Dashboard from './components/Dashboard';
import { Box, Typography } from '@mui/material';

function App() {
  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: 2,
      textAlign: 'center' 
    }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#64b5f6' }}>
        🏭 Golden Batch Simulator
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: '#b0bec5' }}>
        Real-time Digital Twin & Quality Prediction
      </Typography>
      
      <Dashboard />
    </Box>
  )
}

export default App