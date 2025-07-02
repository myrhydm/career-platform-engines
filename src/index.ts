import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PMScoringEngine } from './engines/scoring/PMScoringEngine';
import { PMAssessmentRequest } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize engines
const pmScoringEngine = new PMScoringEngine();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'career-platform-engines',
    version: '1.0.0'
  });
});

// Assessment endpoint
app.post('/api/assess/pm', async (req, res) => {
  try {
    const assessmentRequest: PMAssessmentRequest = req.body;
    const result = await pmScoringEngine.scoreAssessment(assessmentRequest);
    res.json(result);
  } catch (error) {
    console.error('Assessment error:', error);
    res.status(500).json({ error: 'Assessment failed' });
  }
});

// Get scoring breakdown
app.get('/api/engines/info', (req, res) => {
  res.json({
    engines: ['pm-scoring', 'benchmarker', 'planning'],
    version: '1.0.0',
    capabilities: [
      'Product Manager assessment',
      'Skills gap analysis', 
      'Career readiness scoring',
      'Recommendation generation'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🧠 Engines API running on port ${PORT}`);
});

// Export for testing
export { app, pmScoringEngine };
