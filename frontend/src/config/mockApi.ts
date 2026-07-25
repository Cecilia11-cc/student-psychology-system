/**
 * Mock API handler for demo/static deployment.
 * When the backend is unavailable (GitHub Pages), this intercepts API calls
 * and returns realistic demo data.
 */
import type { ApiResponse } from '../types/user';
import type { Student, StudentProfile, StudentCreate, StudentUpdate } from '../types/student';
import { DEMO_STUDENTS, DEMO_STUDENT_PROFILES, DEMO_USERS } from './mockData';

// Simulated network delay
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// In-memory mutable copy for demo
const students = [...DEMO_STUDENTS];
const profiles = { ...DEMO_STUDENT_PROFILES };

function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    pagination: {
      page,
      page_size: pageSize,
      total,
      total_pages: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}

function wrap<T>(data: T, message = '操作成功'): ApiResponse<T> {
  return { success: true, data, message };
}

export async function handleMockRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<unknown> {
  await delay();

  const urlPath = url.replace('/api/v1', '');

  // ===== AUTH =====
  if (urlPath === '/auth/login' && method === 'post') {
    const { username } = data as { username: string; password: string };
    const demo = DEMO_USERS[username];
    if (demo) {
      return wrap({
        access_token: demo.token,
        refresh_token: demo.token + '-refresh',
        token_type: 'bearer',
        user: demo.user,
      });
    }
    throw { response: { status: 401, data: { detail: '用户名或密码错误' } } };
  }

  if (urlPath === '/auth/me' && method === 'get') {
    const stored = localStorage.getItem('user');
    if (stored) {
      return wrap(JSON.parse(stored));
    }
    throw { response: { status: 401 } };
  }

  if (urlPath === '/auth/refresh' && method === 'post') {
    return wrap({ access_token: 'demo-refreshed-token', refresh_token: 'demo-refresh-token' });
  }

  // ===== STUDENTS =====
  if (urlPath === '/students' && method === 'get') {
    return paginate(students, 1, 20);
  }

  if (urlPath === '/students' && method === 'post') {
    const newStudent: Student = {
      id: `demo-stu-${Date.now()}`,
      ...(data as StudentCreate),
      is_active: true,
      risk_level: undefined,
      risk_score: undefined,
      label_count: 0,
      created_at: new Date().toISOString(),
    } as Student;
    students.unshift(newStudent);
    return wrap(newStudent, '学生创建成功');
  }

  // /students/:id
  const studentMatch = urlPath.match(/^\/students\/([a-zA-Z0-9-]+)$/);
  if (studentMatch && method === 'get') {
    const id = studentMatch[1];
    const student = students.find((s) => s.id === id);
    if (student) return wrap(student);
    throw { response: { status: 404, data: { detail: '学生不存在' } } };
  }

  if (studentMatch && method === 'put') {
    const id = studentMatch[1];
    const idx = students.findIndex((s) => s.id === id);
    if (idx >= 0) {
      students[idx] = { ...students[idx], ...(data as StudentUpdate) };
      return wrap(students[idx], '学生更新成功');
    }
    throw { response: { status: 404 } };
  }

  // /students/:id/profile
  const profileMatch = urlPath.match(/^\/students\/([a-zA-Z0-9-]+)\/profile$/);
  if (profileMatch && method === 'get') {
    const id = profileMatch[1];
    const profile = profiles[id];
    if (profile) return wrap(profile);
    // Return student with empty profile
    const student = students.find((s) => s.id === id);
    if (student) {
      return wrap({
        ...student,
        labels: [],
        recent_observations: [],
        recent_incidents: [],
      } as StudentProfile);
    }
    throw { response: { status: 404 } };
  }

  // ===== OBSERVATIONS =====
  if (urlPath === '/observations' && method === 'get') {
    return paginate([], 1, 20);
  }

  if (urlPath === '/observations' && method === 'post') {
    return wrap({ id: `demo-obs-${Date.now()}`, created_at: new Date().toISOString() }, '观察记录成功');
  }

  // Templates
  if (urlPath.includes('/observations/templates') && method === 'get') {
    return wrap([
      {
        id: 'tpl-001',
        name: '日常行为观察表',
        description: '适用于日常课堂行为观察',
        applicable_grade_levels: ['G1', 'G2', 'G3'],
        frequency: 'daily',
        dimension_ids: [],
        custom_questions: [],
        is_system: true,
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
      },
      {
        id: 'tpl-002',
        name: '幼儿园综合观察表',
        description: '适用于幼儿园的全面发展观察',
        applicable_grade_levels: ['K1', 'K2', 'K3'],
        frequency: 'weekly',
        dimension_ids: [],
        custom_questions: [],
        is_system: true,
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
      },
    ]);
  }

  // ===== DASHBOARD =====
  if (urlPath === '/dashboard/overview' && method === 'get') {
    return wrap({
      total_students: 42,
      today_observations: 15,
      risk_alerts: 3,
      completed: 28,
      risk_distribution: { low: 32, moderate: 7, high: 2, critical: 1 },
    });
  }

  // ===== DIMENSIONS =====
  if (urlPath === '/dimensions' && method === 'get') {
    return wrap([
      { code: 'EMO_REG', name_zh: '情绪调节能力', category: 'emotional' },
      { code: 'BEH_ATTN', name_zh: '注意力集中', category: 'behavioral' },
      { code: 'SOC_PEER', name_zh: '同伴关系', category: 'social' },
    ]);
  }

  // ===== INCIDENTS =====
  if (urlPath === '/incidents' && method === 'get') {
    return paginate([
      { id: 'i1', student_id: 'demo-stu-002', incident_type: 'disruption', severity: 'minor', incident_date: '2026-07-22', description: '上课时频繁离开座位', is_resolved: false },
      { id: 'i2', student_id: 'demo-stu-005', incident_type: 'aggression_physical', severity: 'major', incident_date: '2026-07-20', description: '与同学发生肢体冲突', is_resolved: true },
    ], 1, 20);
  }
  if (urlPath === '/incidents' && method === 'post') {
    return wrap({ id: `demo-inc-${Date.now()}` }, '事件报告成功');
  }

  // ===== ANALYSIS =====
  const riskMatch = urlPath.match(/^\/analysis\/risk\/([a-zA-Z0-9-]+)$/);
  if (riskMatch && method === 'get') {
    return wrap({
      overall_risk_score: 42.5,
      risk_level: 'moderate',
      risk_label: '中等风险',
      confidence: 0.87,
      observation_count: 15,
      severity_multiplier: 1.0,
      factor_breakdown: [
        { dimension_code: 'EMO_REG', score: 65.2, weight: 0.08, contribution: 5.22, contribution_pct: 28.5 },
        { dimension_code: 'BEH_ATTN', score: 58.0, weight: 0.05, contribution: 2.90, contribution_pct: 15.8 },
        { dimension_code: 'SOC_PEER', score: 45.3, weight: 0.05, contribution: 2.27, contribution_pct: 12.4 },
        { dimension_code: 'BEH_AGG', score: 32.1, weight: 0.07, contribution: 2.25, contribution_pct: 12.3 },
        { dimension_code: 'EMO_ANX', score: 40.5, weight: 0.07, contribution: 2.84, contribution_pct: 15.5 },
        { dimension_code: 'SOC_ISOL', score: 38.2, weight: 0.04, contribution: 1.53, contribution_pct: 8.3 },
      ],
      top_factors: [
        { dimension_code: 'EMO_REG', score: 65.2, weight: 0.08, contribution: 5.22, contribution_pct: 28.5 },
        { dimension_code: 'BEH_ATTN', score: 58.0, weight: 0.05, contribution: 2.90, contribution_pct: 15.8 },
        { dimension_code: 'EMO_ANX', score: 40.5, weight: 0.07, contribution: 2.84, contribution_pct: 15.5 },
      ],
    });
  }

  const trendsMatch = urlPath.match(/^\/analysis\/trends\/([a-zA-Z0-9-]+)$/);
  if (trendsMatch && method === 'get') {
    return wrap({
      labels: ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'],
      datasets: [
        { label: '风险评分', data: [55, 52, 48, 50, 45, 43, 42], color: '#ff4d4f' },
        { label: '情绪调节', data: [40, 42, 48, 52, 55, 60, 65], color: '#1677ff' },
        { label: '社交能力', data: [35, 38, 42, 45, 48, 50, 52], color: '#52c41a' },
      ],
    });
  }

  if (urlPath === '/analysis/clusters' && method === 'get') {
    return wrap({
      clusters: [
        { id: 0, name: '稳定良好型', count: 18, avg_risk: 12.3, color: '#52c41a' },
        { id: 1, name: '情绪波动型', count: 12, avg_risk: 35.6, color: '#faad14' },
        { id: 2, name: '行为改善型', count: 8, avg_risk: 28.1, color: '#1677ff' },
        { id: 3, name: '持续高风险型', count: 4, avg_risk: 72.4, color: '#ff4d4f' },
      ],
    });
  }

  // Intervention suggestions
  const suggMatch = urlPath.match(/\/analysis\/interventions\/suggestions\/([a-zA-Z0-9-]+)$/);
  if (suggMatch && method === 'get') {
    return wrap([
      { title: '情绪调节小组训练', description: '通过每周小组活动，教导学生识别和命名情绪，学习深呼吸、数数等基本情绪调节策略。', type: 'emotional', priority: 'high', expected_effectiveness: 8.2, source_method: 'rule_based' },
      { title: '社交技能训练', description: '结构化社交技能训练，包括轮流、分享、发起对话、理解社交线索等内容。', type: 'social', priority: 'medium', expected_effectiveness: 7.5, source_method: 'similarity' },
      { title: '注意力提升干预', description: '通过环境调整、任务分解和自我监控策略，帮助学生提高课堂注意力。', type: 'behavioral', priority: 'medium', expected_effectiveness: 7.8, source_method: 'hybrid' },
    ]);
  }

  // ===== DASHBOARD =====
  if (urlPath === '/dashboard/overview' && method === 'get') {
    return wrap({
      total_students: 42,
      today_observations: 15,
      observation_completion_rate: 66.7,
      risk_alerts: 3,
      pending_incidents: 2,
      active_interventions: 5,
      observation_trend: [12, 18, 15, 20, 22, 15, 10],
      risk_distribution: { low: 32, moderate: 7, high: 2, critical: 1 },
    });
  }

  if (urlPath === '/dashboard/risk-distribution' && method === 'get') {
    return wrap({
      labels: ['低风险', '中等风险', '高风险', '严重风险'],
      values: [32, 7, 2, 1],
      colors: ['#52c41a', '#faad14', '#ff7a45', '#ff4d4f'],
    });
  }

  if (urlPath === '/dashboard/heatmap' && method === 'get') {
    const dims = ['情绪调节', '注意力', '同伴关系', '规则遵守', '攻击行为', '多动冲动'];
    const stus = ['张小明', '李小红', '王大力', '赵小美', '陈小强', '刘小花', '周小军', '吴小丽'];
    const heatData = stus.map(() => dims.map(() => Math.round(Math.random() * 100)));
    return wrap({ dimensions: dims, students: stus, data: heatData });
  }

  if (urlPath === '/dashboard/intervention-stats' && method === 'get') {
    return wrap({
      total_active: 5, total_completed: 12, avg_effectiveness: 7.3,
      by_type: { behavioral: 8, emotional: 5, social: 3, academic: 1 },
    });
  }

  // Default: return empty success
  console.warn(`Mock API: unhandled ${method} ${urlPath}`);
  return wrap(null, '演示模式 - 操作模拟成功');
}
