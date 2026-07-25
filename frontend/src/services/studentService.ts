import api from '../config/api';
import type { ApiResponse } from '../types/user';
import type { Student, StudentCreate, StudentProfile, StudentUpdate } from '../types/student';

interface PaginatedStudents {
  data: Student[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export const studentService = {
  async list(params?: {
    page?: number;
    page_size?: number;
    class_id?: string;
    grade_level?: string;
    search?: string;
  }): Promise<PaginatedStudents> {
    const response = await api.get<PaginatedStudents>('/students', { params });
    return response.data;
  },

  async getById(id: string): Promise<Student> {
    const response = await api.get<ApiResponse<Student>>(`/students/${id}`);
    return response.data.data;
  },

  async getProfile(id: string): Promise<StudentProfile> {
    const response = await api.get<ApiResponse<StudentProfile>>(`/students/${id}/profile`);
    return response.data.data;
  },

  async create(data: StudentCreate): Promise<Student> {
    const response = await api.post<ApiResponse<Student>>('/students', data);
    return response.data.data;
  },

  async update(id: string, data: StudentUpdate): Promise<Student> {
    const response = await api.put<ApiResponse<Student>>(`/students/${id}`, data);
    return response.data.data;
  },

  async linkParent(
    studentId: string,
    parentId: string,
    relationshipType: string
  ): Promise<void> {
    await api.post(`/students/${studentId}/parents`, {
      parent_id: parentId,
      relationship_type: relationshipType,
    });
  },
};
