// Static Simplified Chinese presentation map for the ENCY4AI reader.
// The English dataset (data/reader.json) stays canonical: IDs, URLs, source
// titles, proof locators, statuses and claim kinds are never copied here.
//
// Every entry is pinned to the exact English text it translates:
//  - fields/articles: keyed by stable ID and checked against the English title;
//  - headings/prose: keyed by the exact English string.
// When the English text changes or a new entry appears, the lookup misses and
// the reader shows an explicit "未翻译" label with a link to the English
// article instead of a stale or unmarked translation.
// Plain data only: no code, no network.

export const ZH_CONTENT = Object.freeze({
  fields: {
    'field:history': { en: 'AI history', zh: '人工智能历史' },
    'field:fundamentals': { en: 'Fundamentals', zh: '基础知识' },
    'field:architectures': { en: 'Architectures', zh: '架构' },
    'field:models': { en: 'Models', zh: '模型' },
    'field:tools': { en: 'Tools', zh: '工具' },
    'field:agents': { en: 'Agents and automation', zh: '智能体与自动化' },
    'field:handbook': { en: 'Practical handbook', zh: '实用手册' },
    'field:applications': { en: 'Industry applications', zh: '行业应用' },
    'field:people': { en: 'People, organizations and industry', zh: '人物、组织与产业' },
    'field:future': { en: 'AGI and future', zh: '通用人工智能与未来' },
  },

  // Product and architecture names are kept as-is. The English title is
  // always added as a search alias by the reader; `aliases` are extra
  // Chinese search terms.
  articles: {
    'architecture:transformer': { en: 'Transformer', zh: 'Transformer', aliases: [] },
    'concept:attention': { en: 'Attention', zh: '注意力', aliases: ['注意力机制'] },
    'tool:aionui': { en: 'AionUi', zh: 'AionUi', aliases: [] },
    'tool:codeg': { en: 'Codeg', zh: 'Codeg', aliases: [] },
    'tool:t3-code': { en: 'T3 Code', zh: 'T3 Code', aliases: [] },
    'tool:antigravity-swarm': { en: 'Antigravity Swarm', zh: 'Antigravity Swarm', aliases: ['智能体编排', '多智能体协作'] },
    'tool:andrej-karpathy-skills': { en: 'Andrej Karpathy Skills', zh: 'Andrej Karpathy Skills', aliases: ['卡帕西技能', '编码智能体指南'] },
    'tool:multica': { en: 'Multica', zh: 'Multica', aliases: ['人机协作', '任务看板'] },
    'tool:google-antigravity': { en: 'Google Antigravity', zh: 'Google Antigravity', aliases: ['谷歌反重力', '浏览器智能体'] },
    'tool:google-flow': { en: 'Google Flow', zh: 'Google Flow', aliases: ['谷歌 Flow', '视频生成', 'Veo'] },
    'tool:tripo3d': { en: 'Tripo3D', zh: 'Tripo3D', aliases: ['Tripo Studio', '图生 3D', '3D 模型生成'] },
    'concept:batch-generation': { en: 'Batch Generation', zh: '批量生成', aliases: ['批处理', '批量生成视频', '批量生成 3D 模型'] },
  },

  headings: [
    ['Overview', '概述'],
    ['Reading prompt', '阅读思考'],
  ],

  // Summaries, paragraphs and claim statements (exact English → Chinese).
  prose: [
    // architecture:transformer / claim:transformer-encoder-decoder
    ['In the 2017 Transformer, the encoder represents the input sequence. The decoder uses that representation and earlier outputs to generate the next symbol.',
      '在 2017 年的 Transformer 中，编码器负责表示输入序列。解码器利用这一表示以及先前的输出来生成下一个符号。'],
    ['Trace one output token in Figure 1. Where does the decoder receive information about the input sequence?',
      '在图 1 中追踪一个输出词元（token）。解码器是在哪里接收到关于输入序列的信息的？'],

    // concept:attention / claim:attention-weighted-values, claim:attention-in-transformer
    ['In the paper’s definition of attention, each key is paired with a value. The match between a query and each key determines how much its value contributes to the weighted sum.',
      '按照该论文对注意力的定义，每个键（key）都与一个值（value）配对。查询（query）与各个键的匹配程度，决定了对应的值在加权和中所占的分量。'],
    ['Attention is a component of the 2017 Transformer. In encoder self-attention, each input position can draw on every position in the layer’s input. In encoder–decoder attention, decoder queries draw on keys and values from the encoder output.',
      '注意力是 2017 年 Transformer 的一个组成部分。在编码器自注意力中，每个输入位置都可以利用该层输入中的所有位置。在编码器—解码器注意力中，解码器的查询利用来自编码器输出的键和值。'],
    ['Compare the two inputs to encoder–decoder attention in Figure 1. Which supplies the queries, and which supplies the keys and values?',
      '比较图 1 中编码器—解码器注意力的两路输入：哪一路提供查询，哪一路提供键和值？'],

    // tool:aionui / claim:aionui-team-conversation, claim:aionui-team-state
    ['AionUi Team Mode runs a group of agents around a shared task. A leader breaks down the request, assigns work to teammates, and gathers the results.',
      'AionUi 的 Team Mode（团队模式）围绕一项共享任务运行一组智能体。由一名领导者（leader）拆解请求、向队友分配工作并汇总结果。'],
    ['Teammates work in a shared folder, exchange updates through an asynchronous mailbox, and use a common task board. Teammates can be added or removed while the team is running.',
      '队友在共享文件夹中工作，通过异步邮箱交换进展，并使用一个共同的任务看板。团队运行期间可以添加或移除队友。'],
    ['For a project where research, writing, and review keep exchanging updates, sketch which roles should stay on the team and what each should record on the shared task board. Compare that with a single review request sent to a Codeg worker.',
      '设想一个研究、写作和审阅之间不断交换进展的项目：勾勒出哪些角色应当留在团队中，以及每个角色应在共享任务看板上记录什么。再将其与发送给 Codeg 工作者（worker）的单次审阅请求进行比较。'],

    // tool:codeg / claim:codeg-delegation-sessions, claim:codeg-worker-context, claim:codeg-delegation-depth
    ['With delegation enabled, a capable Codeg lead can hand a self-contained sub-task to another agent. Codeg starts a fresh worker session and returns its result for the lead to combine with its own work.',
      '启用委派后，具备相应能力的 Codeg 主导者（lead）可以把一个自成一体的子任务交给另一个智能体。Codeg 会启动一个全新的工作者（worker）会话，并返回其结果，供主导者与自己的工作合并。'],
    ['The worker starts with the task description and its working folder. The lead supplies any conversation context needed to complete the handoff.',
      '工作者以任务描述及其工作文件夹作为起点。完成交接所需的任何对话上下文都由主导者提供。'],
    ['Delegation defaults to one level, from lead to worker. Increasing the configured depth allows a capable worker to delegate in turn.',
      '委派默认只有一层，即从主导者到工作者。提高所配置的深度后，具备相应能力的工作者也可以继续向下委派。'],
    ['For an implementation that needs an independent review, give the worker the goal, files or diff, constraints, and expected findings. Choose this scoped handoff when the lead can package the context and combine the answer. Compare it with keeping several roles coordinated on an AionUi team board.',
      '对于需要独立审阅的实现，请向工作者提供目标、文件或 diff、约束条件以及预期的发现。当主导者能够打包上下文并整合答复时，选择这种范围明确的交接。再将其与在 AionUi 团队看板上协调多个角色的做法进行比较。'],

    // tool:t3-code / claim:t3-code-agent-interface, claim:t3-code-subagent-threads
    ['T3 Code provides a shared interface for coding agents such as Claude Code and Codex running on a machine where they are configured. Desktop, web, and mobile clients can open the same threads, and a thread can continue with another model.',
      'T3 Code 为在已完成配置的机器上运行的编码智能体（如 Claude Code 和 Codex）提供一个共享界面。桌面端、网页端和移动端客户端可以打开相同的线程（thread），并且一个线程可以换用另一个模型继续进行。'],
    ["On desktop and web, the Agents view lets readers monitor delegated work and open a subagent's thread beside its parent. When an agent-created subagent needs approval or an answer, the request appears in the parent thread.",
      '在桌面端和网页端，Agents 视图让读者可以监控已委派的工作，并在父线程旁打开子智能体的线程。当由智能体创建的子智能体需要批准或答复时，该请求会出现在父线程中。'],
    ["Pick a coding task with a focused review step. Decide whether to continue the main T3 Code thread with a different provider or delegate the review and inspect it beside the main thread. Compare the delegated option with Codeg's fresh worker session, and consider when AionUi's shared task board would help several roles stay coordinated.",
      '选一个包含聚焦审阅步骤的编码任务。决定是换用另一家提供方继续 T3 Code 主线程，还是将审阅委派出去并在主线程旁查看。将委派方案与 Codeg 的全新工作者会话进行比较，并思考在什么情况下 AionUi 的共享任务看板有助于多个角色保持协调。'],

    // tool:antigravity-swarm
    ["Antigravity Swarm is Google Antigravity's preview feature for coordinating a team of agents. With /swarm, the current conversation assigns work to named workers that run in parallel and coordinate on a shared board.",
      'Antigravity Swarm 是 Google Antigravity 的多智能体协作预览功能。输入 /swarm 后，当前会话会把任务分配给有名字的工作智能体，让它们并行执行，并在同一块看板上协调。'],
    ["The coordinator typically adds a verifier that reviews each worker's changes, runs tests, and reports problems back to the worker. The board gives the team one place to share assignments, questions, and results.",
      '协调者通常会安排一名验证者，检查每位工作智能体的改动、运行测试，并把问题反馈给对应成员。团队在同一块看板上共享任务分工、问题和结果。'],
    ["Workers share the workspace and use the conversation's model by default. The coordinator can give workers separate repository working copies and assign a different model from the user's model picker.",
      '工作智能体默认共用工作区，并使用当前会话的模型。协调者可以为成员分配独立的仓库工作副本，也能从用户可选的模型中另行指定。'],
    ["Swarm coordinates work across agents. Google's separate Orchestrator feature can pair Gemini 4 Neon for planning with Gemini 4 Hydrogen for execution within one session.",
      'Swarm 负责多智能体之间的协作。Google 另有 Orchestrator 功能，可在同一次会话中搭配 Gemini 4 Neon 制订计划和 Gemini 4 Hydrogen 执行计划。'],
    ['In a test repository, use /swarm to assign date and currency tests to separate workers, then ask a verifier to run the suite. Open the shared board in the app or use /swarm board in the CLI to follow the handoffs and test results.',
      '在测试仓库里，用 /swarm 把日期和金额模块的测试分别交给两名智能体，再请验证者运行测试套件。通过应用的共享看板，或在命令行输入 /swarm board，查看交接和测试结果。'],

    ['Google introduced Antigravity alongside Gemini 3 as a development platform where agents can work across the editor, terminal, and browser.',
      'Google 在推出 Gemini 3 时介绍了 Antigravity。它是一个开发平台，智能体可以在编辑器、终端和浏览器之间完成任务。'],
    ['Antigravity documents browser agents that can click and enter information on live pages. Its built-in browser agent and its local Chrome mode have different account, app, and setup requirements.',
      'Antigravity 的浏览器智能体能在实际网页上点击和填写信息。内置浏览器与本机 Chrome 模式各有账号、应用及配置要求。'],
    ['When an Antigravity built-in browser task reaches a sign-in or CAPTCHA, it pauses so the user can take over and then resume the task.',
      'Antigravity 的内置浏览器任务遇到登录或验证码时会暂停，等用户接手处理，再继续任务。'],
    ['For a media workflow, ask the browser agent to open the relevant site, identify the generation controls, and stop before submitting anything. Check the page and the account yourself before deciding whether to run a sample.',
      '试一个媒体任务时，可以先请浏览器智能体打开网站、找到生成入口，停在提交前。自己核对页面和账号，再决定是否跑一个样本。'],
    ['Google announced Flow in May 2025 as an AI filmmaking tool for creating and developing clips and scenes with Google DeepMind models such as Veo.',
      'Google 在 2025 年 5 月发布 Flow，把 Veo 等 Google DeepMind 模型放进制作视频片段和场景的工作区。'],
    ['The Google Flow video interface lets users choose an output count for one prompt. Google also documents a Flow Agent that can make several variations of a clip in one request.',
      'Google Flow 的视频界面可以为一条提示词指定输出数量。官方也介绍了 Flow Agent，一次请求就可以给同一个片段生成多个版本。'],
    ['In a practice project, draft one shot of a paper boat drifting under a bridge. In Video settings, choose two outputs to compare the same shot in two versions. Check the displayed credit cost before generating.',
      '在练习项目里写一个纸船漂过桥洞的镜头。先在视频设置里选两个输出，比较同一镜头的两个版本。点生成前，看看界面显示要花多少点数。'],
    ["Tripo Studio is Tripo's workspace for generating and refining 3D models. Its Image to 3D workflow turns a reference image into a model the user can inspect and export.",
      'Tripo Studio 是 Tripo 推出的 3D 模型工作区。图生 3D 可以把参考图转成模型，供用户检查和导出。'],
    ['Tripo Studio has a built-in batch image-to-3D option. It queues several images together, creates a separate 3D model for each image, and offers individual previews and a bulk download.',
      'Tripo Studio 自带批量图生 3D。一次把多张图放进队列，每张图各生成一个模型，完成后可逐个预览，也能一起下载。'],
    ['Try two reference images with permission to use them, such as a crate and a stool on plain backgrounds. In Tripo Studio choose Batch in the 3D workspace, review the inputs, then preview the mesh for each item before deciding what to export.',
      '准备两张有权使用的纯背景参考图，例如一个木箱和一张凳子。在 Tripo Studio 的 3D 工作区选 Batch，核对输入。完成后分别检查两个网格，再决定导出哪几个。'],
    ['Batch generation can mean several outputs from one input or a group of separate jobs. Google Flow documents several video variants from one prompt, while Tripo Studio documents one 3D model per image in a submitted group.',
      '批量生成可以是一份输入出多个版本，也可以是一组输入各跑一项任务。Google Flow 的例子是一条提示词出几个视频版本，Tripo Studio 的例子是上传几张图，每张图各出一个 3D 模型。'],
    ['Before submitting a batch, record an ID for each input, the desired number of outputs, and how you will check success. Try a small sample first so a wrong setting does not turn into a whole collection of wrong results.',
      '提交一批之前，给每个输入编号，记下要生成几个结果、怎样算合格。先跑一个小样，免得一个参数填错，整批结果都得重来。'],
    // tool:andrej-karpathy-skills and tool:multica
    ["The Multica AI repository packages guidance derived from Andrej Karpathy's observations about coding with language models. Its four principles ask agents to clarify assumptions, keep implementation simple, limit edits to the task, and verify the result against concrete criteria.",
      'Multica AI 根据 Andrej Karpathy 对大语言模型编程的观察整理了这套指南。四条原则要求编码智能体先澄清假设、保持实现简单、把修改限定在任务范围内，并按具体标准验证结果。'],
    ['The skill turns a vague objective into a checkable result. Its bug-fixing example starts by writing a failing test for the reported behavior, then makes the change needed to pass it.',
      '这套技能把模糊的目标改写成可以检查的结果。以修复缺陷为例，先写一个会失败的测试来复现问题，再修改代码使测试通过。'],
    ['For a small bug fix, ask the coding agent to state its assumptions and identify the smallest change. Write down a failing case first, then check whether the final diff stays within scope and the test passes.',
      '选一个小缺陷，请编码智能体先说明假设并找出最小改动。先记录一个会失败的用例，再检查最终改动有没有超出范围、测试是否通过。'],
    ['Multica is a source-available, self-hostable workspace where a team can assign an issue to an AI coding agent. The agent runs on a connected machine, reports progress on the issue, and returns the result for human review.',
      'Multica 是一个源代码可见、可自托管的协作平台。团队可把工单交给 AI 编码智能体。智能体在已连接的机器上执行，在同一工单更新进度，再提交结果供人工审查。'],
    ['Multica lets a workspace attach the same reusable skill to multiple agents. A skill contains a SKILL.md file and can include supporting scripts, templates, and reference files.',
      '在 Multica 工作区内，多名智能体可以共用一项技能。每项技能包含一个 SKILL.md 文件，也可以附带脚本、模板和参考资料。'],
    ['The Multica License adds conditions to Apache License 2.0. Its additional terms distinguish internal self-hosting from providing a hosted service to third parties or embedding Multica in a commercially distributed product.',
      'Multica 许可证在 Apache 许可证 2.0 的基础上增加了条款，分别约定了内部自托管、向第三方提供托管服务和嵌入商业发行产品等用途。'],
    ['Give an agent one documentation issue with a clear outcome. Follow its comments and execution log, then inspect the result on the same issue before approving it.',
      '给智能体分派一个验收目标明确的文档工单。查看它的评论和执行日志，在同一工单检查交付结果，再决定是否批准。'],
  ],
});
