let language = 'zh';
try { language = localStorage.getItem('ytl-language') === 'en' ? 'en' : 'zh'; } catch {}
const app = document.querySelector('#app');
const choose = (zh, en) => language === 'zh' ? zh : en;
let disposeScene;
let renderId = 0;
const projects = [
  {
    id: 'longguan', image: 'longguan', label: ['双语影像 · 教育传播', 'BILINGUAL FILM · EDUCATION'],
    title: ['让乡野童声，被更多人听见', 'A village childhood, told in two languages'],
    name: ['龙观乡幼儿园', 'Longguan Kindergarten'],
    summary: ['用双语短视频记录校园教学与生态育人日常，把地方教育的温度，转译为可被理解的故事。', 'A bilingual short film documenting everyday learning and nature-based education, sharing the character of a local kindergarten with a wider audience.'],
    date: ['2025.11 — 2025.12', 'NOV — DEC 2025'],
    role: ['双语短视频项目负责人', 'Bilingual short-film project lead'],
    tags: [['双语表达', '影像叙事', '教育传播'], ['Bilingual storytelling', 'Film', 'Education']],
    background: ['幼儿园以“乡野童声”为特色，校园教学与自然环境相互连接。这个项目关注如何通过双语影像，让观众理解其中的教育理念，而不只看到校园画面。', 'The kindergarten connects everyday learning with its rural surroundings. The project explores how bilingual film can communicate the educational approach behind the images.'],
    actions: [['围绕校园教学与生态育人日常组织双语短视频内容。', '将本地教育表达转化为便于跨语言理解的叙事。', '以成片呈现项目成果，保留真实场景与教育语境。'], ['Organized bilingual film content around daily learning and nature-based education.', 'Translated local educational ideas into a narrative accessible across languages.', 'Presented the work as a complete film grounded in real settings.']],
    result: ['已完成双语宣传成片。这里直接展示作品，不使用缺少统计依据的传播增幅作为成果。', 'A completed bilingual promotional film. The film itself is presented as the outcome; unverified audience-growth percentages are not used.'],
    skills: ['双语内容组织、文化语境转译、影像叙事与项目执行。', 'Bilingual content development, cultural translation, visual storytelling and project delivery.']
  },
  {
    id: 'matou', image: 'matou', label: ['乡村调研 · 文化活化', 'FIELD RESEARCH · LOCAL CULTURE'],
    title: ['从村民的故事里，寻找文化的新可能', 'Listening first. Reimagining local culture.'],
    name: ['马头村', 'Matou Village'],
    summary: ['走访村民与产业负责人，梳理布龙文化和闲置空间，把调研发现转化为具体的文化活化建议。', 'Listening to residents and local businesses, documenting cloth-dragon heritage and underused spaces, and turning field observations into cultural proposals.'],
    date: ['2026.03 — 2026.04', 'MAR — APR 2026'],
    role: ['乡村文化升级项目负责人', 'Village cultural-development project lead'],
    tags: [['实地调研', '资源梳理', '文化策划'], ['Field research', 'Resource mapping', 'Cultural planning']],
    background: ['马头村的布龙文化承载着地方记忆。项目从村民的真实需求出发，关注文化资源如何与公共空间、参与式活动和乡村发展相连接。', 'Cloth-dragon traditions carry the village’s collective memory. This project starts with residents’ needs and explores connections between local heritage, public space and participatory activities.'],
    actions: [['开展4次实地调研，走访12位村民及相关负责人。', '梳理6项本地文化资源，盘点3处闲置空间。', '形成1份资源清单与2项文化活化方案，围绕文化展示及互动体验提出项目建议。'], ['Conducted four field visits and interviewed 12 residents and local stakeholders.', 'Mapped six cultural resources and three underused spaces.', 'Developed one resource inventory and two cultural-activation proposals focused on interpretation and participation.']],
    result: ['马头村村民委员会向匠薪团队出具感谢信，肯定2026年3月25日的走访调研，以及文化资源梳理与活化建议。这是对团队项目的认可，不等同于个人获奖或方案已经落地。', 'The village committee issued a letter of appreciation to the Jiangxin team, recognizing its 25 March 2026 field visit, cultural research and proposals. This recognizes the team’s work; it does not imply an individual award or completed implementation.'],
    skills: ['访谈沟通、田野调查、文化资源整合与方案策划。', 'Interviewing, field research, cultural resource mapping and proposal development.']
  },
  {
    id: 'xinbao', image: 'xinbao', label: ['共富工坊 · 品牌运营', 'COMMUNITY ENTERPRISE · BRAND OPERATIONS'],
    title: ['让村庄的好故事，走进日常生活', 'Bringing a village’s stories into everyday life'],
    name: ['新鲍村共富工坊', 'Xinbao Village Community Workshop'],
    summary: ['从茗山夜市的内容运营，到村庄资源调研与“新鲍好物”文创，参与地方品牌从想法到执行的过程。', 'From Mingshan Night Market content to village research and Xinbao product design, contributing to a local brand from planning through execution.'],
    date: ['2026.07 — 至今', 'JUL 2026 — PRESENT'],
    role: ['共富工坊项目运营专员', 'Community workshop project operations specialist'],
    tags: [['内容运营', '品牌策划', '文创设计'], ['Content operations', 'Brand planning', 'Creative design']],
    background: ['新鲍村共富工坊项目连接夜市经营、村庄品牌与地方资源。我的工作既涉及对外传播，也涉及线下运营方案和村庄资源的梳理。', 'The project connects night-market operations, village branding and local resources. My work spans communication, offline planning and research into village assets.'],
    actions: [['参与搭建小红书、抖音、微信公众号三个平台的宣传矩阵，并参与编写6条视频脚本。', '协同团队发布推广笔记31篇、短视频9条；团队累计浏览量超10万次、短视频播放量超50万次。', '参与夜市运营、游园会及调研接待方案，协助梳理闲置地块与老旧厂房。', '参与“新鲍好物”中秋礼盒包装、故事卡和圆形贴纸三类文创设计。'], ['Helped establish channels on Xiaohongshu, Douyin and WeChat, and contributed to six video scripts.', 'Worked with the team on 31 promotional posts and nine videos; the team reported over 100,000 post views and 500,000 video views.', 'Contributed to market operations, event and reception plans, and research into underused land and buildings.', 'Contributed to Mid-Autumn gift packaging, story cards and round labels for Xinbao products.']],
    result: ['正式实习时间为2026年7月13日至9月13日，实习证明对工作表现给予肯定；此后继续参与项目。传播数据来自本人提供的求职简历，属于团队累计成果，不作为个人独立业绩。', 'The documented internship ran from 13 July to 13 September 2026, followed by continued project participation. Reach figures are cumulative team results reported in my supplied résumé, not individual outcomes.'],
    skills: ['多平台内容运营、品牌表达、活动策划、跨角色沟通与执行。', 'Multi-platform content, brand communication, event planning and collaborative delivery.']
  }
];
const translated = value => value[language === 'zh' ? 0 : 1];
const image = (name, alt, extra = '') => `<img src="assets/${name}.webp" alt="${alt}" loading="lazy" decoding="async" ${extra}>`;
const heading = (label, title, description = '') => `<div class="section-heading"><div><div class="eyebrow">${label}</div><h2>${title}</h2></div>${description ? `<p>${description}</p>` : ''}</div>`;
function chrome() {
  document.documentElement.lang = choose('zh-CN', 'en');
  document.title = choose('印天乐 · 在真实世界里，做具体的事', 'Yin Tianle · Ideas into real-world practice');
  document.querySelector('#navigation').innerHTML = [['projects', '项目', 'Projects'], ['about', '关于', 'About'], ['achievements', '成果', 'Work & honors'], ['contact', '联系', 'Contact']].map(([id, zh, en]) => `<a href="#${id}">${choose(zh, en)}</a>`).join('');
  document.querySelector('#language').innerHTML = choose('EN <span>↗</span>', '中文 <span>↗</span>');
  document.querySelector('#language').setAttribute('aria-label', choose('Switch to English', '切换为中文'));
  document.querySelector('#footer').innerHTML = `<span>© 2026 ${choose('印天乐', 'Yin Tianle')} · ${choose('记录行动，也记录成长。', 'A record of work, and of growing.')}</span><span>${choose('独立个人主页 · 非《蜡笔小新》官方网站', 'Independent personal portfolio · Not an official Crayon Shin-chan website')}</span><a href="#home">${choose('回到顶部 ↑', 'Back to top ↑')}</a>`;
}
function archiveTemplate() {
  return `<div class="wrap">
    <section class="hero" id="home"><div>
      <div class="eyebrow">A LITTLE WORLD, A REAL JOURNEY</div>
      <h1>${choose('在真实世界里，<br>做<span style="white-space:nowrap">具体的<em>事。</em></span>', 'Small stories.<br>Real-world<br><em>possibilities.</em>')}</h1>
      <p class="intro">${choose('你好，我是<strong>印天乐</strong>。<br>英语专业学生，也是乡村故事的记录者与项目实践者。用语言连接彼此，用行动让想法发生。', 'Hello, I’m <strong>Yin Tianle</strong>.<br>An English undergraduate exploring local culture, bilingual storytelling and hands-on projects. Connecting people through language, and ideas through action.')}</p>
      <div class="hero-actions"><a class="pill" href="#projects">${choose('看看我做过的事', 'Explore my projects')} <span>↗</span></a><a class="text-link" href="#about">${choose('认识我 ↓', 'About me ↓')}</a></div>
      <div class="hero-foot"><span class="live-dot"></span>${choose('宁波，中国 · 在学习，也在实践', 'NINGBO, CHINA · LEARNING BY DOING')}</div>
    </div><div><div class="scene-shell" id="scene">
      <div class="scene-label">MY LITTLE CORNER<span>${choose('从一个喜欢的小世界开始', 'A little world I feel at home in')}</span></div>
      <div class="scene-fallback" role="status">${choose('正在搭建小世界…', 'Opening a little world…')}</div>
      <a class="hotspot one" href="#about">${choose('认识我', 'About me')}</a><a class="hotspot two" href="#projects">${choose('项目故事', 'Projects')}</a><a class="hotspot three" href="#achievements">${choose('成长与成果', 'Work & honors')}</a>
      <div class="scene-bottom"><span>${choose('拖动旋转 · 双指缩放', 'DRAG TO ROTATE · PINCH TO ZOOM')}</span><div class="scene-tools"><button id="reset-scene" aria-label="${choose('重置视角', 'Reset camera')}">↺</button><button id="motion">${choose('暂停动画', 'Pause motion')}</button><a href="#projects">${choose('跳过 ↗', 'Skip ↗')}</a></div></div>
    </div><div class="scene-note">${choose('交互场景 · 程序化造型初稿', 'INTERACTIVE SCENE · PROCEDURAL MODEL STUDY')}</div></div></section>
    <div class="intro-strip"><div><h2>${choose('把课堂所学，带进真实现场。', 'From the classroom to the field.')}</h2><p>${choose('宁波财经学院 · 英语本科 · 数字译传卓越班', 'Ningbo University of Finance & Economics · English undergraduate')}</p></div><div><b>3.73 <span style="font-size:13px">/ 5.0</span></b><p>${choose('平均学分绩点 · 截至第六学期', 'GPA · Through semester six')}</p></div><div><b>${choose('专业第二', 'No. 2')}</b><p>${choose('综合测评排名 · 截至第六学期', 'Comprehensive assessment rank · Semester six')}</p></div></div>
    <section class="section" id="projects">${heading('01 / SELECTED PROJECTS', choose('三个现场，三段实践。', 'Three places. Three stories.'), choose('不只展示结果，也讲清楚我在其中做了什么。', 'The context, the work, and my part in it.'))}<div class="project-grid">${projects.map((project, index) => `<a class="project-card" href="#project/${project.id}"><div class="project-image">${image(project.image, translated(project.name))}<span class="number">0${index + 1}</span><span class="arrow">↗</span></div><div class="project-kicker">${translated(project.label)}</div><h3>${translated(project.name)}</h3><p>${translated(project.summary)}</p><div class="tags">${translated(project.tags).map(tag => `<span>${tag}</span>`).join('')}</div></a>`).join('')}</div></section>
    <section class="about-panel" id="about">${image('portrait', choose('印天乐在学生代表大会上发言', 'Yin Tianle speaking at a student congress'), 'class="about-photo"')}<div class="about-copy"><div class="eyebrow">02 / ABOUT ME</div><h2>${choose('语言是起点，<br>行动让连接发生。', 'Language starts a conversation.<br>Action takes it further.')}</h2><p>${choose('我是印天乐，就读于宁波财经学院英语专业。我的兴趣在语言与实际项目的交汇处：用双语影像讲述地方故事，在村庄里做调研，在活动现场协调沟通，也参与品牌从内容到运营的细节。', 'I study English at Ningbo University of Finance & Economics. My interests sit where language meets practice: telling local stories through bilingual film, researching villages, coordinating on site, and contributing to brands through content and operations.')}</p><div class="skills">${[
      ['双语传播', '英语表达 · 文化语境转译', 'Bilingual communication', 'English · Cultural translation'],
      ['调研与策划', '访谈 · 资源梳理 · 方案组织', 'Research & planning', 'Interviews · Resources · Proposals'],
      ['内容与品牌', '短视频 · 多平台运营 · 文创', 'Content & branding', 'Film · Social platforms · Design'],
      ['组织与协作', '学生工作 · 活动执行 · 现场服务', 'Coordination', 'Student leadership · On-site delivery']
    ].map(([zh, subZh, en, subEn]) => `<div class="skill">${choose(zh, en)}<small>${choose(subZh, subEn)}</small></div>`).join('')}</div></div></section>
    <section class="section" id="experience">${heading('03 / EXPERIENCE', choose('在不同角色中，积累能力。', 'Experience across different roles.'))}<div class="timeline">${[
      ['2026.04', '亚洲羽毛球锦标赛', 'Badminton Asia Championships', '报名抵离志愿者；服务7天，对接6个国家和地区的57名运动员，获评优秀志愿者。', 'Arrival and registration volunteer: seven days, supporting 57 athletes from six countries and regions. Recognized as an outstanding volunteer.'],
      ['2024.11—2025.11', '中国国际货运产业博览会', 'International Freight Industry Expo', '累计服务14天、112小时，负责一个展位的宣传对接，为20余位参会代表提供中英口译支持。', '14 days and 112 hours of service, supporting a booth’s promotion and providing Chinese–English interpreting for over 20 delegates.'],
      ['2024.07—2024.09', '乡音公益教学实践', 'Xiangyin community teaching', '参与6次公益课程，服务267名学生，完成12小时志愿服务，把语言学习与互动体验带进课堂。', 'Participated in six community classes serving 267 students, with 12 volunteer hours combining language learning and interactive activities.'],
      ['2024—', '校园组织与学生工作', 'Student leadership', '院团委学生副书记、学生助理团团长等经历，参与活动组织、团队协作和学生服务。', 'Experience as a student deputy secretary of the faculty Youth League and student assistant team leader, supporting activities and student services.']
    ].map(([date, zh, en, subZh, subEn]) => `<div class="timeline-row"><time>${date}</time><h3>${choose(zh, en)}</h3><p>${choose(subZh, subEn)}</p></div>`).join('')}</div></section>
    <section class="section" id="achievements"><div class="section-heading"><div><div class="eyebrow">04 / WORK & RECOGNITION</div></div></div><div class="tabs" role="tablist" aria-label="${choose('成果类别', 'Achievement categories')}">${[['honors','竞赛荣誉','Honors'],['papers','论文','Papers'],['ip','专利软著','Patents & software']].map(([id, zh, en], index) => `<button role="tab" id="tab-${id}" aria-controls="records" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-tab="${id}">${choose(zh,en)}</button>`).join('')}</div><div class="records" id="records" role="tabpanel" aria-labelledby="tab-honors" tabindex="0"></div><p class="fine-print" id="records-note"></p></section>
    <section class="contact" id="contact"><div><div class="eyebrow">LET’S CONNECT</div><h2>${choose('下一段故事，期待与你交流。', 'Let’s start a conversation.')}</h2><p>${choose('关于项目、交流与新的可能，欢迎来信。', 'For projects, conversations and new possibilities.')}</p></div><a class="email" href="mailto:Yintianle2005@outlook.com">Yintianle2005@outlook.com ↗</a></section>
  </div>`;
}
const records = {
  honors: [
    {id:'lscat-hy-2026-06',date:'2026.06.29',zh:'第十一届浙江省笔译大赛 · 汉译英本科组',en:'11th Zhejiang Translation Competition · Chinese to English',subZh:'省级个人奖项',subEn:'Provincial individual award',statusZh:'二等奖',statusEn:'Second prize',original:'assets/awards/lscat-hy-2026-06.pdf'},
    {id:'lscat-yh-2026-06',date:'2026.06.29',zh:'第十一届浙江省笔译大赛 · 英译汉本科组',en:'11th Zhejiang Translation Competition · English to Chinese',subZh:'省级个人奖项',subEn:'Provincial individual award',statusZh:'三等奖',statusEn:'Third prize',original:'assets/awards/lscat-yh-2026-06.pdf'},
    {id:'lscat-zy-2026-06',date:'2026.06.29',zh:'第十一届浙江省笔译大赛 · 中译德本科组',en:'11th Zhejiang Translation Competition · Chinese to German',subZh:'省级个人奖项',subEn:'Provincial individual award',statusZh:'三等奖',statusEn:'Third prize',original:'assets/awards/lscat-zy-2026-06.pdf'},
    {id:'lscat-dy-2026-06',date:'2026.06.29',zh:'第十一届浙江省笔译大赛 · 德译中本科组',en:'11th Zhejiang Translation Competition · German to Chinese',subZh:'省级个人奖项',subEn:'Provincial individual award',statusZh:'三等奖',statusEn:'Third prize',original:'assets/awards/lscat-dy-2026-06.pdf'},
    {id:'challenge-2026-05',date:'2026.06',zh:'浙江省第十五届“挑战杯”大学生创业计划竞赛',en:'15th Zhejiang Challenge Cup · Entrepreneurship Competition',subZh:'团队作品《蒸心实意》',subEn:'Team project “Zheng Xin Shi Yi”',statusZh:'铜奖',statusEn:'Bronze',original:'assets/awards/challenge-2026-05.pdf'},
    {id:'challenge-red-2025-05',date:'2025.05',zh:'浙江省第十九届“挑战杯”红色专项赛',en:'19th Zhejiang Challenge Cup · Red-themed Research Track',subZh:'乡村精神文化需求与赋能创新研究',subEn:'Research on rural cultural needs and empowerment',statusZh:'银奖',statusEn:'Silver',original:'assets/awards/challenge-red-2025-05.pdf'},
    {id:'century-2025-05',date:'2025.05',zh:'第30届“21世纪杯”全国英语演讲比赛校赛',en:'30th “21st Century Cup” English Speaking Competition',subZh:'校级个人奖项',subEn:'University-level individual award',statusZh:'二等奖',statusEn:'Second prize'},
    {id:'china-story-2025-03',date:'2025.03',zh:'“用英语讲中国故事”大会',en:'Stories of China Retold in English',subZh:'市级个人奖项',subEn:'Municipal individual award',statusZh:'优胜奖',statusEn:'Merit award'},
    {id:'ecology-2024-11',date:'2024.11',zh:'浙江省第七届大学生环境生态科技创新大赛',en:'7th Zhejiang Collegiate Environmental & Ecological Innovation Competition',subZh:'自主赛道（理念、实物类）· 团队奖项',subEn:'Open track · Team award',statusZh:'二等奖',statusEn:'Second prize',original:'assets/awards/ecology-2024-11.pdf'},
    {id:'bisheng-2023-12',date:'2023.12',zh:'宁波财经学院“毕昇印杯”商业模式设计大赛',en:'NCC “Bishengyin Cup” Business Model Design Competition',subZh:'项目《乐农一线》· 校级团队奖项',subEn:'Project “Lenong Frontline” · University-level team award',statusZh:'三等奖',statusEn:'Third prize'},
    
  ],
  papers: [
    {id:'bulong-ip-2026-04',date:'2026.04',zh:'布龙非遗演艺IP的产业化运营与品牌构建研究',en:'Commercial Operations and Branding of Cloth-Dragon Heritage Performances',subZh:'《文化时代》· 论文扫描件',subEn:'Culture Times · Scanned paper',statusZh:'论文',statusEn:'Paper',original:'assets/papers/bulong-ip-2026-04.pdf'},
    {id:'bulong-value-2026-04',date:'2026.04',zh:'非遗产业化背景下布龙文化的社会赋能与价值实现研究',en:'Social Empowerment and Value Creation Through Cloth-Dragon Heritage',subZh:'《民族文汇》· 论文扫描件',subEn:'Minzu Wenhui · Scanned paper',statusZh:'论文',statusEn:'Paper',original:'assets/papers/bulong-value-2026-04.pdf'},
    {id:'old-money-2026-01',date:'2026.01',zh:'论“老钱”：社会语言学视角下的阶级话语策略分析',en:'“Old Money”: Class Discourse Strategies from a Sociolinguistic Perspective',subZh:'《文化时代》· 论文扫描件',subEn:'Culture Times · Scanned paper',statusZh:'论文',statusEn:'Paper',original:'assets/papers/old-money-2026-01.pdf'},
    {id:'rural-culture-2025-05',date:'2025.05',zh:'文化资本视域下乡村文化赋能的内在逻辑与实践路径',en:'Rural Cultural Empowerment Through the Lens of Cultural Capital',subZh:'《大河报》· 论文扫描件',subEn:'Dahe Daily · Scanned paper',statusZh:'论文',statusEn:'Paper',original:'assets/papers/rural-culture-2025-05.pdf'},
    {id:'ancient-books-2024-09',date:'2024.09',zh:'古籍智能监控系统的经济效益与社会效益分析',en:'Economic and Social Benefits of Intelligent Monitoring for Ancient Books',subZh:'《美丽中国》· 论文扫描件',subEn:'Beautiful China · Scanned paper',statusZh:'论文',statusEn:'Paper',original:'assets/papers/ancient-books-2024-09.pdf'},
    {id:'pride-prejudice-2024-03',date:'2024.03',zh:'傲慢与偏见：十九世纪英国社会风俗的再现',en:'Pride and Prejudice: Representing Social Customs in Nineteenth-Century Britain',subZh:'《探索科学》· 论文扫描件',subEn:'Exploring Science · Scanned paper',statusZh:'论文',statusEn:'Paper',original:'assets/papers/pride-prejudice-2024-03.pdf'}
  ],
  ip: [
    {id:'enzyme-2026-04',date:'2026.04',zh:'一种三酶一靶向复合酶制剂',en:'A targeted three-enzyme compound preparation',subZh:'发明专利申请 · 受理通知书',subEn:'Invention patent application · Acceptance notice',statusZh:'已受理',statusEn:'Accepted',original:'assets/ip/enzyme-2026-04.pdf'},
    {id:'huamo-2026-04',date:'2026.04',zh:'一种基于“三维九法”的花馍工业化标准制作工艺',en:'A standardized industrial process for decorative steamed buns',subZh:'发明专利申请 · 受理通知书',subEn:'Invention patent application · Acceptance notice',statusZh:'已受理',statusEn:'Accepted'},
    {id:'urban-rural-2025-12',date:'2025.12',zh:'城乡智慧管理一体化平台系统',en:'Integrated Urban–Rural Smart Management Platform',subZh:'计算机软件著作权登记证书',subEn:'Computer software copyright certificate',statusZh:'已登记',statusEn:'Registered',original:'assets/ip/urban-rural-2025-12.pdf'},
    {id:'dragon-connector-2025-12',date:'2025.12',zh:'一种布龙龙身快速衔接件',en:'A quick connector for cloth-dragon body sections',subZh:'实用新型专利申请 · 受理通知书',subEn:'Utility model patent application · Acceptance notice',statusZh:'已受理',statusEn:'Accepted',original:'assets/ip/dragon-connector-2025-12.pdf'},
    {id:'dragon-frame-2025-12',date:'2025.12',zh:'一种轻量化奉化布龙骨架',en:'A lightweight Fenghua cloth-dragon framework',subZh:'实用新型专利申请 · 受理通知书',subEn:'Utility model patent application · Acceptance notice',statusZh:'已受理',statusEn:'Accepted',original:'assets/ip/dragon-frame-2025-12.pdf'},
    {id:'transcreation-2025-09',date:'2025.09',zh:'HI+AI+BI驱动的品牌译创管理系统',en:'HI+AI+BI Brand Transcreation Management System',subZh:'计算机软件著作权登记证书',subEn:'Computer software copyright certificate',statusZh:'已登记',statusEn:'Registered',original:'assets/ip/transcreation-2025-09.pdf'},
    {id:'yue-2025-04',date:'2025.04',zh:'相越在浙里——跨文化沉浸式越韵数字文旅服务体验系统',en:'Cross-cultural Yue Opera Digital Tourism Experience System',subZh:'计算机软件著作权登记证书',subEn:'Computer software copyright certificate',statusZh:'已登记',statusEn:'Registered',original:'assets/ip/yue-2025-04.pdf'},
    {id:'seed-2024-12',date:'2024.12',zh:'种子载体形态变化分析系统 V1.0',en:'Seed Carrier Morphology Analysis System V1.0',subZh:'计算机软件著作权登记证书',subEn:'Computer software copyright certificate',statusZh:'已登记',statusEn:'Registered',original:'assets/ip/seed-2024-12.pdf'},
    {id:'ancient-env-2024-11',date:'2024.11',zh:'古籍保存环境监控管理系统',en:'Ancient-book Preservation Environment Monitoring System',subZh:'计算机软件著作权登记证书',subEn:'Computer software copyright certificate',statusZh:'已登记',statusEn:'Registered',original:'assets/ip/ancient-env-2024-11.pdf'},
    {id:'ancient-iot-2024-11',date:'2024.11',zh:'基于物联网的古籍保存智能监控软件',en:'IoT-based Ancient-book Preservation Monitoring Software',subZh:'计算机软件著作权登记证书',subEn:'Computer software copyright certificate',statusZh:'已登记',statusEn:'Registered',original:'assets/ip/ancient-iot-2024-11.pdf'}
  ]
};
function showRecords(tab) {
  const recordsElement=document.querySelector('#records');
  const folder=tab==='honors'?'awards':tab;
  const ordered=[...records[tab]].sort((a,b)=>b.date.localeCompare(a.date));
  const action=tab==='papers'?choose('点击查看扫描件','View scanned paper'):choose('点击查看证书','View certificate');
  recordsElement.innerHTML=`<div class="award-grid">${ordered.map(item=>`<article class="award-card"><button class="award-preview" type="button" data-record="${item.id}" data-record-tab="${tab}" aria-label="${action}：${choose(item.zh,item.en)}"><img src="assets/${folder}/${item.id}-thumb.webp" alt="${choose(item.zh,item.en)}" loading="lazy"><span>${action} ↗</span></button><div class="award-copy"><div class="award-meta"><time>${item.date}</time><span class="status">${choose(item.statusZh,item.statusEn)}</span></div><h3>${choose(item.zh,item.en)}</h3><p>${choose(item.subZh,item.subEn)}</p></div></article>`).join('')}</div>`;
  recordsElement.querySelectorAll('[data-record]').forEach(button=>button.addEventListener('click',()=>openRecord(button.dataset.recordTab,button.dataset.record)));
  const notes={honors:["竞赛荣誉按获奖时间由近到远排列；点击缩略图可查看清晰奖状，部分奖项同时提供 PDF 原件。","Competition honors are ordered newest first. Select a thumbnail for a clear certificate; original PDFs are available for selected awards."],papers:["论文按时间由近到远排列；缩略图展示扫描件首页，点击后可查看并打开完整 PDF。","Papers are ordered newest first. Thumbnails show the first scanned page; open a card to view the complete PDF."],ip:["专利软著按时间由近到远排列；已受理仅表示申请获受理，不等同于专利授权。","Patents and software copyrights are ordered newest first. Accepted patent applications are not presented as granted patents."]};
  document.querySelector('#records-note').textContent=translated(notes[tab]);
  document.querySelector('#records').setAttribute('aria-labelledby', `tab-${tab}`);
  document.querySelectorAll('[data-tab]').forEach(button=>{button.setAttribute('aria-selected', String(button.dataset.tab===tab));button.tabIndex=button.dataset.tab===tab?0:-1;});
}
function openRecord(tab,id){
  const item=records[tab]?.find(entry=>entry.id===id);
  if(!item)return;
  const folder=tab==='honors'?'awards':tab;
  document.querySelector('#award-dialog')?.remove();
  const dialog=document.createElement('dialog');
  dialog.id='award-dialog';dialog.className='award-dialog';
  dialog.innerHTML=`<div class="award-dialog-bar"><div><time>${item.date}</time><h2>${choose(item.zh,item.en)}</h2></div><button type="button" class="award-close" aria-label="${choose('关闭','Close')}">×</button></div><img src="assets/${folder}/${item.id}.webp" alt="${choose(item.zh,item.en)}">${item.original?`<a class="award-original" href="${item.original}" target="_blank" rel="noopener">${tab==='papers'?choose('打开完整论文 PDF','Open complete paper PDF'):choose('打开 PDF 原件','Open original PDF')} ↗</a>`:''}`;
  document.body.append(dialog);
  dialog.querySelector('.award-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>dialog.remove(),{once:true});
  dialog.showModal();
}
function detail(project) {
  const index = projects.indexOf(project);
  const metrics = project.id === 'matou' ? [['4','实地调研','Field visits'],['12','走访对象','Interviewees'],['2','文化活化方案','Cultural proposals']] : project.id === 'xinbao' ? [['3','传播平台','Social platforms'],['31','团队推广笔记','Team posts'],['9','团队短视频','Team videos']] : [];
  return `<div class="wrap detail"><a class="back-link" href="#projects">← ${choose('返回项目', 'All projects')}</a><div class="detail-header"><div class="eyebrow">0${index+1} / ${translated(project.label)}</div><h1>${translated(project.title)}</h1><p>${translated(project.summary)}</p></div><dl class="detail-meta"><div><dt>${choose('项目', 'PROJECT')}</dt><dd>${translated(project.name)}</dd></div><div><dt>${choose('我的角色', 'MY ROLE')}</dt><dd>${translated(project.role)}</dd></div><div><dt>${choose('时间', 'PERIOD')}</dt><dd>${translated(project.date)}</dd></div></dl>${project.id === 'longguan' ? `<video controls playsinline preload="none" poster="assets/longguan.webp" aria-label="${choose('龙观乡幼儿园双语宣传成片','Longguan Kindergarten bilingual film')}"><source src="assets/longguan.mp4" type="video/mp4">${choose('浏览器不支持视频播放。', 'Your browser does not support video playback.')}</video><p class="fine-print">${choose('原作品语言与字幕保持不变，视频不会自动播放。', 'Original audio and subtitles are preserved. Video does not autoplay.')}</p>` : image(project.image,translated(project.name),'class="detail-media"')}<div class="detail-body"><h2>${choose('从什么问题出发', 'The context')}</h2><p>${translated(project.background)}</p><h2>${choose('我具体做了什么', 'My contribution')}</h2><ul>${translated(project.actions).map(action=>`<li>${action}</li>`).join('')}</ul>${metrics.length?`<div class="metric-row">${metrics.map(([value,zh,en])=>`<div><b>${value}</b><span>${choose(zh,en)}</span></div>`).join('')}</div>`:''}<h2>${choose('成果与佐证', 'Outcomes & evidence')}</h2><p>${translated(project.result)}</p>${project.id==='matou'?`<blockquote class="quote">${choose('“为我们今后推进乡村文化振兴提供了有益的参考。”','“Provided useful reference for future work on rural cultural revitalization.”')}<p class="fine-print">${choose('— 马头村村民委员会致匠薪团队感谢信（节选）','— Village committee letter to the Jiangxin team (translated excerpt)')}</p></blockquote>${image('matou-team',choose('马头村项目团队记录','Matou project team'))}`:''}<h2>${choose('这段经历沉淀的能力', 'What this experience developed')}</h2><p>${translated(project.skills)}</p><div class="tags">${translated(project.tags).map(tag=>`<span>${tag}</span>`).join('')}</div></div><div class="detail-next"><a href="#projects">← ${choose('全部项目', 'All projects')}</a><a href="#project/${projects[(index+1)%3].id}">${choose('下一段实践', 'Next project')} · ${translated(projects[(index+1)%3].name)} ↗</a></div></div>`;
}
function entrance() {
  return `<section class="entrance-screen">
    <div class="entrance-heading">
      <div class="entry-kicker">YIN TIANLE · PERSONAL SPACE</div>
      <h1>${choose('欢迎来到<br><strong>印天乐的世界</strong>','Enter<br><strong>Yintianle’s World</strong>')}</h1>
      <p>${choose('推开门，认识真实的我。','Open the door. Discover the work and stories that shaped me.')}</p>
    </div>
    <div class="scene-shell exterior-scene" id="scene">
      <div class="entry-loader" role="status"><span class="entry-loader-mark">YL.</span><span>${choose('正在准备场景','Preparing your visit')}</span><i></i></div>
      <div class="scene-fallback">${choose('正在打开小世界…','Opening a little world…')}</div>
      <button class="door-label" id="door-label" aria-label="${choose('点击房门进入室内','Open the front door')}">${choose('进入主页','Enter homepage')} <span>↗</span></button>
      <div class="scene-bottom">
        <span>${choose('拖动旋转 · 滚轮或双指缩放 · 点击房门进入','DRAG TO ORBIT · SCROLL OR PINCH TO ZOOM · TAP THE DOOR TO ENTER')}</span>
        <div class="scene-tools"><button id="reset-scene" aria-label="${choose('重置视角','Reset view')}">↺ <b>${choose('复位','Reset')}</b></button><button id="motion">${choose('暂停动画','Pause motion')}</button></div>
      </div>
    </div>
    <div class="entrance-action">
      <button class="pill" id="enter-house"><span>${choose('进入屋内','Enter')}</span><i>→</i></button>
      <p>${choose('点击房门，开启我的个人空间','Tap the front door to enter my personal space')}</p>
    </div>
    <div class="entrance-corner"><span>NINGBO · CHINA</span><span>PORTFOLIO · 2026</span></div>
  </section>`;
}
const roomItems=[
  ['about','个人介绍','About Me','关于我与能力','Profile & strengths'],
  ['projects','项目与实习','Projects','重点项目与实践','Projects & internships'],
  ['achievements','成果与荣誉','Work & Honors','竞赛、论文、专利与软件著作权','Honors, papers, patents & software'],
  ['contact','联系方式','Contact','邮箱与合作联系','Email & collaboration']
];
function interior() {
  return `<section class="interior-screen"><div class="room-heading"><div class="eyebrow">NOHARA-INSPIRED LIVING ROOM</div><h1>${choose('欢迎来到我的客厅。','Welcome to my living room.')}</h1><p>${choose('点击房间里的物件','Select an object')}</p></div><div id="room-scene" class="room-scene living-room"><div class="scene-fallback" role="status">${choose('正在点亮客厅…','Lighting the living room…')}</div>${roomItems.map(([id,zh,en],index)=>`<a class="room-hotspot" data-object="${id}" href="#${id}"><b>0${index+1}</b><span>${choose(zh,en)}</span></a>`).join('')}</div><nav class="room-accessible" aria-label="${choose('客厅物件导航','Living-room object navigation')}">${roomItems.map(([id,zh,en],index)=>`<a href="#${id}"><b>0${index+1}</b>${choose(zh,en)}</a>`).join('')}</nav><p class="room-footnote">${choose('悬停发现 · 点击进入','HOVER TO DISCOVER · SELECT TO ENTER')}</p></section>`;
}
function contentPage(route) {
  const template=document.createElement('template');template.innerHTML=archiveTemplate();
  const sections=route==='about'?['about','experience']:route==='papers'?['achievements']:[route];
  const content=sections.map(id=>template.content.querySelector(`#${id}`)?.outerHTML||'').join('');
  return `<div class="wrap room-content"><a class="back-link" href="#room">← ${choose('返回屋内','Back to the room')}</a>${content||`<h1>${choose('这页还没找到','Page not found')}</h1>`}</div>`;
}
function updateNavigation(route) {
  const navigation=document.querySelector('#navigation');
  navigation.innerHTML=route==='home'||!route?`<span class="entry-nav-note">${choose('一个关于我的小世界','A little world of my own')}</span>`:`<a href="${route==='room'?'#home':'#room'}">← ${choose(route==='room'?'走出房屋':'返回屋内',route==='room'?'Go outside':'Back to room')}</a>`;
  const entry=['','home','room'].includes(route);
  document.body.classList.toggle('scene-page',entry);
  document.body.classList.toggle('entrance-page',route===''||route==='home');
  document.querySelector('#footer').hidden=entry;
  const skip=document.querySelector('.skip');skip.href='#room';skip.textContent=choose('跳过入场动画，进入屋内','Skip entrance animation and enter the room');
}
async function render() {
  const current = ++renderId;
  disposeScene?.();
  disposeScene = undefined;
  chrome();
  const route = location.hash.slice(1);
  const project = route.startsWith('project/') ? projects.find(item=>item.id===route.split('/')[1]) : null;
  updateNavigation(route);
  const isEntrance=!route||route==='home';
  const isRoom=route==='room';
  app.innerHTML=project?detail(project):isEntrance?entrance():isRoom?interior():contentPage(route);
  window.scrollTo({top:0,behavior:'instant'});
  if(project){document.querySelector('.detail .back-link').insertAdjacentHTML('afterend',`<a class="back-link return-room" href="#room">${choose('返回屋内','Back to room')} ↗</a>`);return;}
  const recordsElement=document.querySelector('#records');
  if(recordsElement)showRecords(route==='papers'?'papers':'honors');
  document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>showRecords(button.dataset.tab)));
  document.querySelector('.tabs')?.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const buttons=[...document.querySelectorAll('[data-tab]')];
    const position=buttons.indexOf(document.activeElement);
    const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(position+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
    showRecords(buttons[next].dataset.tab);buttons[next].focus();
  });
  if(!isEntrance&&!isRoom)return;
  try {
    const module=await import(isRoom?'./room.js?v=12':'./scene.js?v=9');
    if(current!==renderId)return;
    disposeScene=isRoom?module.createRoom(document.querySelector('#room-scene'),language):module.createScene(document.querySelector('#scene'), language);
    if(isEntrance)document.querySelector('#door-label').onclick=()=>document.querySelector('#enter-house').click();
  } catch(error) {
    if(current!==renderId)return;
    const fallback=document.querySelector('.scene-fallback');
    if(fallback)fallback.textContent=choose('场景暂不可用，请使用下方按钮浏览。','Scene unavailable. Use the navigation below.');
    if(isEntrance)document.querySelector('#enter-house').onclick=()=>{location.hash='room';};
    console.warn('Scene unavailable',error);
  }
}
window.addEventListener('hashchange',render);
document.querySelector('#language').addEventListener('click',()=>{
  language=language==='zh'?'en':'zh';
  try {localStorage.setItem('ytl-language',language);} catch {}
  const scroll=window.scrollY;
  render();
  requestAnimationFrame(()=>window.scrollTo({top:scroll,behavior:'instant'}));
});
render();
