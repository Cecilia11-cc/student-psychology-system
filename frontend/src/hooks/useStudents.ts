import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../services/studentService';
import type { StudentCreate, StudentUpdate } from '../types/student';
import { message } from 'antd';

export function useStudentList(params?: {
  page?: number;
  page_size?: number;
  class_id?: string;
  grade_level?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentService.list(params),
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getById(id),
    enabled: !!id,
  });
}

export function useStudentProfile(id: string) {
  return useQuery({
    queryKey: ['student-profile', id],
    queryFn: () => studentService.getProfile(id),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StudentCreate) => studentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      message.success('学生创建成功');
    },
    onError: () => {
      message.error('创建失败');
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StudentUpdate }) =>
      studentService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['student-profile', variables.id] });
      message.success('学生信息更新成功');
    },
    onError: () => {
      message.error('更新失败');
    },
  });
}
