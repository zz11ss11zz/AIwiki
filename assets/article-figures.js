const paper = 'https://arxiv.org/html/1706.03762v7';
const t3Guide = 'https://github.com/pingdotgg/t3code/blob/main/docs/user/thread-sidebar.md#inspect-agent-work';
const aionGuide = 'https://github.com/iOfficeAI/AionUi#team-mode--coordinated-multi-agent-collaboration';
const codegGuide = 'https://docs.codeg.app/guide/multi-agent';

// Each localized figure supplies its heading, attribution, alt text, and reading steps.
export const ARTICLE_FIGURES = new Map([
  ['architecture:transformer', {
    id: 'original-figure', image: `${paper}/Figures/ModalNet-21.png`, source: `${paper}#S3.F1`, paper: true,
    en: ['Original architecture figure', 'Original paper, Figure 1, Vaswani et al.', 'The original Transformer with encoder blocks on the left and decoder blocks on the right.', [
      ['Trace the input to the decoder', 'Follow the encoder output on the left to the middle attention layer on the decoder side. The decoder can use the encoded input at that layer.'],
    ]],
    zh: ['论文架构原图', '论文图 1，Vaswani 等', '原始 Transformer 架构，编码器在左，解码器在右。', [
      ['追踪输入如何到达解码器', '沿着左侧编码器堆栈的输出箭头找到右侧解码器中间的注意力层。解码器在这一层读取编码后的输入。'],
    ]],
  }],
  ['concept:attention', {
    id: 'original-figure', image: `${paper}/Figures/ModalNet-19.png`, source: `${paper}#S3.F2`, paper: true,
    en: ['Original attention figure', 'Original paper, Figure 2 (left), Vaswani et al.', 'Scaled dot-product attention with Q and K entering the score calculation and V entering the last matrix multiplication.', [
      ['Trace Q, K, and V', 'Follow Q and K into the score calculation and then through softmax. The last multiplication applies those weights to V.'],
    ]],
    zh: ['论文注意力原图', '论文图 2 左图，Vaswani 等', '缩放点积注意力。查询 Q 与键 K 进入分数计算，值 V 进入最后一次矩阵乘法。', [
      ['追踪查询、键和值', '先沿 Q 与 K 找到分数计算与 softmax，再看最后一次矩阵乘法如何将权重用于 V。'],
    ]],
  }],
  ['tool:aionui', {
    id: 'desktop-walkthrough', source: aionGuide,
    demo: 'https://github.com/iOfficeAI/AionUi/blob/main/resources/AionUi_team.gif',
    en: ['Team Mode walkthrough', 'AionUi official Team Mode documentation', '', [
      ['Follow the leader and teammates', 'A leader splits the request and gathers results. Look for the teammates who carry out the pieces of work.'],
      ['Follow shared progress', 'Teammates exchange updates in an asynchronous mailbox and use a shared task board. They share a working folder.'],
    ]],
    zh: ['团队模式操作演示', 'AionUi 官方团队模式文档', '', [
      ['看负责人如何分工', '负责人拆分请求并汇总结果。留意哪些工作由不同队友负责。'],
      ['看团队如何跟进进度', '队友通过异步邮箱交换消息，在共享任务看板上跟进工作，并使用同一个工作文件夹。'],
    ]],
  }],
  ['tool:codeg', {
    id: 'desktop-walkthrough', image: 'https://docs.codeg.app/images/collaboration-light.png', source: codegGuide,
    en: ['Delegation walkthrough', 'Codeg official collaboration guide', 'Codeg showing a lead agent delegating tasks to agents of other types.', [
      ['Give the worker enough context', 'Describe the goal and relevant files in the handoff. The worker starts a fresh session in the working folder with the task description.'],
      ['Open the separate worker session', 'Inspect the delegated conversation when needed. The lead collects the worker’s result and continues the main task.'],
    ]],
    zh: ['委派操作演示', 'Codeg 官方多智能体协作指南', 'Codeg 工作区展示主智能体把任务交给不同类型的子智能体。', [
      ['交代工作者所需的上下文', '委派时写明目标与相关文件。工作者在指定工作文件夹中开启独立会话，并从任务描述开始。'],
      ['查看独立工作者会话', '需要时打开被委派的会话。主智能体收集工作者结果后继续主任务。'],
    ]],
  }],
  ['tool:t3-code', {
    id: 'desktop-walkthrough', image: 'https://t3.codes/_astro/app-desktop.BHuzLVLF.webp', source: 'https://t3.codes/', guide: t3Guide, size: [2880, 1800],
    en: ['Desktop walkthrough', 'T3 Tools official screenshot', 'T3 Code desktop showing a parent conversation with Claude, Codex, Muse, and Gemini subagent activity.', [
      ['Start in the parent thread', 'The central conversation shows the parent task, adding expiring share links. For a review, give the parent agent a focused question to delegate.'],
      ['Follow the delegated work', 'The subagent card in the center shows four agents working. The Lineage panel on the right lists their tasks. You can also open Agents to check progress.'],
      ['Inspect a result beside the parent', 'Select a subagent from Agents or its conversation card to open its thread in the right panel. Handle requests for input or approval in the parent thread.'],
    ]],
    zh: ['桌面操作演示', 'T3 Tools 官方截图', 'T3 Code 桌面版主会话及 Claude、Codex、Muse 和 Gemini 子智能体的工作状态。', [
      ['在主会话交代任务', '中央会话展示主任务，即添加会过期的分享链接。需要委派审阅时，可给主智能体一个范围明确的问题。'],
      ['跟进被委派的工作', '中央任务卡显示四个子智能体正在工作，右侧的 Lineage 列出它们的任务。也可以打开 Agents 面板查看进度。'],
      ['在主会话旁查看结果', '从 Agents 或会话里的任务卡选中子智能体，即可在右侧打开子会话。需要输入或批准时，回到主会话处理。'],
    ]],
  }],
]);

export const TOOL_COMPARISON = [
  ['tool:aionui', aionGuide,
    ['A leader and teammates running a shared task.', 'Shared task board, asynchronous mailbox, and a common working folder.'],
    ['负责人和队友围绕同一个任务协作。', '共享任务看板、异步邮箱和同一个工作文件夹。']],
  ['tool:codeg', codegGuide,
    ['A lead hands a self-contained task to a fresh worker session.', 'Open the worker session to inspect it. The result returns to the lead.'],
    ['主智能体把上下文完整的任务交给独立工作者会话。', '可打开工作者会话查看过程。结果会交回主智能体。']],
  ['tool:t3-code', t3Guide,
    ['A parent coding thread delegates work to subagents.', 'Open a child thread beside the parent. Requests for approval or input go to the parent.'],
    ['主编程会话将工作委派给子智能体。', '可在主会话旁打开子会话。批准和输入请求回到主会话。']],
];
