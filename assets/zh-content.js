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
  ],
});
