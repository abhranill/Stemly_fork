export interface STEMVisual {
  id: string;
  title: string;
  prompt: string;
  category: 'Physics' | 'Mathematics' | 'Chemistry' | 'Biology' | 'Computer Science' | 'Astronomy' | 'Other';
  description: string;
  scientificPrinciples: string[];
  interactiveFeatures: string[];
  htmlCode: string;
  createdAt: number;
  fixedCount?: number;
  lastFixSummary?: string;
}

export interface SimulationError {
  message: string;
  line?: number;
  column?: number;
  stack?: string;
  timestamp: number;
}

export interface FixLogEntry {
  id: string;
  timestamp: number;
  error: SimulationError;
  fixSummary: string;
  success: boolean;
}

export interface PresetPrompt {
  id: string;
  title: string;
  category: 'Physics' | 'Mathematics' | 'Chemistry' | 'Biology' | 'Computer Science' | 'Astronomy';
  prompt: string;
  badge: string;
  iconName: string;
  description: string;
}
