import { PMAssessmentRequest, PMScores, AssessmentResult } from '../../types';

export class PMScoringEngine {
  
  async scoreAssessment(request: PMAssessmentRequest): Promise<AssessmentResult> {
    const scores = await this.calculateScores(request);
    const readinessLevel = this.determineReadinessLevel(scores.overall);
    const analysis = this.analyzeResults(scores, request.responses);
    
    return {
      userId: request.userId,
      scores,
      readinessLevel,
      gaps: analysis.gaps,
      strengths: analysis.strengths,
      recommendations: analysis.recommendations,
      confidence: analysis.confidence,
      timestamp: new Date()
    };
  }

  private async calculateScores(request: PMAssessmentRequest): Promise<PMScores> {
    // Product Skills (30% weight)
    const productSkills = this.scoreProductSkills(request.responses);
    
    // Leadership (25% weight)  
    const leadership = this.scoreLeadership(request.responses);
    
    // Business Acumen (20% weight)
    const businessAcumen = this.scoreBusinessAcumen(request.responses);
    
    // Foundation (15% weight)
    const foundation = this.scoreFoundation(request.responses);
    
    // Mindset (10% weight)
    const mindset = this.scoreMindset(request.responses);
    
    // Calculate weighted overall score
    const overall = Math.round(
      (productSkills * 0.30) +
      (leadership * 0.25) +
      (businessAcumen * 0.20) +
      (foundation * 0.15) +
      (mindset * 0.10)
    );

    return {
      productSkills,
      leadership,
      businessAcumen,
      foundation,
      mindset,
      overall
    };
  }

  private scoreProductSkills(responses: any): number {
    let score = 50; // Base score
    
    // Product strategy analysis
    const strategy = responses.product_strategy || '';
    if (strategy.length > 100) score += 10;
    if (strategy.includes('market') && strategy.includes('user')) score += 10;
    if (strategy.includes('metric') || strategy.includes('data')) score += 10;
    
    // Data analytics skills
    const analytics = responses.data_analytics || {};
    if (analytics.sql_rating >= 4) score += 10;
    if (analytics.ab_testing_rating >= 3) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private scoreLeadership(responses: any): number {
    let score = 50;
    
    // Cross-functional leadership
    const leadership = responses.cross_functional_leadership || '';
    if (leadership.length > 150) score += 15;
    if (leadership.includes('stakeholder')) score += 10;
    if (leadership.includes('influence')) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private scoreBusinessAcumen(responses: any): number {
    let score = 50;
    
    // Market analysis
    const market = responses.market_analysis || {};
    if (market.competitive_analysis) score += 15;
    if (market.market_size_knowledge) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private scoreFoundation(responses: any): number {
    let score = 50;
    
    // Track record
    const track = responses.track_record || {};
    if (track.product_launches >= 2) score += 20;
    if (track.quantified_impact) score += 15;
    
    return Math.min(100, Math.max(0, score));
  }

  private scoreMindset(responses: any): number {
    let score = 50;
    
    // Learning agility
    const learning = responses.learning_agility || {};
    if (learning.continuous_learning) score += 15;
    if (learning.adapts_quickly) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private determineReadinessLevel(overallScore: number): AssessmentResult['readinessLevel'] {
    if (overallScore >= 85) return 'DIRECTOR_PM';
    if (overallScore >= 75) return 'PRINCIPAL_PM';
    if (overallScore >= 65) return 'SENIOR_PM';
    if (overallScore >= 45) return 'PM';
    return 'ENTRY_PM';
  }

  private analyzeResults(scores: PMScores, responses: any) {
    const gaps: string[] = [];
    const strengths: string[] = [];
    const recommendations: string[] = [];

    // Identify gaps (scores below 60)
    if (scores.productSkills < 60) {
      gaps.push('Product Skills');
      recommendations.push('Focus on product strategy frameworks and data analysis');
    }
    if (scores.leadership < 60) {
      gaps.push('Leadership');
      recommendations.push('Develop cross-functional leadership and stakeholder management');
    }
    if (scores.businessAcumen < 60) {
      gaps.push('Business Acumen');
      recommendations.push('Strengthen market analysis and business metrics understanding');
    }

    // Identify strengths (scores above 75)
    if (scores.productSkills > 75) strengths.push('Strong Product Skills');
    if (scores.leadership > 75) strengths.push('Strong Leadership');
    if (scores.businessAcumen > 75) strengths.push('Strong Business Acumen');
    if (scores.foundation > 75) strengths.push('Strong Foundation');
    if (scores.mindset > 75) strengths.push('Strong Mindset');

    const confidence = Math.min(0.95, 0.7 + (gaps.length === 0 ? 0.2 : 0) + (strengths.length * 0.05));

    return { gaps, strengths, recommendations, confidence };
  }
}
