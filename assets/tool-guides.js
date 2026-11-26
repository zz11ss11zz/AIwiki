const aionRepo = 'https://github.com/iOfficeAI/AionUi';
const aionTeam = `${aionRepo}#team-mode--coordinated-multi-agent-collaboration`;
const aionRelease = `${aionRepo}/releases/tag/v1.9.10`;
const aionSetup = `${aionRepo}/wiki/Getting-Started`;
const codegIntro = 'https://docs.codeg.app/getting-started/';
const codegInstall = `${codegIntro}installation`;
const codegDelegate = 'https://docs.codeg.app/guide/multi-agent';
const t3Repo = 'https://github.com/pingdotgg/t3code';
const t3Docs = `${t3Repo}/blob/main/docs/user`;
const t3Threads = `${t3Docs}/thread-sidebar.md#inspect-agent-work`;
const googleAcp = 'https://discuss.ai.google.dev/t/conflicting-guidance-on-using-t3-code-with-personal-google-ai-subscriptions/197131/3';
const googleDelegation = 'https://discuss.ai.google.dev/t/tos-clarification-is-human-supervised-codex-to-antigravity-acp-delegation-permitted/200697/2';
const googleZed = 'https://antigravity.google/docs/ide/extensions/zed/';
const googleTerms = 'https://antigravity.google/terms';
const googleHeadless = 'https://antigravity.google/docs/faq#can-i-use-antigravity-cli-headless-mode-in-third-party-coding-agents-or-automate-account-switching';
const openaiPlans = 'https://help.openai.com/en/articles/20001542-using-your-chatgpt-plan-in-other-apps-and-sites';
const anthropicAuth = 'https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use';
const magpieSubscriptions = 'https://usemagpie.ai/docs/subscriptions';
const magpieReport = 'https://github.com/yetone/magpie/issues/5992';
const magpieChatgpt = 'https://github.com/yetone/magpie/blob/main/internal/provider/chatgpt_api.go';
const openaiClients = 'https://developers.openai.com/siwc/token-sharing-open-source';

export const GUIDE_SOURCE_LABELS = new Map([
  ['https://github.com/makecindy/cindy#keep-your-favorite-agents-get-a-better-way-to-work', ['Cindy session and agents', 'Cindy 会话与智能体']],
  ['https://cindy.app/', ['Cindy task controls and permissions', 'Cindy 任务控制与权限']],
  ['https://github.com/PigBun-AI/pigbun-partner-community#how-pigbun-works', ['How PigBun workstreams start', 'PigBun 如何创建工作流']],
  ['https://github.com/PigBun-AI/pigbun-partner-community#what-you-can-use-it-for-today', ['PigBun workbench and local tools', 'PigBun 工作台与本地工具']],
  ['https://multica.ai/docs/assigning-issues', ['Multica issue assignment', 'Multica 工单分派']],
  ['https://multica.ai/docs/tasks', ['Multica execution logs', 'Multica 执行日志']],
  ['https://multica.ai/docs/team-agent-pool', ['Multica review handoff', 'Multica 团队审查交接']],
  [aionRepo, ['iOfficeAI repository', 'iOfficeAI 项目仓库']],
  [aionRelease, ['AionUi v1.9.10 release', 'AionUi v1.9.10 发布记录']],
  [aionSetup, ['AionUi first-run guide', 'AionUi 初次配置指南']],
  [aionTeam, ['AionUi Team Mode', 'AionUi 团队模式说明']],
  ['https://www.aionui.com/download/', ['AionUi downloads', 'AionUi 下载页']],
  ['https://github.com/spacering-net/codeg', ['Codeg repository', 'Codeg 项目仓库']],
  [codegIntro, ['Codeg project introduction', 'Codeg 项目介绍']],
  [codegInstall, ['Codeg installation', 'Codeg 安装指南']],
  [codegDelegate, ['Codeg delegation guide', 'Codeg 委派指南']],
  [`${codegDelegate}#how-delegation-works`, ['How Codeg delegation works', 'Codeg 委派机制']],
  [`${codegDelegate}#delegate-with-an-mention`, ['Choosing a worker with @', '用 @ 选工作者']],
  [`${codegDelegate}#turn-it-on`, ['Enabling Codeg delegation', '开启 Codeg 委派']],
  [t3Repo, ['T3 Code repository', 'T3 Code 项目仓库']],
  [`${t3Repo}/blob/main/AGENTS.md#terminology`, ['T3 Code maintainers', 'T3 Code 项目维护者']],
  ['https://t3.codes/', ['T3 Code project site', 'T3 Code 官网']],
  [`${t3Repo}#what-you-get`, ['T3 Code product overview', 'T3 Code 功能说明']],
  [`${t3Docs}/install.md`, ['T3 Code install and sign-in', 'T3 Code 安装及登录']],
  [t3Threads, ['Inspecting delegated threads', '查看委派线程']],
  [`${t3Docs}/providers-antigravity.md`, ['T3 Code Antigravity setup', 'T3 Code 的 Antigravity 配置']],
  [`${t3Docs}/providers-codex.md`, ['T3 Code Codex setup', 'T3 Code 的 Codex 配置']],
  [`${t3Docs}/providers-claude.md`, ['T3 Code Claude setup', 'T3 Code 的 Claude 配置']],
  [googleAcp, ['Google clarification on T3 Code and ACP', 'Google 对 T3 Code 和 ACP 的说明']],
  [googleDelegation, ['Google clarification on agent-to-agent delegation', 'Google 对智能体间委派的说明']],
  [googleZed, ['Google’s Antigravity setup for Zed', 'Google 的 Zed 接入指南']],
  [googleTerms, ['Google Antigravity Terms, section 6', 'Google Antigravity 条款第 6 节']],
  [googleHeadless, ['Google FAQ on headless automation', 'Google 对无界面自动调用的说明']],
  [openaiPlans, ['OpenAI guidance on sharing plan usage', 'OpenAI 的订阅额度共享说明']],
  [anthropicAuth, ['Anthropic authentication rules', 'Anthropic 的认证规则']],
  [magpieSubscriptions, ['Magpie subscription routing', 'Magpie 的订阅路由说明']],
  [magpieReport, ['Magpie user report, issue #5992', 'Magpie 用户报告 #5992']],
  [magpieChatgpt, ['Magpie ChatGPT API implementation', 'Magpie 的 ChatGPT API 实现']],
  [openaiClients, ['OpenAI authorization for open-source apps', 'OpenAI 的开源客户端授权说明']],
  [`${t3Docs}/source-control.md#review-turn-changes`, ['Reviewing turn changes', '检查本轮 Git 改动']],
]);

const setupGuideExample = {
  en: {
    title: 'Revise a setup guide',
    setup: 'Use a project with an existing setup guide and a specific configuration change. The deliverable is a draft with checked steps and any remaining verification gaps.',
  },
  zh: {
    title: '案例｜修订配置指南',
    setup: '准备一份现有配置指南和一项明确的配置变更。交付一份待审草稿，写明已核对的步骤和仍待验证的事项。',
  },
};

// Each guide groups the editorial paraphrase with the primary sources for that section.
export const TOOL_GUIDES = new Map([
  ['tool:cindy', {
    example: {
      sources: ['https://github.com/makecindy/cindy#keep-your-favorite-agents-get-a-better-way-to-work', 'https://cindy.app/'],
      en: {
        ...setupGuideExample.en,
        steps: [
          'Open a task conversation in Cindy and choose a supported agent. Give it the guide and the configuration change. Ask it to check the steps and prepare a draft for your review.',
          'Follow tool calls and results in the same conversation. Open the changed file or inspect the diff where available, then request any revisions in that conversation.',
          'If Cindy asks for permission, review the requested action and decide whether to allow it. Before sharing the guide, check the draft against the new configuration and resolve any steps the agent could not verify.',
        ],
      },
      zh: {
        ...setupGuideExample.zh,
        steps: [
          '在 Cindy 中打开一个任务会话，选一位受支持的智能体。给它现有指南和配置变更说明，请它核对步骤并准备待审草稿。',
          '在同一会话看工具调用和结果。打开修改后的文件，或在支持时查看差异，再把修改意见发回这个会话。',
          'Cindy 发出权限请求时，查看具体操作并决定是否允许。分享指南前，用新配置复核草稿，处理智能体未能验证的步骤。',
        ],
      },
    },
  }],
  ['tool:pigbun-partner', {
    example: {
      sources: ['https://github.com/PigBun-AI/pigbun-partner-community#how-pigbun-works', 'https://github.com/PigBun-AI/pigbun-partner-community#what-you-can-use-it-for-today'],
      en: {
        ...setupGuideExample.en,
        steps: [
          'Describe the configuration change and the expected draft in the partner chat. Once the goal is clear, PigBun creates a workstream that carries the task forward separately from the conversation.',
          'Open the browser workbench for that workstream. Check progress, local tool activity, and blockers while it checks the steps and drafts the revision.',
          'Respond when the workstream asks for a decision, missing access, or approval. For example, confirm which environment the steps should target if that is unclear. Review the draft before sharing it.',
        ],
      },
      zh: {
        ...setupGuideExample.zh,
        steps: [
          '在伙伴聊天里说明改了什么配置、希望收到什么样的草稿。目标明确后，PigBun 会创建一条工作流，在聊天之外继续推进任务。',
          '打开浏览器工作台，找到这条工作流。它核对步骤和修订内容时，可以查看进展、本地工具活动和阻塞。',
          '工作流需要决策、访问权限或批准时再介入。例如目标环境不明确，就告诉它按哪个环境核对。收到草稿后，审阅再分享。',
        ],
      },
    },
  }],
  ['tool:multica', {
    example: {
      sources: ['https://multica.ai/docs/assigning-issues', 'https://multica.ai/docs/tasks', 'https://multica.ai/docs/team-agent-pool'],
      en: {
        ...setupGuideExample.en,
        steps: [
          'Create an issue with the configuration change and acceptance criteria. Open Assignee, choose the agent, and confirm the assignment to start the run.',
          'Stay on the same issue for status, comments, and results. Open Execution log in the right sidebar for the run state and detailed transcript.',
          'When the issue reaches In Review, have a teammate check the draft and the verified steps. If anything is missing, leave feedback on the issue. Mark the work done once it meets the acceptance criteria.',
        ],
      },
      zh: {
        ...setupGuideExample.zh,
        steps: [
          '创建工单，写明配置变更和验收条件。打开 Assignee，选择智能体并确认分派，发起执行。',
          '在同一张工单查看状态、评论和交付结果。需要查看运行状态或详细记录时，打开右侧栏的 Execution log。',
          '工单进入 In Review 后，由同事核对草稿和已验证的步骤。有遗漏就在工单里反馈，达到验收条件后再将工单标记为完成。',
        ],
      },
    },
  }],
  ['tool:aionui', {
    origin: {
      sources: [aionRepo, aionRelease],
      en: ['The iOfficeAI team maintains AionUi as an open-source desktop workspace for AI assistants. Its scope includes office work as well as code. The v1.9.10 release notes show Team Mode shipping in the desktop build in April 2026.'],
      zh: ['AionUi 是 iOfficeAI 团队维护的开源桌面工具，既能做代码工作，也能处理文档和表格。2026 年 4 月的 v1.9.10 发布记录写明，桌面安装包已经可以创建和进入团队工作区。'],
    },
    features: {
      sources: [aionSetup, aionTeam],
      en: [
        'AionUi can run its built-in assistant with a configured model or pick up supported command-line agents on the machine. Opening two ordinary conversations gives you two independent sessions. Create a team when the work calls for a leader to assign tasks and combine what comes back.',
        'Teammates share a folder, exchange messages through a mailbox, and update a common task board. Each teammate can have its own permission prompt. Give each teammate a clear set of files. A shared folder makes handoffs easy and makes two people editing the same paragraph just as easy.',
      ],
      zh: [
        '给内置助手配好模型就能开工。机器上装着受支持的命令行智能体，AionUi 也能识别。开两个普通会话，各做各的。需要有人拆任务、盯进度、收结果时，再建团队，让负责人分工。',
        '队友读写同一个文件夹，用异步邮箱交流，在同一块看板上更新任务。谁需要权限，谁的请求就单独弹出来。文件共享省了来回传附件的功夫，也让两位队友同时改同一段话变得格外容易。开工前把各自负责的文件说清楚。',
      ],
    },
    example: {
      sources: ['https://www.aionui.com/download/', aionSetup, aionTeam],
      en: {
        title: 'Example: turn a changelog into a release brief',
        setup: 'Install the desktop app, configure a model or sign in to the supported agents you want on the team, and make a practice folder with a copy of CHANGELOG.md.',
        steps: [
          'Create a team in that folder. Choose a leader, give one teammate the job of extracting user-facing changes, and give another the job of checking draft claims against the changelog.',
          'Ask the leader to keep the draft in release-brief.md and the checker’s notes in review.md. Follow the task board for handoffs. Give the draft to the checker when it is ready.',
          'Open the brief and the checker’s notes. Every user-facing claim should point back to a changelog entry. Hand anything ambiguous back to the leader before sharing the brief.',
        ],
      },
      zh: {
        title: '案例｜把更新日志整理成发布简报',
        setup: '安装桌面版，配置模型或登录准备用的受支持智能体。新建一个练习文件夹，把 CHANGELOG.md 的副本放进去。',
        steps: [
          '在这个文件夹创建团队，选一位负责人。让一名队友提取用户能感知的变化，另一名队友负责回查原文。',
          '请负责人把草稿放进 release-brief.md，审阅意见存进 review.md。在看板上跟进交接，草稿写好后再交给审阅者。',
          '打开两份文件，抽查简报里的每一条承诺能否在更新日志里找到。含糊的地方退回负责人补证据，之后再分享简报。',
        ],
      },
    },
  }],
  ['tool:codeg', {
    origin: {
      sources: ['https://github.com/spacering-net/codeg', codegIntro],
      en: ['The project is maintained under spacering-net on GitHub. Codeg addresses a familiar mess for people who use several coding agents: each CLI keeps its own history. It gathers those sessions into one workspace and lets one agent pass work to another during a conversation.'],
      zh: ['Codeg 的公开仓库由 spacering-net 维护。它要解决的麻烦很具体。用 Claude Code 写了一半、让 Codex 补过测试，过两周想找当时的决定，两段历史还各住在自己的目录里。Codeg 把它们放进一个可搜索的工作区，也让主智能体能在会话里把活交给别的智能体。'],
    },
    features: {
      sources: [`${codegDelegate}#how-delegation-works`, `${codegDelegate}#delegate-with-an-mention`, codegDelegate],
      en: [
        'Enable delegation and start a new session with a lead that supports it. The lead can hand off work to a fresh worker session and collect the answer when it finishes. Use the composer’s @ picker to name the worker explicitly.',
        'The worker gets the written task and a working folder. Include the file, the question, and the output you want. A request like “review the thing we discussed” asks the worker to find a discussion it never saw.',
        'Separate workers can run independent jobs in parallel. If two jobs need to edit the same file, sequence them or give them distinct files and reconcile the changes with the lead.',
      ],
      zh: [
        '打开委派功能后，用支持委派的主智能体新开一个会话。主智能体可以启动独立工作者会话，等结果回来再接着做。想明确派给谁，在输入框键入 @ 并从列表选中对方。',
        '工作者拿到的是任务描述和工作目录。发过去时带上文件名、具体问题和预期产出。「看看刚才说的那个」很省字，可惜刚才那段话没跟过去。',
        '互不依赖的任务可以同时派出去。两项工作都要碰同一个文件时，可以先后安排，或者分开负责的文件，最后交给主智能体核对改动。',
      ],
    },
    example: {
      sources: [codegInstall, `${codegDelegate}#turn-it-on`, codegDelegate],
      en: {
        title: 'Example: ask a second agent to find missing tests',
        setup: 'Install Codeg and prepare a supported lead and worker. In Settings → Collaboration, enable delegation, save, and start a new lead conversation in a practice repository.',
        steps: [
          'Pick the worker with @. Ask it to read parser.js and parser.test.js, find two untested inputs, and return their expected behavior without changing files.',
          'Open the worker card or look under Session Details → Message navigation. The worker conversation lets you see whether it read the files you named.',
          'Ask the lead to turn the returned findings into a short test plan. Check that each case names the input, expected result, and relevant test file.',
        ],
      },
      zh: {
        title: '案例｜让第二个智能体找出漏测输入',
        setup: '安装 Codeg，准备支持委派的主智能体和一个工作者。在「设置 → 协作」开启委派并保存，再到练习仓库里新开主会话。',
        steps: [
          '用 @ 选中工作者。请它阅读 parser.js 和 parser.test.js，找出两个漏测输入，写出预期行为，先别改文件。',
          '打开委派任务卡，或从会话详情的消息导航找到工作者。点进它的会话，核对它有没有读你点名的两个文件。',
          '请主智能体把回传结果整理成测试计划。到手的每条建议都应写清输入、预期结果和该补到哪个测试文件。',
        ],
      },
    },
  }],
  ['tool:t3-code', {
    subscriptions: [
      {
        en: 'For coding in one workspace, use Settings → Providers to sign in with each existing subscription. Open a separate interactive thread for each provider in the same project. This setup needs no separately billed API key when all three accounts are eligible. Documentation checked on November 26, 2026. The combined workflow has yet to be tested in the app.',
        zh: '想在同一个编程界面用现有订阅，可以在 Settings → Providers 分别登录三家账号，再在同一个项目里为各家分别打开交互会话。三个账号都有相应权益时，无需配置另行计费的 API Key。文档核对日期为 2026 年 11 月 26 日，组合流程尚未在应用中实测。',
        sources: [`${t3Docs}/install.md`],
      },
      {
        en: 'Gemini. Enable Antigravity, install Google’s official Antigravity ACP runtime, and choose Sign in with Google. Google confirms that the unmodified runtime and native sign-in are supported for single-user interactive development with eligible Gemini models in ACP clients such as T3 Code and Zed. The official component is the Antigravity agent that each client runs.',
        zh: 'Gemini。启用 Antigravity，安装 Google 官方 Antigravity ACP 组件，再点 Sign in with Google。Google 确认，在 T3 Code、Zed 等 ACP 客户端中使用这个未修改的组件和原生登录，可用个人订阅内符合条件的 Gemini 模型做单用户交互式开发。官方提供的是客户端运行的 Antigravity 智能体。',
        sources: [`${t3Docs}/providers-antigravity.md`, googleAcp, googleZed],
      },
      {
        en: 'Multiple models in one project can work in separate conversations that you start yourself. For example, ask GPT to implement a change, then open a Gemini conversation and ask it to review the diff. T3 Code also exposes agent delegation for supported combinations. Google says its consumer subscription does not cover Codex or Claude delegating work to Antigravity through ACP or headless mode, even with human approval. Automated account rotation is also outside the supported consumer workflow.',
        zh: '同一个项目可以用多个模型。比如让 GPT 实现一个改动，再自己打开 Gemini 会话，请它审查代码差异。T3 Code 也为受支持的组合提供智能体委派。Google 明确说明，个人订阅不支持让 Codex 或 Claude 通过 ACP 或无界面模式把子任务派给 Antigravity，即使有人点击批准也一样。个人套餐也不支持自动轮换账号。',
        sources: [t3Threads, googleDelegation, googleHeadless],
      },
      {
        en: 'GPT. Choose Connect with ChatGPT and authorize T3 Code to use your plan allowance. Leave extra ChatGPT credits disabled if you want usage to stop at the included allowance.',
        zh: 'GPT。选择 Connect with ChatGPT，在 OpenAI 页面授权使用套餐额度。如果希望额度用完就停，保持额外 ChatGPT credits 选项关闭。',
        sources: [`${t3Docs}/providers-codex.md`, openaiPlans],
      },
      {
        en: 'Claude. Install Claude Code and sign in with claude auth login. T3 Code documents using that login. Anthropic permits subscribers to sign in to the unmodified Claude Code binary and restricts third-party handling of plan credentials. Public confirmation from Anthropic specific to T3 Code was not located.',
        zh: 'Claude。安装官方 Claude Code，用 claude auth login 登录，T3 Code 会使用该登录。Anthropic 允许用户在未修改的 Claude Code 中登录自己的订阅，对第三方代管或转发订阅凭据有限制。尚未找到 Anthropic 点名确认 T3 Code 这项集成的公开说明。',
        sources: [`${t3Docs}/providers-claude.md`, anthropicAuth],
      },
      {
        en: 'Magpie is a local gateway with both API-key and subscription routes. Google’s terms allow suspension of Antigravity or Gemini CLI access for unauthorized third-party access. In November 2026, a Magpie user reported losing Antigravity access after using Magpie’s Antigravity subscription route. The user reported that their Google account and paid subscription remained active. This report does not establish how often suspensions occur.',
        zh: 'Magpie 是本地网关，既能接 API Key，也能转接订阅。Google 条款规定，未经授权的第三方接入可导致 Antigravity 或 Gemini CLI 的访问被暂停。2026 年 11 月，一位 Magpie 用户报告称，用过 Magpie 的 Antigravity 订阅转接后，该服务的访问被停用。按其自述，Google 账号和付费订阅仍然有效。这条报告无法用来估算封禁概率。',
        sources: [magpieSubscriptions, googleTerms, magpieReport],
      },
      {
        en: 'Check the exact route when comparing gateways. Magpie documents using the installed Claude Code for its Claude subscription bridge. That describes the mechanism, while Anthropic’s credential rules still apply to third-party routing. Magpie’s separate ChatGPT API provider implements Sign in with ChatGPT. OpenAI documents that authorization path for eligible open-source apps. Reusing a Codex session to route requests is a different connection. Official API keys are another route and use the provider’s API billing rules.',
        zh: '比较网关时，先看具体接入路径。Magpie 文档说明，其 Claude 订阅桥接会调用本机安装的 Claude Code，第三方转接仍受 Anthropic 的凭据规则约束。Magpie 的 ChatGPT API 提供方实现了 Sign in with ChatGPT，OpenAI 为符合条件的开源客户端提供了这条授权路径。复用 Codex 会话来转发请求属于另一种接法。使用官方 API Key 则按各家的 API 规则计费。',
        sources: [magpieSubscriptions, anthropicAuth, magpieChatgpt, openaiClients],
      },
    ],
    origin: {
      sources: [t3Repo, `${t3Repo}/blob/main/AGENTS.md#terminology`, 'https://t3.codes/'],
      en: ['Theo and Julius are named among the maintainers of T3 Code, published by T3 Tools. The project wraps coding agents that already run on a machine in a shared interface and makes their threads accessible from desktop, web, and mobile.'],
      zh: ['T3 Code 由 T3 Tools 发布，项目把 Theo 和 Julius 列为维护者。它的出发点是给已经在机器上运行的编程智能体一个共同界面，让人能在桌面、网页和手机上回到同一个会话。'],
    },
    features: {
      sources: [`${t3Repo}#what-you-get`, t3Threads, `${t3Docs}/source-control.md#review-turn-changes`],
      en: [
        'There are two useful ways to bring in a second model. Switch models in the current thread to continue the main job with it. Delegate a focused question when you want a child thread that you can inspect beside the parent.',
        'The Agents panel and conversation cards show delegated activity. Requests for your input or approval return to the parent. In a Git project you can inspect a turn’s changes in the same workspace. Use the branch comparison when you need the whole change against the base branch.',
      ],
      zh: [
        '把另一位智能体请进来有两种做法。想让它接着做主任务，就在原线程切模型。想让它专查一个问题，就委派出去，在主线程旁边打开子线程。同一个改动的来龙去脉可以留在原处。',
        '委派跑起来以后，从对话卡片或 Agents 面板看进度。需要你回答或批准的请求会回到主线程。在 Git 项目里可以先看本轮变更。要检查这个分支从头到尾改了什么，再打开分支对比。审阅意见说「两处要改」时，可以直接翻差异，免得靠聊天记录猜是哪两处。',
      ],
    },
    example: {
      sources: [`${t3Docs}/install.md`, t3Threads, `${t3Docs}/source-control.md#review-turn-changes`],
      en: {
        title: 'Example: implement a change and inspect the review beside it',
        setup: 'Install T3 Code and sign in to the agents you want to use. For this exercise, prepare two supported providers and a Git repository you can safely edit.',
        steps: [
          'Open a thread and ask the parent agent to trim whitespace from one settings field, add a regression test, and report which files changed.',
          'In the parent thread, request a review by the second agent. Ask it to inspect the diff for empty-string behavior and backwards compatibility, and to report findings without editing.',
          'Open Agents or the delegation card and select the reviewer. Read it beside the parent, check the flagged lines in the diff, and ask the parent to act on findings you agree with.',
        ],
      },
      zh: {
        title: '案例｜做完一个小改动，把审阅开在旁边',
        setup: '安装 T3 Code，把要用的智能体分别登录好。这次练习准备两个受支持的提供方，以及一个可以放心修改的 Git 仓库。',
        steps: [
          '在主线程请一位智能体给某个设置字段去掉首尾空白，补一条回归测试，并列出修改过的文件。',
          '在同一主线程请它委派给第二位智能体，只查空字符串的行为和旧配置的兼容性。要求指到具体差异，暂不改文件。',
          '从 Agents 面板或委派卡片打开审阅线程，与主线程并排看。到差异里核对审阅指出的行，再让主线程处理你认可的问题。',
        ],
      },
    },
  }],
]);

export const COMPARISON_INTRO = {
  en: [
    'Compare Cindy, PigBun Partner, and Multica on the same task. Update a setup guide after a configuration change, verify the steps, and prepare a draft for review.',
  ],
  zh: [
    '用同一个任务对照 Cindy、PigBun Partner 和 Multica。配置变更后，更新配置指南、核对操作步骤，并准备一份待审草稿。',
  ],
};
