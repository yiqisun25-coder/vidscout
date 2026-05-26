import { ScriptFormat } from "./types";

export const APP_NAME = "LOCAL_SCRIPT_GEN";

export const FORMATS: ScriptFormat[] = [
  {
    id: "cloud",
    label: "② 云剪型",
    tag: "素材包 → 批量分发",
    desc: "商家提供素材，达人套模板剪发。核心是爆款开头+服务流程剪辑，适合低成本矩阵铺量。",
    color: "#6366f1",
    fields: [
      { key: "product", label: "产品/服务名称", placeholder: "e.g. 定制T恤 / 热转印马克杯" },
      { key: "hook", label: "视觉钩子（开头3秒的画面）", placeholder: "e.g. 成品特写、机器运转画面、包装拆箱" },
      { key: "process", label: "核心服务流程（2-3步）", placeholder: "e.g. 上传图片→选材料→出成品", multiline: true },
      { key: "cta", label: "行动引导", placeholder: "e.g. 主页领50件优惠券 / 评论区问价" },
    ],
  },
  {
    id: "qa",
    label: "④ 痛点问答型",
    tag: "搜索流量 → 决策转化",
    desc: "瞄准用户决策前的真实疑虑，字幕+产品实拍+旁白。适合定制品类，承接主动搜索流量。",
    color: "#f59e0b",
    fields: [
      { key: "product", label: "产品/服务名称", placeholder: "e.g. 定制T恤 / 企业周边" },
      { key: "question", label: "用户最常问的问题", placeholder: "e.g. 100件和50件的印刷成本差多少？" },
      { key: "pain", label: "背后的真实顾虑", placeholder: "e.g. 怕起订量太高浪费，怕品质不稳定" },
      { key: "answer", label: "你的回答角度/优势", placeholder: "e.g. 我们50件起印，单件含设计费也比同行低20%" },
      { key: "proof", label: "佐证画面", placeholder: "e.g. 报价单截图、客户返单记录、成品对比" },
    ],
  },
  {
    id: "bts",
    label: "⑤ 幕后制作型",
    tag: "过程即内容 → 品牌信任",
    desc: "展示"东西是怎么做出来的"，全程实拍生产流程，无需剧情。印刷/定制品视觉天然适合。",
    color: "#10b981",
    fields: [
      { key: "product", label: "产品/服务名称", placeholder: "e.g. 丝网印刷T恤" },
      { key: "steps", label: "制作关键步骤（3-5步）", placeholder: "e.g. 制版→调色→上机→烘干→质检→包装", multiline: true },
      { key: "detail", label: "最值得拍的细节/工艺亮点", placeholder: "e.g. 色彩层叠特写、裁切精度、成品手感" },
      { key: "voice", label: "旁白风格", placeholder: "e.g. 简洁字幕无旁白 / 工厂ambient音 / 员工说工艺" },
      { key: "ending", label: "结尾引导", placeholder: "e.g. 展示客户收到货的反应 / 直接报价区间" },
    ],
  },
];

export const SYSTEM_PROMPTS: Record<string, string> = {
  cloud: `你是一名擅长抖音本地生活推广的短视频运营专家。
请根据用户提供的信息，写一份"云剪型"短视频脚本。
格式要求：
- 总时长：30-45秒
- 结构：【开头3秒钩子】【产品/服务展示 10-15秒】【核心卖点 10秒】【行动引导 5秒】
- 每段标注：画面描述 | 字幕文案 | 时长
- 语气：干净利落，无废话，字幕直接说结论
- 不要有剧情，不要有娱乐化表演，纯功能性内容
输出纯文本，不要markdown加粗，用换行分段。`,

  qa: `你是一名擅长抖音本地生活推广的短视频运营专家。
请根据用户提供的信息，写一份"痛点问答型"短视频脚本。
格式要求：
- 总时长：20-35秒
- 结构：【提问字幕开场 3秒】【痛点共鸣 5秒】【直接回答+数据/事实 10-15秒】【佐证画面 5秒】【CTA 3秒】
- 每段标注：画面描述 | 字幕文案 | 时长
- 开头必须是一个用户会主动搜索的问题，直接出字幕
- 回答要有具体数字或对比，不要模糊表述
- 不出镜也可以，字幕驱动
输出纯文本，不要markdown加粗，用换行分段。`,

  bts: `你是一名擅长抖音本地生活推广的短视频运营专家。
请根据用户提供的信息，写一份"幕后制作型"短视频脚本。
格式要求：
- 总时长：40-60秒
- 结构：【制作流程分镜，每步5-10秒】【工艺细节特写 10秒】【成品展示 5秒】【结尾引导 5秒】
- 每段标注：镜头描述 | 字幕/旁白文案 | 时长 | 音效建议
- 镜头描述要具体（景别、角度、运动方式）
- 字幕简洁，不超过12个字/条
- 整体节奏感强，像工业纪录片
输出纯文本，不要markdown加粗，用换行分段。`,
};
