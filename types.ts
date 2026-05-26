// ── Platform ──────────────────────────────────────────────────────────────
export type Platform = '抖音' | '小红书' | 'B站' | '视频号' | 'YouTube';
export type VideoStatus = 'idea' | 'scripting' | 'shooting' | 'editing' | 'published';
export type WorkflowStep = 'topic' | 'schedule' | 'script' | 'shooting' | 'publish';

// ── Topic Step ────────────────────────────────────────────────────────────
export interface TopicIdea {
  id: string;
  title: string;
  hook: string;          // 开场钩子 (≤3s)
  angle: string;         // 差异化角度
  audience: string;      // 目标人群
  potential: string;     // 预估播放量
}

// ── Script Step ───────────────────────────────────────────────────────────
export interface ScriptLine {
  ts: string;            // timestamp, e.g. "0:00–0:05"
  type: 'hook' | 'narration' | 'action' | 'broll' | 'cta';
  copy: string;          // 口播文案
  visual: string;        // 画面/动作说明
}

export interface Script {
  duration: string;
  lines: ScriptLine[];
}

// ── Shooting Step ─────────────────────────────────────────────────────────
export interface Shot {
  order: number;
  ref: string;           // script ref
  angle: string;         // 机位
  duration: string;
  notes: string;
}

export interface ShootingGuide {
  gear: string[];
  shots: Shot[];
  lighting: string[];
  editing: string[];
}

// ── Publish Step ─────────────────────────────────────────────────────────
export interface PublishKit {
  title: string;
  caption: string;
  hashtags: string[];
  bestTime: string;
  coverTip: string;
  tips: string[];
}

// ── Project (ties it all together) ────────────────────────────────────────
export interface Project {
  id: string;
  platform: Platform;
  niche: string;           // 赛道
  status: VideoStatus;
  step: WorkflowStep;

  // Step 1 outputs
  topics?: TopicIdea[];
  topic?: TopicIdea;       // chosen topic

  // Step 2 outputs
  shootDate?: string;
  publishDate?: string;
  publishTime?: string;

  // Step 3 outputs
  script?: Script;

  // Step 4 outputs
  shootingGuide?: ShootingGuide;
  checkedGear?: string[];
  checkedShots?: number[];

  // Step 5 outputs
  publishKit?: PublishKit;
  published?: boolean;

  createdAt: string;
  updatedAt: string;
}
