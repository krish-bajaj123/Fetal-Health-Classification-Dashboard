export interface CTGMeasurements {
  'baseline value': number | null;
  accelerations: number | null;
  fetal_movement: number | null;
  uterine_contractions: number | null;
  light_decelerations: number | null;
  severe_decelerations: number | null;
  prolongued_decelerations: number | null;
  abnormal_short_term_variability: number | null;
  mean_value_of_short_term_variability: number | null;
  percentage_of_time_with_abnormal_long_term_variability: number | null;
  mean_value_of_long_term_variability: number | null;
  histogram_width: number | null;
  histogram_min: number | null;
  histogram_max: number | null;
  histogram_number_of_peaks: number | null;
  histogram_number_of_zeroes: number | null;
  histogram_mode: number | null;
  histogram_mean: number | null;
  histogram_median: number | null;
  histogram_variance: number | null;
  histogram_tendency: number | null;
}

export type CTGMeasurementKey = keyof CTGMeasurements;

export interface FieldDefinition {
  key: CTGMeasurementKey;
  label: string;
  category: 'Heart Rate & Movement' | 'Decelerations' | 'Variability' | 'Histogram Analysis';
  description: string;
  placeholder: string;
  step: string;
  min?: number;
  max?: number;
}

export const SCAN_FIELDS: FieldDefinition[] = [
  // Category 1: Heart Rate & Movement
  {
    key: 'baseline value',
    label: 'Baseline Fetal Heart Rate (bpm)',
    category: 'Heart Rate & Movement',
    description: 'Baseline fetal heart rate in beats per minute (normal: 110-160)',
    placeholder: 'e.g. 132',
    step: 'any',
  },
  {
    key: 'accelerations',
    label: 'Accelerations',
    category: 'Heart Rate & Movement',
    description: 'Number of accelerations per second',
    placeholder: 'e.g. 0.006',
    step: 'any',
  },
  {
    key: 'fetal_movement',
    label: 'Fetal Movement',
    category: 'Heart Rate & Movement',
    description: 'Number of fetal movements per second',
    placeholder: 'e.g. 0.000',
    step: 'any',
  },
  {
    key: 'uterine_contractions',
    label: 'Uterine Contractions',
    category: 'Heart Rate & Movement',
    description: 'Number of uterine contractions per second',
    placeholder: 'e.g. 0.003',
    step: 'any',
  },

  // Category 2: Decelerations
  {
    key: 'light_decelerations',
    label: 'Light Decelerations',
    category: 'Decelerations',
    description: 'Number of light decelerations per second',
    placeholder: 'e.g. 0.000',
    step: 'any',
  },
  {
    key: 'severe_decelerations',
    label: 'Severe Decelerations',
    category: 'Decelerations',
    description: 'Number of severe decelerations per second',
    placeholder: 'e.g. 0.000',
    step: 'any',
  },
  {
    key: 'prolongued_decelerations',
    label: 'Prolonged Decelerations',
    category: 'Decelerations',
    description: 'Number of prolonged decelerations per second',
    placeholder: 'e.g. 0.000',
    step: 'any',
  },

  // Category 3: Variability
  {
    key: 'abnormal_short_term_variability',
    label: 'Abnormal Short Term Variability (%)',
    category: 'Variability',
    description: 'Percentage of time with abnormal short term variability',
    placeholder: 'e.g. 17',
    step: 'any',
  },
  {
    key: 'mean_value_of_short_term_variability',
    label: 'Mean Value of Short Term Variability',
    category: 'Variability',
    description: 'Mean short term variability value',
    placeholder: 'e.g. 2.1',
    step: 'any',
  },
  {
    key: 'percentage_of_time_with_abnormal_long_term_variability',
    label: '% Time Abnormal Long Term Variability',
    category: 'Variability',
    description: 'Percentage of time with abnormal long term variability',
    placeholder: 'e.g. 0',
    step: 'any',
  },
  {
    key: 'mean_value_of_long_term_variability',
    label: 'Mean Value of Long Term Variability',
    category: 'Variability',
    description: 'Mean long term variability value',
    placeholder: 'e.g. 10.4',
    step: 'any',
  },

  // Category 4: Histogram Analysis
  {
    key: 'histogram_width',
    label: 'Histogram Width',
    category: 'Histogram Analysis',
    description: 'Width of FHR histogram',
    placeholder: 'e.g. 130',
    step: 'any',
  },
  {
    key: 'histogram_min',
    label: 'Histogram Min',
    category: 'Histogram Analysis',
    description: 'Minimum of FHR histogram',
    placeholder: 'e.g. 68',
    step: 'any',
  },
  {
    key: 'histogram_max',
    label: 'Histogram Max',
    category: 'Histogram Analysis',
    description: 'Maximum of FHR histogram',
    placeholder: 'e.g. 198',
    step: 'any',
  },
  {
    key: 'histogram_number_of_peaks',
    label: 'Histogram Number of Peaks',
    category: 'Histogram Analysis',
    description: 'Number of histogram peaks',
    placeholder: 'e.g. 6',
    step: 'any',
  },
  {
    key: 'histogram_number_of_zeroes',
    label: 'Histogram Number of Zeroes',
    category: 'Histogram Analysis',
    description: 'Number of histogram zeroes',
    placeholder: 'e.g. 1',
    step: 'any',
  },
  {
    key: 'histogram_mode',
    label: 'Histogram Mode',
    category: 'Histogram Analysis',
    description: 'Histogram mode',
    placeholder: 'e.g. 141',
    step: 'any',
  },
  {
    key: 'histogram_mean',
    label: 'Histogram Mean',
    category: 'Histogram Analysis',
    description: 'Histogram mean',
    placeholder: 'e.g. 136',
    step: 'any',
  },
  {
    key: 'histogram_median',
    label: 'Histogram Median',
    category: 'Histogram Analysis',
    description: 'Histogram median',
    placeholder: 'e.g. 140',
    step: 'any',
  },
  {
    key: 'histogram_variance',
    label: 'Histogram Variance',
    category: 'Histogram Analysis',
    description: 'Histogram variance',
    placeholder: 'e.g. 12',
    step: 'any',
  },
  {
    key: 'histogram_tendency',
    label: 'Histogram Tendency',
    category: 'Histogram Analysis',
    description: 'Tendency (-1: left asymmetric, 0: symmetric, 1: right asymmetric)',
    placeholder: 'e.g. 0',
    step: 'any',
  },
];

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  content: string;
  timestamp: string;
  isError?: boolean;
  metadata?: {
    prediction?: string;
    submittedValues?: Record<string, number>;
  };
}

export const PRESET_PROFILES: Record<string, { name: string; description: string; values: Record<CTGMeasurementKey, number> }> = {
  normal: {
    name: 'Normal Profile',
    description: 'Typical normal fetal heart rate and activity readings',
    values: {
      'baseline value': 132,
      accelerations: 0.006,
      fetal_movement: 0,
      uterine_contractions: 0.003,
      light_decelerations: 0,
      severe_decelerations: 0,
      prolongued_decelerations: 0,
      abnormal_short_term_variability: 17,
      mean_value_of_short_term_variability: 2.1,
      percentage_of_time_with_abnormal_long_term_variability: 0,
      mean_value_of_long_term_variability: 10.4,
      histogram_width: 130,
      histogram_min: 68,
      histogram_max: 198,
      histogram_number_of_peaks: 6,
      histogram_number_of_zeroes: 1,
      histogram_mode: 141,
      histogram_mean: 136,
      histogram_median: 140,
      histogram_variance: 12,
      histogram_tendency: 0,
    },
  },
  suspect: {
    name: 'Suspect Profile',
    description: 'Borderline or suspect variability and deceleration metrics',
    values: {
      'baseline value': 148,
      accelerations: 0,
      fetal_movement: 0.003,
      uterine_contractions: 0.001,
      light_decelerations: 0,
      severe_decelerations: 0,
      prolongued_decelerations: 0,
      abnormal_short_term_variability: 68,
      mean_value_of_short_term_variability: 0.4,
      percentage_of_time_with_abnormal_long_term_variability: 48,
      mean_value_of_long_term_variability: 4.2,
      histogram_width: 32,
      histogram_min: 135,
      histogram_max: 167,
      histogram_number_of_peaks: 2,
      histogram_number_of_zeroes: 0,
      histogram_mode: 150,
      histogram_mean: 149,
      histogram_median: 151,
      histogram_variance: 1,
      histogram_tendency: 0,
    },
  },
  pathological: {
    name: 'Pathological Profile',
    description: 'High variability abnormalities and prolonged decelerations',
    values: {
      'baseline value': 130,
      accelerations: 0,
      fetal_movement: 0,
      uterine_contractions: 0.001,
      light_decelerations: 0,
      severe_decelerations: 0,
      prolongued_decelerations: 0.002,
      abnormal_short_term_variability: 65,
      mean_value_of_short_term_variability: 2.3,
      percentage_of_time_with_abnormal_long_term_variability: 9,
      mean_value_of_long_term_variability: 0,
      histogram_width: 67,
      histogram_min: 69,
      histogram_max: 136,
      histogram_number_of_peaks: 2,
      histogram_number_of_zeroes: 0,
      histogram_mode: 133,
      histogram_mean: 124,
      histogram_median: 130,
      histogram_variance: 35,
      histogram_tendency: 0,
    },
  },
};
