export const BROWSER_MEDIA_GUIDE_ID = 'guide:antigravity-batch-media';

const browserDocs = 'https://antigravity.google/docs/browser';
const flowHelp = 'https://support.google.com/flow/answer/';
const tripoDocs = 'https://www.tripo3d.ai/product-doc/';

// 'required' means a product gate, 'review' is a deliberate checkpoint in this guide.
export const BROWSER_MEDIA_GUIDE = [
  {
    id: 'browser-setup',
    figureId: 'tool:google-antigravity',
    sources: [
      [`${browserDocs}#compare-browser-modes-across-surfaces`, 'Google browser mode comparison', 'Google 浏览器模式对照'],
      [`${browserDocs}#pause-take-over-and-sign-in`, 'Google sign-in and takeover guide', 'Google 登录接管说明'],
      [`${browserDocs}#permissions-and-safety-guardrails`, 'Google browser permissions', 'Google 浏览器权限说明'],
    ],
    en: {
      title: 'Set up the browser and decide where to stop',
      intro: 'Use the desktop Antigravity App with the built-in browser agent available. Follow the linked mode comparison if Settings → Browser says Chrome is required. This guide follows the built-in browser. It is based on official documentation. The complete workflow has not been run with signed-in accounts.',
      steps: [
        ['agent', 'Give the agent one site and one pilot batch', 'Start a conversation and ask the browser agent, or use /browser, to open the exact product URL from the relevant route below. Ask it to prepare the form and stop before submitting.'],
        ['required', 'Approve the requested site or take over at login', 'If Antigravity asks to operate on a URL, verify the destination and approve it for this task. Handle sign-in, OAuth, security keys, two-factor checks and CAPTCHAs in the browser yourself. Tell the agent to resume when the project is visible.'],
        ['review', 'Check the account and its available credits', 'Check the target project, access, and credit balance inside the generation product. If the feature is unavailable, stop and check the product help or use the interface manually.'],
        ['required', 'Handle product prompts at download or payment', 'If the built-in browser asks for download permission, confirm the file, website and destination. Antigravity leaves sign-in and payment surfaces to you. A request to buy credits or upgrade ends this practice run.'],
      ],
    },
    zh: {
      title: '先把浏览器和停手位置设好',
      intro: '本指南以桌面版 Antigravity App 的内置浏览器智能体为例。在「设置 → 浏览器」看到需要 Chrome 时，先查官方模式对照，各版本和账号的接管权限会有区别。这篇指南按官方文档编写，尚未用登录账号跑完整流程。',
      steps: [
        ['agent', '一次只交一个网站和一小批', '新开会话，直接描述浏览器任务或输入 /browser，让它打开下方路线给出的官方地址。先填表，停在提交前。'],
        ['required', '按提示放行网站，登录时自己接手', 'Antigravity 询问能否操作网址时，核对真实域名后只放行本次。登录、授权页、安全密钥、双重验证和验证码由你在浏览器里处理。看到正确项目后再让智能体继续。'],
        ['review', '核对账号、项目和余额', '打开生成服务，确认账号能访问所需功能、项目没选错、点数够用。缺少入口时，先查官方帮助或手动操作界面。'],
        ['required', '下载许可和付费页面由你接手', '内置浏览器弹出下载许可时，要核对文件、来源和保存位置。付款也由你自己处理。练习中若遇到购买点数或升级提示，就先停在这一步。'],
      ],
    },
  },
  {
    id: 'flow-video',
    figureId: 'tool:google-flow',
    sources: [
      [`${flowHelp}16353334?hl=en`, 'Google Flow video creation guide', 'Flow 视频生成步骤'],
      [`${flowHelp}16526234?hl=en`, 'Google Flow credits by generation', 'Flow 按次生成的点数说明'],
      [`${flowHelp}16935308?hl=en`, 'Google Flow download and sharing', 'Flow 下载与分享说明'],
    ],
    en: {
      title: 'Route A · Generate a small video batch in Google Flow',
      intro: 'The pilot uses one prompt with two outputs, when the selected model offers that count. If you have several different prompts, keep a row for each shot and submit each approved row through the same video controls.',
      steps: [
        ['agent', 'Prepare the shot', 'Open https://flow.google.com/ and select a practice project. In the standard prompt box, open the model picker, choose Video, enter the shot, and set the model, aspect ratio, duration and output count. Stop before Generate.'],
        ['review', 'Approve settings and the credit budget', 'You check the project, prompt, model, duration and output count, then click Generate once yourself. Google documents charges per generation. One click can request two results, so check the cost for the whole batch.'],
        ['agent', 'Report the result for each shot', 'Have Antigravity read the visible job status and report how many results succeeded or failed. Record the shot ID, model and output count. Keep the original job visible if the page is slow and check its status before deciding to retry.'],
        ['review', 'Watch the clips and select what to download', 'Check subject, framing, motion and audio where applicable. Use the chosen asset’s More → Download. If the browser asks for download permission, verify the file, origin and destination before approving.'],
      ],
      prompt: '/browser Open https://flow.google.com/ and use my practice project. In the standard prompt box choose Video. Enter “A paper boat drifts under a stone bridge, fixed wide shot, soft morning light.” Set 16:9 and two outputs if supported. Report the model, duration, output count and displayed credit cost if available. Stop before Generate. Do not submit, repeat, or share the job.',
    },
    zh: {
      title: '路线 A · 用 Google Flow 批量生成视频',
      intro: '先做一条镜头、两个版本，前提是选中的模型支持该输出数。手里若有多条不同的提示词，就给每条镜头编号，按行准备和提交，方便知道哪一条跑成功了。',
      steps: [
        ['agent', '准备镜头参数', '打开 https://flow.google.com/，选择练习项目。在标准提示框点模型名称，切到 Video，填入镜头描述，设置模型、画幅、时长和输出数。停在 Generate 前。'],
        ['review', '看清参数和这一批要花多少点数', '核对项目、提示词、模型、时长和输出数，由你亲手点一次 Generate。Google 按生成次数计点，一次请求可能出两个视频。页面只显示单个结果的费用时，要把两个都算进去。'],
        ['agent', '按镜头编号记录结果', '让 Antigravity 读取页面状态，记录镜头编号、模型、输出数以及成功和失败数。界面变慢时，先查项目里的原任务再决定是否重跑。多点一下 Generate，可能就多了一批。'],
        ['review', '先看片，再挑选下载', '检查主体、构图、动作，以及需要时的声音。从选中素材的「更多 → 下载」保存。若 Antigravity 弹出下载许可，核对文件名、来源和保存位置后再放行。'],
      ],
      prompt: '/browser 打开 https://flow.google.com/，进入我的练习项目。在标准提示框选择 Video。输入「一只纸船漂过石桥桥洞，固定广角镜头，柔和晨光」。画幅设为 16:9，模型支持时选 2 个输出。告诉我模型、时长、输出数和页面显示的点数费用。停在 Generate 前，先别提交、重试或分享。',
    },
  },
  {
    id: 'tripo-models',
    figureId: 'tool:tripo3d',
    sources: [
      [`${tripoDocs}model-generation/batch-image-to-3d`, 'Tripo batch image-to-3D guide', 'Tripo 批量图生 3D 步骤'],
      [`${tripoDocs}getting-started/pricing-credits`, 'Tripo plan and credits', 'Tripo 套餐与点数'],
      [`${tripoDocs}export-and-integration/export-dcc`, 'Tripo output formats', 'Tripo 导出格式'],
    ],
    en: {
      title: 'Route B · Generate 3D models in Tripo Studio',
      intro: 'Prepare two images you have permission to upload, such as crate.png and stool.png on plain backgrounds. Batch image-to-3D creates a separate model from each image. For several views of one object, use Tripo’s Multi-View mode instead.',
      steps: [
        ['agent', 'Open the native batch form', 'Open https://studio.tripo3d.ai/ and go to 3D Workspace. Choose High-fidelity Model or Smart Topology Mesh, then Batch in the input panel. If Batch is missing, check model and plan availability.'],
        ['required', 'Stage and confirm the two input images', 'Attach only the two approved files to the browser task, or choose them manually in Tripo. If the built-in browser subagent uploads them, Antigravity requires one-time approval. Verify the file names and upload origin in the dialog.'],
        ['review', 'Check the full queue, then start it', 'Confirm there are two separate inputs, check the selected model and the account’s credit cost or balance, and click Generate once yourself. Stop to investigate if Tripo rejects an input, asks for an upgrade, or shows an unexpected charge.'],
        ['review', 'Inspect each mesh and export what you need', 'Rotate each model to check shape, holes, underside, and textures. Match outputs to their original file names. Choose a format such as GLB for a web preview and download only the selected models. Check the download prompt if the browser shows one.'],
      ],
      prompt: '/browser Open https://studio.tripo3d.ai/ and find 3D Workspace, Smart Topology Mesh, then Batch. Use only the two staged files crate.png and stool.png. Wait for my upload confirmation if prompted. Tell me which files are queued, the model preset and any visible credit cost. Stop before Generate. Ask before any export or download.',
    },
    zh: {
      title: '路线 B · 用 Tripo Studio 批量生成 3D 模型',
      intro: '准备两张有权上传的干净参考图，比如 crate.png（木箱）和 stool.png（凳子）。批量图生 3D 会给每张图生一个独立模型。若两张图其实是同一个物体的正反面，就该用 Multi-View。',
      steps: [
        ['agent', '打开产品自己的批量入口', '打开 https://studio.tripo3d.ai/，进 3D Workspace。选择 High-fidelity Model 或 Smart Topology Mesh，再点输入面板里的 Batch。找不到 Batch 时，检查当前模型和套餐是否支持。'],
        ['required', '只准备这两张图，核对上传窗口', '把两张确认可上传的图添加到浏览器任务，或自己在 Tripo 中选择。由内置浏览器智能体上传时，Antigravity 会要求一次性许可。点允许前核对文件名和接收域名。'],
        ['review', '核对队列后亲手开始生成', '确认队列里有两份独立输入、模型档位正确、点数预算够用，再由你点一次 Generate。遇到上传失败、要求升级或费用超出预期时，先停下来查原因。'],
        ['review', '逐个转一圈，再决定导出什么', '检查外形、底面、孔洞和贴图，并把结果对应回原文件名。比如要在网页预览，可选 GLB。只下载合格的模型，浏览器若弹出下载许可，再核对文件和位置。'],
      ],
      prompt: '/browser 打开 https://studio.tripo3d.ai/，找到 3D Workspace → Smart Topology Mesh → Batch。只用我为这次任务准备的 crate.png 和 stool.png，遇到上传许可就等我确认。告诉我队列有哪些文件、选择了哪个模型、页面显示需要多少点数。停在 Generate 前，导出和下载也先问我。',
    },
  },
];
