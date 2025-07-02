export interface PMAssessmentRequest {
  userId: string;
  responses: {
    product_strategy: string;
    data_analytics: any;
    technical_collaboration: any;
    user_research: any;
    cross_functional_leadership: string;
    stakeholder_management: any;
    team_development: any;
    market_analysis: any;
    business_metrics: any;
    strategic_thinking: any;
    track_record: any;
    executive_communication: any;
    learning_agility: any;
  };
  resume?: any;
}

export interface PMScores {
  productSkills: number;
  leadership: number;
  businessAcumen: number;
  foundation: number;
  mindset: number;
  overall: number;
}

export interface AssessmentResult {
  userId: string;
  scores: PMScores;
  readinessLevel: 'ENTRY_PM' | 'PM' | 'SENIOR_PM' | 'PRINCIPAL_PM' | 'DIRECTOR_PM';
  gaps: string[];
  strengths: string[];
  recommendations: string[];
  confidence: number;
  timestamp: Date;
}
