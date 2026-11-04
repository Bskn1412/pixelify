/**
 * Day 1 Blog Post (ZH)
 * Archive of remaining posts is preserved in data/blog_archive/
 */
export const POSTS_ZH = [
{
  "slug": "enable_webgpu_guide_b5c9e8",
  "title": "启用 WebGPU：让浏览器 AI 运行速度大幅提升的两分钟小改变",
  "description": "WebGPU 允许基于浏览器的 AI 在你的图形芯片而非 CPU 上运行，速度通常可提升 5 到 10 倍。本文提供各浏览器的开启指南，以及如何在设置中通过引擎徽章确认其已生效。",
  "tags": [
    "WebGPU",
    "指南",
    "性能"
  ],
  "date": "2026-11-05",
  "author": "Pixelify 团队",
  "cover": "/blogs/settings-engine.jpg",
  "coverAlt": "Pixelify 设置下拉菜单，显示实时的引擎状态徽章",
  "blocks": [
    {
      "type": "p",
      "text": "这里有一个只需两分钟且效果显著的任务。基于浏览器的 AI 运行在两条路径之一：一条是随处可用但速度很慢的 CPU 路径，另一条是利用你的图形芯片、能以数倍速度完成相同工作的 GPU 路径（WebGPU）。许多浏览器默认已提供 WebGPU 支持但并不显眼，有时隐藏在实验性标志（flag）后面，有时则干脆从未被勾选。启用它并确认工具确实完成了切换，是你能够进行的最具回报率的配置调整。"
    },
    {
      "type": "h2",
      "text": "用一段话解释什么是 WebGPU"
    },
    {
      "type": "p",
      "text": "WebGPU 是浏览器通往图形硬件的现代接口，是旧版 WebGL 的继承者，专门为计算（Compute）以及渲染进行了重新设计。这种重新设计对 AI 而言尤为重要：旧的技术栈是为了绘制三角形而构建的，通过它运行数学工作负载需要进行各种扭曲，从而限制了性能。WebGPU 妥善地开放了计算能力，这就是为什么神经网络作为纯粹的并行算术，在它可用时会获得如此不成比例的性能提升。"
    },
    {
      "type": "h2",
      "text": "检查你是否已经拥有它"
    },
    {
      "type": "p",
      "text": "在做任何更改之前，最快的途径往往是发现你其实已经完成了配置。打开应用の設定面板（右上角的齿轮图标）并查看引擎徽章。如果徽章显示 GPU 加速，说明 WebGPU 处于活动状态，无需任何配置。如果它显示 CPU 回退（fallback），接下来的部分将涵盖所有主流浏览器。在手机上，结果通常取决于你的操作系统版本而不是任何设置，因此升级操作系统就是完整的操作步骤。"
    },
    {
      "type": "callout",
      "title": "去哪里找",
      "text": "设置（齿轮图标）→ 引擎徽章。每个工具都会报告其自身的实时引擎，这是从运行时直接读取而非凭空假设的，因此徽章反映的是现实，而不是对功能检测的乐观臆测。"
    },
    {
      "type": "h2",
      "text": "Chrome 和 Microsoft Edge",
      "icons": [
        "chrome",
        "edge"
      ]
    },
    {
      "type": "p",
      "text": "如果你的浏览器正在使用 CPU 回退（fallback）而非 GPU 硬件加速，启用相应的 WebGPU 实验性标志（flag）或许有助于解决该问题。请按照以下步骤在 Google Chrome 或 Microsoft Edge 中检查并配置 WebGPU。"
    },
    {
      "type": "img",
      "src": "/blogs/how-to-webgpu-chrome.png",
      "alt": "在 Google Chrome 和 Microsoft Edge 中启用 WebGPU 实验性标志",
      "caption": "在 chrome://flags 或 edge://flags 中搜索 \"WebGPU\" 并启用该标志。"
    },
    {
      "type": "h3",
      "text": "步骤 1：打开浏览器实验性标志页面"
    },
    {
      "type": "p",
      "text": "在电脑桌面上启动 Google Chrome 或 Microsoft Edge。点击地址栏，在 Chrome 中输入 chrome://flags 或在 Microsoft Edge 中输入 edge://flags，然后按 Enter 回车键以访问实验性功能页面。"
    },
    {
      "type": "h3",
      "text": "步骤 2：搜索 WebGPU"
    },
    {
      "type": "p",
      "text": "打开 Experiments 页面后，找到顶部的搜索框。输入 WebGPU 过滤可用的实验性设置，找到相关的 WebGPU 标志。"
    },
    {
      "type": "h3",
      "text": "步骤 3：启用 WebGPU 标志"
    },
    {
      "type": "p",
      "text": "找到如下图所示的 \"Force enable WebGPU interop\" 选项。点击其旁边的下拉菜单，将选项从 Default 更改为 Enabled。"
    },
    {
      "type": "p",
      "text": "该标志主要适用于特定的图形硬件配置，尤其是 Linux 上基于 Vulkan 的环境。如果该选项不可用或不适用于你的系统，并不意味着必须开启它 WebGPU 才能运行。"
    },
    {
      "type": "h3",
      "text": "步骤 4：重新启动浏览器"
    },
    {
      "type": "p",
      "text": "修改标志后，如果浏览器底部显示 Relaunch（重启）按钮，请点击它。这将重启浏览器并应用更新后的实验性设置。重启前请务必保存所有未完成的工作。"
    },
    {
      "type": "h3",
      "text": "步骤 5：验证 WebGPU 功能"
    },
    {
      "type": "p",
      "text": "重启后，重新打开你的 WebGPU 应用，检查 CPU 回退警告是否已消失。你也可以在 Chrome 中访问 chrome://gpu 或在 Edge 中访问 edge://gpu，检查浏览器的图形硬件配置并排查潜在的 GPU 相关问题。"
    },
    {
      "type": "h3",
      "text": "如果 WebGPU 仍然无法工作怎么办？"
    },
    {
      "type": "p",
      "text": "如果 WebGPU 依然退回到 CPU 运行，问题可能与显卡驱动兼容性、浏览器设置或硬件支持有关。请更新显卡驱动程序，检查浏览器是否正确调用了高性能独立显卡，并查看浏览器的 GPU 诊断日志排查报错。"
    },
    {
      "type": "callout",
      "title": "提示",
      "text": "在许多受支持的桌面操作系统上，WebGPU 默认已处于开启状态。可用的标志及其效果因浏览器版本和操作系统而异，因此启用标志并不绝对保证能获得 GPU 加速。"
    },
    {
      "type": "h2",
      "text": "Mozilla Firefox",
      "icons": [
        "firefox"
      ]
    },
    {
      "type": "p",
      "text": "Firefox 在现代版本中已内置 WebGPU 支持，并在各大主流平台上默认启用。如果你的系统仍然提示 CPU 回退，可以按照以下步骤通过 Firefox 的高级配置编辑器手动检查或启用 WebGPU。"
    },
    {
      "type": "h3",
      "text": "步骤 1：打开高级配置页面"
    },
    {
      "type": "p",
      "text": "在桌面启动 Firefox，在地址栏中输入 about:config 并按 Enter 回车键。"
    },
    {
      "type": "h3",
      "text": "步骤 2：接受警告提示并继续"
    },
    {
      "type": "p",
      "text": "Firefox 会弹出警告提示，说明修改高级首选项可能会影响性能与稳定性。点击“接受风险并继续”以进入配置编辑器。"
    },
    {
      "type": "h3",
      "text": "步骤 3：搜索 WebGPU 首选项"
    },
    {
      "type": "p",
      "text": "在顶部的首选项名称搜索框中输入 dom.webgpu.enabled，找到核心的 WebGPU 设置项。"
    },
    {
      "type": "h3",
      "text": "步骤 4：将 WebGPU 标志切换为 True"
    },
    {
      "type": "p",
      "text": "双击 dom.webgpu.enabled（或点击右侧的切换按钮），将其值从 false 切换为 true。如果你的图形配置需要强制加速（特别是在使用 Vulkan 的 Linux 系统上），还可以搜索 gfx.webgpu.force-enabled 并同样将其切换为 true。"
    },
    {
      "type": "h3",
      "text": "步骤 5：重启 Firefox 并验证"
    },
    {
      "type": "p",
      "text": "完全关闭并重新打开 Firefox 以使更改生效。访问 about:support 查看“图形”部分确认 WebGPU 状态，或重新加载 Pixelify 并在“设置”中检查引擎徽章。"
    },
    {
      "type": "h3",
      "text": "Firefox 疑难解答"
    },
    {
      "type": "p",
      "text": "Firefox 历史上需要 Linux/Windows 上最新的 Vulkan 驱动以及 macOS 上的 Metal。如果 Firefox 仍然退回到 CPU，请确保显卡驱动已更新至厂商最新版本，并在 about:support 中确认 WebRender 正运行在硬件加速模式下。"
    },
    {
      "type": "h2",
      "text": "Brave Browser",
      "icons": [
        "brave"
      ]
    },
    {
      "type": "p",
      "text": "Brave 基于 Chromium 构建，享有与 Chrome 同样强大的硬件加速引擎。不过，由于 Brave 内置了严格的隐私防护盾（Shields）以及特殊的默认标志设置，WebGPU 有时会受到限制。请按照以下步骤在 Brave 中启用 WebGPU。"
    },
    {
      "type": "h3",
      "text": "步骤 1：打开 Brave 标志页面"
    },
    {
      "type": "p",
      "text": "在电脑桌面上打开 Brave 浏览器。在地址栏输入 brave://flags 并按 Enter 回车键以打开实验性设置页面。"
    },
    {
      "type": "h3",
      "text": "步骤 2：搜索 WebGPU"
    },
    {
      "type": "p",
      "text": "在 Experiments 页面顶部的搜索框中输入 WebGPU，筛选所有与 WebGPU 相关的设置。"
    },
    {
      "type": "h3",
      "text": "步骤 3：启用 WebGPU 标志"
    },
    {
      "type": "p",
      "text": "找到 \"Force enable WebGPU interop\" 及/或 \"Unsafe WebGPU\" 标志。点击每个适用设置旁边的下拉菜单，将其从 Default 切换为 Enabled。"
    },
    {
      "type": "h3",
      "text": "步骤 4：检查 Brave Shields 指纹防护设置"
    },
    {
      "type": "p",
      "text": "Brave Shields 默认开启指纹追踪阻止功能，有时这会阻止网站查询你的 GPU 适配器详细信息。如果 Pixelify 仍无法初始化 GPU，请点击地址栏中的 Brave 狮子盾牌图标，确认该站点的指纹防护未设置为“严格（Aggressive）”。"
    },
    {
      "type": "h3",
      "text": "步骤 5：重启 Brave 并验证"
    },
    {
      "type": "p",
      "text": "点击标志页面底部的 Relaunch 按钮重启 Brave。重启后，访问 brave://gpu 检查 WebGPU 状态，或返回 Pixelify 确认引擎状态是否显示 GPU 加速。"
    },
    {
      "type": "h3",
      "text": "Brave 疑难解答"
    },
    {
      "type": "p",
      "text": "如果 Brave 仍然使用 CPU 回退，请前往 brave://settings/system 并确认“在可用时使用图形加速”已开启。同时确保操作系统已将 Brave 分配给高性能独立 GPU 运行。"
    },
    {
      "type": "h2",
      "text": "Safari on macOS",
      "icons": [
        "safari"
      ]
    },
    {
      "type": "p",
      "text": "Safari 从近期的 macOS 与 Safari 版本开始提供 WebGPU 支持，并在支持的 Apple Silicon 与现代 Intel 硬件上默认开启。如果你需要在 Safari 中检查或配置 WebGPU，请按照以下步骤操作。"
    },
    {
      "type": "h3",
      "text": "步骤 1：启用“开发”菜单"
    },
    {
      "type": "p",
      "text": "在 macOS 上打开 Safari。在顶部菜单栏中，点击 Safari 浏览器 > 设置（或偏好设置），选择“高级”标签页，然后勾选“为网页开发者显示功能”（或旧版中的“在菜单栏中显示‘开发’菜单”）。"
    },
    {
      "type": "h3",
      "text": "步骤 2：打开功能标志（Feature Flags）"
    },
    {
      "type": "p",
      "text": "点击顶部菜单栏中的“开发”菜单，导航至“功能标志（Feature Flags）”（在旧版 Safari 中为“实验性功能”）。"
    },
    {
      "type": "h3",
      "text": "步骤 3：启用 WebGPU"
    },
    {
      "type": "p",
      "text": "在搜索框中输入 WebGPU。找到 WebGPU 条目并确保其复选框已勾选/启用。"
    },
    {
      "type": "h3",
      "text": "步骤 4：重启 Safari 并验证"
    },
    {
      "type": "p",
      "text": "退出并重新打开 Safari。重新打开 Pixelify 并检查“设置”（齿轮图标）中的引擎状态徽章，确认 GPU 硬件加速已生效。"
    },
    {
      "type": "h2",
      "text": "Android 与 iOS"
    },
    {
      "type": "p",
      "text": "在 Android 上，WebGPU 的可用性同时取决于浏览器版本和设备的 GPU 驱动程序代系；过去几年中的旗舰设备得到了广泛支持，同时更新浏览器和系统 WebView 可以解决绝大多数差距。在 iOS 和 iPadOS 上，WebGPU 支持随着近期的 Safari 到来，并被平台上的每个浏览器所继承，因为它们都使用相同的底层引擎。在这两个生态系统中，操作系统版本通常是主要的杠杆。"
    },
    {
      "type": "img",
      "src": "/blogs/home-mobile.jpg",
      "alt": "手机上的 Pixelify，展示了带有硬件加速的本地处理",
      "caption": "在手机上，WebGPU 的可用性通常是一个操作系统版本的问题，而不是设置问题。"
    },
    {
      "type": "h2",
      "text": "确认它确实生效了"
    },
    {
      "type": "p",
      "text": "这一步是人们最常跳过、但也是最关键的一步。启用了某个标志并不能保证工具就能使用它：驱动程序报告错误、硬件在某一代内缺少所需功能、浏览器可能会静默回退。唯一值得信赖的确认方式是工具本身报告它正在运行哪种引擎。启用所有设置后重新打开设置面板，再次读取徽章。GPU 加速：搞定。CPU 回退：上面的某项设置没有生效，浏览器的 GPU 诊断页面将指出失败的功能。"
    },
    {
      "type": "h2",
      "text": "启用后有何期待"
    },
    {
      "type": "p",
      "text": "现实的期望：在 CPU 路径上原本需要五到十秒的单张小图，通常会降至一到两秒。大图像和批量处理也会有同等比例的改善，此外还有一个额外的好处，即 GPU 路径在笔记本电脑上的热管理更加优雅；图形芯片比 CPU 风扇更能适应持续的数学运算，从而排出处理器热量。路径之间的质量不会改变；同样的网络无论走哪条路运行效果都一样。只有等待时间发生了变化，而且是质的变化。"
    },
    {
      "type": "h2",
      "text": "另外两件值得了解的事"
    },
    {
      "type": "p",
      "text": "第一点是，WebGPU 是一个共享平台，而不是本工具独占的高级功能。你在同一台机器上安装的任何其他本地 AI 项目，都会开始使用你刚刚解锁的相同加速路径，而无需它们要求你配置任何东西。这种互操作性正是让基于浏览器的 AI 感觉像一个平台，而不是一堆孤立应用的原因。"
    },
    {
      "type": "p",
      "text": "第二点关于如何在实验时验证进度。如果你想在自己的机器上确认加速是真实的，而不是盲目相信博客文章的数字，可以在徽章处于 GPU 状态和 CPU 状态下分别运行一次单张图片，并使用系统的性能分析器（profiler）对处理阶段进行计时。大多数用户会发现差异大到在结果中显而易见；想要确切数字的人可以在三十秒内得到它们，这把一次博客阅读变成了一次第一手的实测。"
    },
    {
      "type": "p",
      "text": "关于为什么这不仅仅关乎速度的最后一点说明。WebGPU 不是绑定到某个服务的专有加速器；它是一个开放的、跨厂商的标准，每个浏览器和硬件制造商都对其进行了实现。只需启用一次，就能升级你今天和未来使用的每一个本地 AI 工具，而无需它们要求你安装任何东西。两分钟，没有下载，没有账户，一个让浏览器 AI 从“勉强可用”跃升至“真正飞速”的开关。"
    }
  ]
}
];
