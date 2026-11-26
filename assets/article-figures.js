const paper = 'https://arxiv.org/html/1706.03762v7';
const t3Guide = 'https://github.com/pingdotgg/t3code/blob/main/docs/user/thread-sidebar.md#inspect-agent-work';
const aionGuide = 'https://github.com/iOfficeAI/AionUi#team-mode--coordinated-multi-agent-collaboration';
const codegGuide = 'https://docs.codeg.app/guide/multi-agent';

// Each localized figure supplies its heading, attribution, alt text, and reading steps.
export const ARTICLE_FIGURES = new Map([
  ['tool:google-antigravity', {
    id: 'browser-settings',
    image: 'https://antigravity.google/assets/image/docs/browser/browser-settings.png',
    source: 'https://antigravity.google/docs/browser#configure-browser-settings',
    en: ['Browser settings', 'Google Antigravity documentation', 'Antigravity settings showing the built-in browser and Browser Subagent permissions.', [
      ['Locate browser permissions', 'Open Settings, then Browser. The Browser Subagent section controls which sites the agent can operate.'],
    ]],
    zh: ['浏览器设置原图', 'Google Antigravity 官方文档', 'Antigravity 的设置页，显示内置浏览器与浏览器子智能体的权限选项。', [
      ['找到网页操作权限', '进入设置里的 Browser 页面。在 Browser Subagent 一栏，可以查看哪些网站允许智能体操作。'],
    ]],
  }],
  ['tool:google-flow', {
    id: 'flow-interface',
    image: 'https://i.ytimg.com/vi/oKjDeMtBZ4g/maxres2.jpg',
    source: 'https://www.youtube.com/watch?v=oKjDeMtBZ4g',
    en: ['Flow interface', 'Still from Google’s official Flow tutorial', 'Flow project showing a prompt composer over a grid of clips.', [
      ['Find the composer', 'The still shows where the prompt goes. Use the live Video settings to check the current output count and model.'],
    ]],
    zh: ['Flow 界面', 'Google 官方 Flow 教程静帧', 'Flow 项目的片段网格和提示词输入框。', [
      ['找到提示词输入框', '原图用来定位输入区。当前的模型和输出数，以你打开项目后的 Video 设置为准。'],
    ]],
  }],
  ['tool:tripo3d', {
    id: 'tripo-batch-interface',
    image: 'https://tripo-cdn.holymolly.ai/blog/6/4/64c25cb4-6e58-4e8f-8af7-a3fdf98da748.png',
    source: 'https://www.tripo3d.ai/blog/how-to-keep-consistent-when-generating-multiple-models-with-ai',
    en: ['Tripo Studio batch interface', 'Tripo’s official batch generation example', 'Tripo Studio workspace with reference images, generation settings and a Generate button.', [
      ['Locate tools and results', 'The official example shows where Tripo places references and generated assets. Button labels may differ in the current version.'],
    ]],
    zh: ['Tripo Studio 批量界面', 'Tripo 官方批量生成示例', 'Tripo Studio 工作区展示参考图、生成设置和 Generate 按钮。', [
      ['对照输入与结果的位置', '原图用来找参考图和生成结果。按钮名称以当前界面为准。'],
    ]],
  }],
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
  ['tool:cindy', 'https://github.com/makecindy/cindy#keep-your-favorite-agents-get-a-better-way-to-work',
    ['You want to start from a conversation, iterate on a draft, or resume the same task from another device. For example, ask an agent to revise a setup guide and refine the draft in follow-up turns.', 'Start or reopen a session, choose a supported agent such as Claude Code, Codex, or Pi, and give it the task. A session can also coordinate several agents when needed.', 'Review progress and files in the session. Resume it from another connected computer or phone.'],
    ['适合直接从会话开工、来回修改草稿，或换设备接着做同一任务。例如请智能体修订配置指南，再在后续对话里打磨草稿。', '新建或打开会话，选用 Claude Code、Codex、Pi 等受支持的智能体，再交代任务。需要时可在会话内协调多个智能体。', '在会话里查看进度和文件，也可从另一台已连接的电脑或手机接续。']],
  ['tool:multica', 'https://github.com/multica-ai/multica#what-is-multica',
    ['Your team needs a shared issue queue, clear ownership, and a human review step. For example, assign the same setup guide revision to an agent and have a teammate review the diff.', 'Create an issue with the expected result and assign it to an agent. The agent picks it up on a connected machine and hands the result back for review.', 'Follow progress, blockers, execution logs, and the result on the same issue. A teammate can review the diff and decide what ships.'],
    ['适合团队用共享工单管理待办，明确谁负责、谁验收。例如把同一项配置指南修订分派给智能体，再由同事审查变更。', '创建工单，写明预期结果并分派给智能体。智能体在已连接的机器上接单执行，再交回结果供审查。', '在同一工单查看进度、阻塞、执行日志和交付结果。团队成员可审查变更并决定是否发布。']],
  ['tool:aionui', aionGuide,
    ['Several roles need to coordinate on one shared deliverable. For example, one agent drafts a release brief while another checks its facts.', 'A lead agent starts with one request, assigns subtasks to teammates, and gathers results. They share a working folder.', 'See assignments on the shared board. Teammates can hand off updates through the mailbox.'],
    ['同一个交付物需要多个角色配合。例如一个智能体写发布简报，另一个核事实。', '主智能体接收一个目标，再向队友分工并汇总。队友共享工作文件夹。', '在共享看板上查分工，队友可通过邮箱交接进展。']],
  ['tool:codeg', codegGuide,
    ['A conversation is already underway and the lead needs an independent check or a clearly separable task. For example, ask a second agent to find missing test cases.', 'With delegation enabled, the lead gives a worker a self-contained brief. The worker starts a separate session.', 'Open the worker’s session to see its work. The lead collects the result in the original conversation.'],
    ['主会话正在推进，需要一次独立审阅或可单独完成的子任务。例如请另一个智能体找遗漏的测试用例。', '启用委派后，主智能体把目标和必要上下文交给工作者，工作者开启独立会话。', '可打开工作者会话查看过程，结果由主智能体收回原会话。']],
  ['tool:t3-code', t3Guide,
    ['You want to review delegated work beside the main implementation conversation.', 'A parent coding thread delegates work to subagents.', 'Open a child thread beside the parent. Requests for approval or input go to the parent.'],
    ['想在主编程会话旁边查看子任务，一边实现一边审阅。', '主编程会话将工作委派给子智能体。', '可在主会话旁打开子会话。批准和输入请求回到主会话。']],
  ['tool:antigravity-swarm', 'https://antigravity.google/docs/swarm',
    ['A larger task can be split into parallel work and a separate verification step.', 'A coordinator assigns work to parallel workers and a verifier.', 'Follow assignments, messages, and test results on the shared live board.'],
    ['一个较大的任务可以并行拆分，并安排独立验证。', '协调者把任务分给并行工作的智能体，并安排验证者。', '在共享看板上查看分工、消息和测试结果。']],
];
