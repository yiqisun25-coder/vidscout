import { Project, Platform } from './types';

export const APP_NAME = '短视频助手';
export const APP_VERSION = '1.0';

export const PLATFORM_EMOJI: Record<Platform, string> = {
  抖音: '🎵', 小红书: '📕', B站: '📺', 视频号: '💬', YouTube: '▶️',
};

export const STATUS_LABEL: Record<Project['status'], string> = {
  idea:      '选题中',
  scripting: '写脚本',
  shooting:  '拍摄中',
  editing:   '剪辑中',
  published: '已发布',
};

export const STATUS_COLOR: Record<Project['status'], string> = {
  idea:      'text-yellow-400  bg-yellow-400/10  border-yellow-400/20',
  scripting: 'text-sky-400     bg-sky-400/10     border-sky-400/20',
  shooting:  'text-orange-400  bg-orange-400/10  border-orange-400/20',
  editing:   'text-violet-400  bg-violet-400/10  border-violet-400/20',
  published: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

export const STEP_META = [
  { id: 'topic'    as const, label: '选题', emoji: '💡', desc: '找到高潜力选题方向'   },
  { id: 'schedule' as const, label: '排期', emoji: '📅', desc: '安排拍摄与发布日期'   },
  { id: 'script'   as const, label: '脚本', emoji: '📝', desc: 'AI 生成完整分镜文案'  },
  { id: 'shooting' as const, label: '拍摄', emoji: '🎬', desc: '拍摄指南 + 打卡清单'  },
  { id: 'publish'  as const, label: '发布', emoji: '🚀', desc: '标题 / 文案 / 话题标签'},
];

export const STORAGE_KEY = 'sva_projects_v1';
