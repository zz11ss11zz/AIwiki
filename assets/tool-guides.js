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

export const GUIDE_SOURCE_LABELS = new Map([
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
  [`${t3Docs}/source-control.md#review-turn-changes`, ['Reviewing turn changes', '检查本轮 Git 改动']],
]);

// Each guide groups the editorial paraphrase with the primary sources for that section.
export const TOOL_GUIDES = new Map([
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
    'Three agents showing “working” tells you very little about where the work meets again. Start with what must happen after you split the task.',
    'If several roles need a shared plan and folder, AionUi gives them a board. If one review needs a clean brief and a separate transcript, Codeg gives the worker its own session. If you want the review beside the thread doing the implementation, T3 Code keeps both in view. The examples below let you try those differences with a small job.',
  ],
  zh: [
    '界面上三个人同时显示「正在工作」，并不能告诉你结果该去哪儿找。选工具前先想想，活拆出去以后，是要几个人持续接力，还是只请一位同事看一眼？',
    '做发布简报，写稿和核事实得来回交接，AionUi 的看板更容易找到下一棒。只想找两个漏测输入，Codeg 的独立工作者会话适合收一份清楚的答复。改代码时希望把审阅开在实现旁边，T3 Code 可以让两个线程并排。下面各有一个可跟做的例子。',
  ],
};
