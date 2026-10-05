import { User } from '../types';

export const currentUser: User = {
  id: 'usr_lucas_almeida',
  name: 'Lucas Almeida',
  email: 'lucas.almeida@noteagents.dev',
  username: 'lucasalmeida',
  role: 'Community Developer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Desenvolvedor apaixonado por open source, TypeScript e sistemas de agentes inteligentes. Contribuindo ativamente na plataforma NoteAgents.',
  github: 'https://github.com/lucasalmeida',
  location: 'São Paulo, Brasil',
  company: 'NoteAgents Community',
  joinedDate: 'Janeiro de 2024',
  stats: {
    contributions: 24,
    pullRequests: 12,
    issues: 18,
    reviews: 6,
  },
};

export const mockUsers: Record<string, { name: string; avatar: string; role: string }> = {
  lucas: {
    name: 'Lucas Almeida',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Community Developer',
  },
  mariana: {
    name: 'Mariana Costa',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Core Maintainer',
  },
  rafael: {
    name: 'Rafael Mendes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'DevOps Lead',
  },
  carla: {
    name: 'Carla Santos',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'AI Engineer',
  },
  joao: {
    name: 'João Pereira',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Software Architect',
  },
  ana: {
    name: 'Ana Silva',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'QA Engineer',
  },
};
