import { VisionItem, JournalEntry } from "./types";

export const APP_NAME = "NekoFit";

// 替换指南：请将您上传的红蓝线条猫猫图片切割为三个文件，并替换下面的 URL
export const CAT_ASSETS = {
  // 暂时使用风格相近的插画/艺术风格占位
  happy: "https://images.unsplash.com/photo-1606836576983-8b458e75221d?w=400&h=400&fit=crop&q=80", 
  sleepy: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f3e?w=400&h=400&fit=crop&q=80", 
  curious: "https://images.unsplash.com/photo-1618331835717-801e976710b2?w=400&h=400&fit=crop&q=80", 
  eating: "https://images.unsplash.com/photo-1606836576983-8b458e75221d?w=400&h=400&fit=crop&q=80",
};

export const INITIAL_VISION_BOARD: VisionItem[] = [
  {
    id: '1',
    title: 'Travel',
    description: '去海边踩水',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=400&fit=crop',
    rotation: -3,
    size: 'medium'
  },
  {
    id: '2',
    title: 'Eat Well',
    description: '像猫一样优雅',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=400&fit=crop',
    rotation: 4,
    size: 'small'
  },
  {
    id: '3',
    title: 'My Dream',
    description: '拥有自己的小花园',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&h=400&fit=crop',
    rotation: -2,
    size: 'large'
  }
];

export const MOCK_JOURNAL: JournalEntry[] = [
  {
    id: '1',
    date: '2023-10-29',
    content: '今天路过花店，看到向日葵开得很好。控制住了没有喝奶茶！',
    mood: 'happy',
    imageUrl: 'https://images.unsplash.com/photo-1540457063889-110a7b64cf6e?w=500&fit=crop'
  },
  {
    id: '2',
    date: '2023-10-28',
    content: '天气转凉了，猫咪都缩成了一团。我也想缩在被窝里...',
    mood: 'sleepy'
  }
];

export const MOCK_WEIGHT_DATA = [
  { id: '1', date: '2023-10-01', weight: 65.5, note: '开始记录喵' },
  { id: '2', date: '2023-10-08', weight: 64.8, note: '运动第一周' },
  { id: '3', date: '2023-10-15', weight: 64.2, note: '稍微瘦了点' },
  { id: '4', date: '2023-10-22', weight: 63.9, note: '有点想吃罐头' },
  { id: '5', date: '2023-10-29', weight: 63.1, note: '开心！' },
];

export const WATER_GOAL = 8; // 8杯水