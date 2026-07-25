# 🧠 学生行为心理学分析系统 (Student Psychology Analysis System)

面向幼儿园和小学阶段的综合行为心理学分析平台，支持教师、心理老师和家长三角色协作。

## 功能概览

- **风险识别** — 多因素加权评分，自动识别高风险学生
- **行为模式分析** — 时间序列聚类、行为序列挖掘
- **学业预测** — 基于行为+学业数据的回归/分类模型
- **干预建议** — 规则引擎 + 相似度匹配的混合推荐
- **可视化仪表盘** — ECharts 驱动的交互式图表
- **报告生成** — HTML/PDF 自动生成
- **分类标注** — 灵活的学生标签系统

## 快速开始

### 环境要求
- Docker & Docker Compose
- Python 3.12+ (本地开发)
- Node.js 22+ (本地开发)

### 一键启动
```bash
cd student-psychology-system
cp .env.example .env
make up
```

### 访问
- 前端: http://localhost:5173
- API 文档: http://localhost:8000/api/docs
- MinIO 控制台: http://localhost:9001

### 演示账号
| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 教师 | teacher1 | teacher123 |
| 心理老师 | psych1 | psych123 |
| 家长 | parent1 | parent123 |

## 技术栈

| 层 | 技术 |
|---|---|
| 后端 | FastAPI + SQLAlchemy + Celery |
| 数据库 | PostgreSQL 16 + pgvector |
| 前端 | React 19 + TypeScript + Ant Design + ECharts |
| ML | scikit-learn + statsmodels + dtaidistance |
| 部署 | Docker Compose |

## 行为维度

系统内置 35 个行为维度，涵盖 6 大类别：
- **情绪情感** (6) — 情绪调节、焦虑、自尊等
- **社会交往** (6) — 同伴关系、合作、规则遵守等
- **行为表现** (8) — 攻击、注意力、多动等
- **认知学业** (6) — 语言、阅读、数学等
- **发展发育** (5) — 运动协调、言语、感觉统合等
- **家庭风险** (4) — 家庭参与、压力源、教养一致性等

## 开发

```bash
# 启动开发环境
make dev

# 运行数据库迁移
make migrate

# 加载种子数据
make seed

# 运行测试
make test

# 进入后端 shell
make shell
```
