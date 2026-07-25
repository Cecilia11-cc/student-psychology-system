export interface Student {
  id: string;
  student_code: string;
  full_name: string;
  gender?: 'male' | 'female' | 'other';
  birth_date: string;
  school_id: string;
  current_class_id?: string;
  grade_level?: string;
  enrollment_date?: string;
  medical_notes?: string;
  special_needs?: string;
  family_structure?: string;
  is_active: boolean;
  created_at: string;
  // Extended fields
  risk_level?: 'low' | 'moderate' | 'high' | 'critical';
  risk_score?: number;
  label_count?: number;
}

export interface StudentProfile extends Student {
  labels: { id: string; name: string; color: string }[];
  recent_observations: Record<string, unknown>[];
  recent_incidents: Record<string, unknown>[];
}

export interface StudentCreate {
  student_code: string;
  full_name: string;
  gender?: string;
  birth_date: string;
  school_id: string;
  current_class_id?: string;
  grade_level?: string;
  enrollment_date?: string;
  medical_notes?: string;
  special_needs?: string;
  family_structure?: string;
}

export interface StudentUpdate {
  full_name?: string;
  gender?: string;
  grade_level?: string;
  current_class_id?: string;
  medical_notes?: string;
  special_needs?: string;
  family_structure?: string;
  is_active?: boolean;
}
