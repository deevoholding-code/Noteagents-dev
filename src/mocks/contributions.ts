import { Contribution } from '../types';
import { mockUsers } from './users';

export const mockContributions: Contribution[] = [
  {
    id: 'cnt-1',
    user: mockUsers.lucas.name,
    type: 'pr',
    title: 'abriu um Pull Request',
    reference: 'feat/improve-error-handling',
    targetUrl: '/pull-requests/pr-1',
    timeAgo: 'há 2 horas',
    avatar: mockUsers.lucas.avatar,
  },
  {
    id: 'cnt-2',
    user: mockUsers.mariana.name,
    type: 'comment',
    title: 'comentou na issue #242',
    reference: '“Ótima análise! Vou revisar os logs...”',
    targetUrl: '/issues/issue-244',
    timeAgo: 'há 4 horas',
    avatar: mockUsers.mariana.avatar,
  },
  {
    id: 'cnt-3',
    user: mockUsers.rafael.name,
    type: 'commit',
    title: 'fez um commit',
    reference: 'fix: resolve pipeline timeout',
    targetUrl: '/pipelines/pipe-1',
    timeAgo: 'há 6 horas',
    avatar: mockUsers.rafael.avatar,
  },
  {
    id: 'cnt-4',
    user: mockUsers.carla.name,
    type: 'issue',
    title: 'criou uma nova issue',
    reference: '#245 Erro no build do frontend',
    targetUrl: '/issues/issue-245',
    timeAgo: 'há 8 horas',
    avatar: mockUsers.carla.avatar,
  },
  {
    id: 'cnt-5',
    user: mockUsers.joao.name,
    type: 'mention',
    title: 'mencionou você',
    reference: '@lucasalmeida pode dar uma olhada?',
    targetUrl: '/tasks/task-1',
    timeAgo: 'há 10 horas',
    avatar: mockUsers.joao.avatar,
  },
];

// Helper to generate a realistic GitHub-like contribution matrix (52 weeks x 7 days)
export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function generateHeatmapData(): HeatmapDay[][] {
  const weeks: HeatmapDay[][] = [];
  const baseDate = new Date(2026, 0, 1);

  for (let w = 0; w < 52; w++) {
    const days: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      const curDate = new Date(baseDate.getTime() + (w * 7 + d) * 86400000);
      const isWeekend = d === 0 || d === 6;
      const rand = Math.random();
      let count = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (!isWeekend) {
        if (rand > 0.8) {
          count = Math.floor(Math.random() * 8) + 6;
          level = 4;
        } else if (rand > 0.5) {
          count = Math.floor(Math.random() * 5) + 3;
          level = 3;
        } else if (rand > 0.3) {
          count = Math.floor(Math.random() * 3) + 1;
          level = 2;
        } else if (rand > 0.15) {
          count = 1;
          level = 1;
        }
      } else if (rand > 0.7) {
        count = 1;
        level = 1;
      }

      days.push({
        date: curDate.toISOString().split('T')[0],
        count,
        level,
      });
    }
    weeks.push(days);
  }

  return weeks;
}
