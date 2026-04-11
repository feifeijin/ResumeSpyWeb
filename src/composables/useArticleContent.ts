import { useI18n } from 'vue-i18n'

export function useArticleContent() {
  const { locale } = useI18n()
  const year = new Date().getFullYear()

  const articles: Record<string, Record<string, string>> = {
    'mastering-resume-writing-best-practices-2025': {
      en: `
<h1>Mastering Resume Writing: Best Practices for ${year}</h1>

<h2>Introduction</h2>
<p>In today's competitive job market, your resume is often your first—and sometimes only—chance to make a lasting impression on potential employers. As we move into ${year}, the art and science of resume writing continue to evolve, influenced by technological advancements, changing workplace dynamics, and shifting recruiter expectations.</p>

<h2>The Foundation: Understanding Resume Basics</h2>

<h3>Clear Structure and Format</h3>
<p>A well-structured resume follows a logical flow that guides recruiters through your professional journey. The standard sections include:</p>
<ul>
  <li><strong>Contact Information</strong>: Professional email, phone number, and LinkedIn profile</li>
  <li><strong>Professional Summary</strong>: A compelling 2-3 sentence overview of your expertise</li>
  <li><strong>Work Experience</strong>: Listed in reverse chronological order</li>
  <li><strong>Education</strong>: Degrees, certifications, and relevant coursework</li>
  <li><strong>Skills</strong>: Technical and soft skills relevant to your target role</li>
</ul>

<h3>Length Matters</h3>
<p>For most professionals, a one-page resume is ideal for those with less than 10 years of experience. Senior professionals may extend to two pages, but every line must add value.</p>

<h2>Content Strategy: What to Include</h2>

<h3>Quantifiable Achievements</h3>
<p>Numbers speak louder than words. Instead of saying "Improved team productivity," write "Increased team productivity by 35% through implementation of agile methodologies."</p>

<h3>Action-Oriented Language</h3>
<p>Begin bullet points with strong action verbs:</p>
<ul>
  <li>Led, Managed, Directed</li>
  <li>Developed, Created, Designed</li>
  <li>Increased, Improved, Enhanced</li>
  <li>Analyzed, Assessed, Evaluated</li>
</ul>

<h3>Tailoring Your Resume</h3>
<p>Generic resumes rarely succeed. Research the company and position, then customize your resume to highlight relevant skills and experiences that align with the job description.</p>

<h2>Modern Resume Best Practices</h2>

<h3>ATS Optimization</h3>
<p>Most companies use Applicant Tracking Systems (ATS) to screen resumes. Ensure your resume:</p>
<ul>
  <li>Uses standard section headings</li>
  <li>Includes relevant keywords from the job description</li>
  <li>Avoids complex formatting, tables, or graphics</li>
  <li>Uses standard fonts like Arial, Calibri, or Times New Roman</li>
</ul>

<h3>Digital Presence Integration</h3>
<p>Include links to:</p>
<ul>
  <li>Professional LinkedIn profile</li>
  <li>GitHub repository (for technical roles)</li>
  <li>Online portfolio or personal website</li>
  <li>Published articles or blog posts</li>
</ul>

<h3>Visual Design</h3>
<p>While content is king, presentation matters:</p>
<ul>
  <li>Use consistent formatting and spacing</li>
  <li>Choose a professional color scheme (if using color)</li>
  <li>Maintain adequate white space for readability</li>
  <li>Use bullet points for easy scanning</li>
</ul>

<h2>Common Mistakes to Avoid</h2>

<h3>The Don'ts of Resume Writing</h3>
<ol>
  <li><strong>Including Irrelevant Information</strong>: Focus on experiences relevant to your target role</li>
  <li><strong>Typos and Grammatical Errors</strong>: Proofread multiple times and use tools like Grammarly</li>
  <li><strong>Unexplained Employment Gaps</strong>: Address gaps briefly and positively</li>
  <li><strong>Using Personal Pronouns</strong>: Write in first person without using "I," "me," or "my"</li>
  <li><strong>Listing Duties Instead of Achievements</strong>: Show impact, not just responsibilities</li>
</ol>

<h2>Leveraging ResumeSpyWeb Features</h2>
<p>ResumeSpyWeb offers powerful tools to streamline your resume creation:</p>
<ul>
  <li><strong>Version Control</strong>: Maintain different versions for various job applications</li>
  <li><strong>Multi-Language Support</strong>: Create resumes in multiple languages effortlessly</li>
  <li><strong>GitHub Integration</strong>: Automatically populate your resume with project achievements</li>
  <li><strong>Template Library</strong>: Choose from professionally designed templates</li>
</ul>

<h2>Conclusion</h2>
<p>Crafting an exceptional resume requires attention to detail, strategic thinking, and continuous refinement. By following these best practices and leveraging modern tools like ResumeSpyWeb, you can create a resume that not only passes ATS screening but also captures the attention of hiring managers.</p>
<p>Remember, your resume is a living document. Regularly update it with new achievements, skills, and experiences to ensure you're always ready for your next career opportunity.</p>
`,
      zh: `
<h1>掌握简历写作：${year}年最佳实践</h1>

<h2>简介</h2>
<p>在当今竞争激烈的就业市场中，您的简历往往是给潜在雇主留下持久印象的第一次——有时也是唯一的一次——机会。随着我们进入${year}年，简历写作的艺术和科学继续演变，受到技术进步、工作场所动态变化和招聘人员期望转变的影响。</p>

<h2>基础：了解简历基础知识</h2>

<h3>清晰的结构和格式</h3>
<p>结构良好的简历遵循逻辑流程，引导招聘人员了解您的职业旅程。标准部分包括：</p>
<ul>
  <li><strong>联系信息</strong>：专业电子邮件、电话号码和LinkedIn个人资料</li>
  <li><strong>专业摘要</strong>：关于您专业知识的引人注目的2-3句概述</li>
  <li><strong>工作经验</strong>：按倒序时间顺序列出</li>
  <li><strong>教育背景</strong>：学位、证书和相关课程</li>
  <li><strong>技能</strong>：与目标职位相关的技术和软技能</li>
</ul>

<h3>长度很重要</h3>
<p>对于大多数专业人士，一页简历对于拥有少于10年经验的人来说是理想的。高级专业人员可能扩展到两页，但每一行都必须增加价值。</p>

<h2>内容策略：包括什么</h2>

<h3>可量化的成就</h3>
<p>数字比文字更有说服力。不要说"提高了团队生产力"，而要写"通过实施敏捷方法将团队生产力提高了35%"。</p>

<h3>行动导向的语言</h3>
<p>以强有力的动词开始要点：</p>
<ul>
  <li>领导、管理、指导</li>
  <li>开发、创建、设计</li>
  <li>增加、改进、增强</li>
  <li>分析、评估、评价</li>
</ul>

<h2>现代简历最佳实践</h2>

<h3>ATS优化</h3>
<p>大多数公司使用申请人跟踪系统（ATS）筛选简历。确保您的简历：</p>
<ul>
  <li>使用标准部分标题</li>
  <li>包含职位描述中的相关关键词</li>
  <li>避免复杂的格式、表格或图形</li>
  <li>使用Arial、Calibri或Times New Roman等标准字体</li>
</ul>

<h2>利用ResumeSpyWeb功能</h2>
<p>ResumeSpyWeb提供强大的工具来简化您的简历创建：</p>
<ul>
  <li><strong>版本控制</strong>：为各种求职申请维护不同版本</li>
  <li><strong>多语言支持</strong>：轻松创建多种语言的简历</li>
  <li><strong>GitHub集成</strong>：自动填充项目成就</li>
  <li><strong>模板库</strong>：从专业设计的模板中选择</li>
</ul>

<h2>结论</h2>
<p>制作出色的简历需要注重细节、战略思考和持续完善。通过遵循这些最佳实践并利用ResumeSpyWeb等现代工具，您可以创建一份不仅通过ATS筛选而且还能吸引招聘经理注意的简历。</p>
`,
      ja: `
<h1>履歴書作成の習得：${year}年のベストプラクティス</h1>

<h2>はじめに</h2>
<p>今日の競争の激しい就職市場において、履歴書は潜在的な雇用主に永続的な印象を与える最初の、そして時には唯一のチャンスとなることがよくあります。${year}年に向けて、履歴書作成の技術と科学は、技術の進歩、職場のダイナミクスの変化、採用担当者の期待の変化に影響を受けながら進化し続けています。</p>

<h2>基礎：履歴書の基本を理解する</h2>

<h3>明確な構造とフォーマット</h3>
<p>よく構造化された履歴書は、採用担当者をあなたのプロフェッショナルな旅に導く論理的な流れに従います。標準的なセクションには以下が含まれます：</p>
<ul>
  <li><strong>連絡先情報</strong>：プロフェッショナルなメール、電話番号、LinkedInプロフィール</li>
  <li><strong>プロフェッショナルサマリー</strong>：専門知識の説得力のある2-3文の概要</li>
  <li><strong>職歴</strong>：逆時系列でリスト</li>
  <li><strong>学歴</strong>：学位、資格、関連コースワーク</li>
  <li><strong>スキル</strong>：ターゲット役割に関連する技術的およびソフトスキル</li>
</ul>

<h3>長さは重要</h3>
<p>ほとんどの専門家にとって、10年未満の経験を持つ人には1ページの履歴書が理想的です。シニア専門家は2ページに拡張できますが、すべての行が価値を追加する必要があります。</p>

<h2>コンテンツ戦略：含めるべきもの</h2>

<h3>定量化可能な成果</h3>
<p>数字は言葉よりも雄弁です。「チームの生産性を向上させた」と言うのではなく、「アジャイル手法の実装によりチームの生産性を35%向上させた」と書きましょう。</p>

<h2>現代の履歴書のベストプラクティス</h2>

<h3>ATS最適化</h3>
<p>ほとんどの企業は、応募者追跡システム（ATS）を使用して履歴書をスクリーニングします。履歴書が以下を確認してください：</p>
<ul>
  <li>標準的なセクション見出しを使用する</li>
  <li>求人票から関連キーワードを含む</li>
  <li>複雑なフォーマット、表、グラフィックを避ける</li>
  <li>Arial、Calibri、Times New Romanなどの標準フォントを使用する</li>
</ul>

<h2>ResumeSpyWeb機能の活用</h2>
<p>ResumeSpyWebは、履歴書作成を効率化する強力なツールを提供します：</p>
<ul>
  <li><strong>バージョン管理</strong>：さまざまな求人応募用に異なるバージョンを維持</li>
  <li><strong>多言語サポート</strong>：複数の言語で簡単に履歴書を作成</li>
  <li><strong>GitHub統合</strong>：プロジェクトの成果で自動的に履歴書を入力</li>
  <li><strong>テンプレートライブラリ</strong>：プロフェッショナルにデザインされたテンプレートから選択</li>
</ul>

<h2>結論</h2>
<p>優れた履歴書を作成するには、細部への注意、戦略的思考、継続的な改善が必要です。これらのベストプラクティスに従い、ResumeSpyWebのような最新のツールを活用することで、ATSスクリーニングを通過するだけでなく、採用マネージャーの注意も引く履歴書を作成できます。</p>
`,
    },
    'resume-optimization-seo-for-your-career': {
      en: `
<h1>Resume Optimization: SEO for Your Career</h1>

<h2>Understanding the ATS Challenge</h2>
<p>In the digital age, your resume must first impress a machine before it reaches human eyes. Applicant Tracking Systems (ATS) are sophisticated software programs that scan, parse, and rank resumes based on specific criteria. Understanding how these systems work is crucial for job search success.</p>

<h2>How ATS Works</h2>

<h3>Parsing and Extraction</h3>
<p>ATS software:</p>
<ol>
  <li>Scans your resume document</li>
  <li>Extracts relevant information into structured data fields</li>
  <li>Compares your qualifications against job requirements</li>
  <li>Assigns a match score or ranking</li>
  <li>Presents top-scoring resumes to recruiters</li>
</ol>

<h3>Common ATS Pitfalls</h3>
<p>Many well-qualified candidates are filtered out due to:</p>
<ul>
  <li>Non-standard formatting</li>
  <li>Missing keywords</li>
  <li>Incompatible file formats</li>
  <li>Complex design elements</li>
  <li>Headers and footers with critical information</li>
</ul>

<h2>Keyword Strategy</h2>

<h3>Identifying the Right Keywords</h3>

<p><strong>Job Description Analysis</strong></p>
<ul>
  <li>Highlight repeated terms and phrases</li>
  <li>Note required vs. preferred qualifications</li>
  <li>Identify technical skills and certifications</li>
  <li>Pay attention to industry-specific terminology</li>
</ul>

<p><strong>Categories of Keywords</strong></p>
<ol>
  <li><strong>Hard Skills</strong>: Programming languages, software proficiency, technical abilities</li>
  <li><strong>Soft Skills</strong>: Leadership, communication, problem-solving</li>
  <li><strong>Industry Terms</strong>: Specialized vocabulary specific to your field</li>
  <li><strong>Job Titles</strong>: Current and target positions</li>
  <li><strong>Credentials</strong>: Certifications, degrees, licenses</li>
</ol>

<h3>Strategic Keyword Placement</h3>
<ul>
  <li><strong>Professional Summary</strong>: Include 3-5 key terms</li>
  <li><strong>Skills Section</strong>: List both acronyms and full terms (e.g., "SEO (Search Engine Optimization)")</li>
  <li><strong>Work Experience</strong>: Integrate keywords naturally within achievement descriptions</li>
  <li><strong>Education</strong>: Include relevant coursework and certifications</li>
</ul>

<h2>Formatting for ATS Success</h2>

<h3>Document Structure</h3>

<p><strong>Use Standard Section Headings</strong></p>
<ul>
  <li>Work Experience (not "Professional Journey")</li>
  <li>Education (not "Academic Background")</li>
  <li>Skills (not "Core Competencies")</li>
</ul>

<p><strong>Formatting Guidelines</strong></p>
<ul>
  <li>Simple, clean layout</li>
  <li>Standard fonts (Arial, Calibri, Georgia, Times New Roman)</li>
  <li>Font size: 10-12 points</li>
  <li>Avoid text boxes, tables, and columns</li>
  <li>No headers or footers with essential information</li>
  <li>Use standard bullet points (•, ◦)</li>
</ul>

<h3>File Format Considerations</h3>

<p><strong>Best Formats</strong></p>
<ol>
  <li><strong>.docx</strong> - Most compatible with modern ATS</li>
  <li><strong>.pdf</strong> - Acceptable for most systems, ensure it's text-based</li>
</ol>

<p><strong>Avoid</strong></p>
<ul>
  <li>.jpg or .png (image files)</li>
  <li>Complex PDFs created from design software</li>
  <li>.pages (Mac-specific format)</li>
</ul>

<h2>Content Optimization Strategies</h2>

<h3>Mirror Job Description Language</h3>
<p>If the job posting says "project management," use that exact phrase rather than "project coordination" or "managing projects."</p>

<h3>Quantify Everything Possible</h3>
<ul>
  <li>"Managed budget of $2M+"</li>
  <li>"Increased sales by 45%"</li>
  <li>"Led team of 12 developers"</li>
  <li>"Reduced processing time by 30%"</li>
</ul>

<h3>Include Variations</h3>
<p>List skills with common variations:</p>
<ul>
  <li>Search Engine Optimization (SEO)</li>
  <li>Customer Relationship Management (CRM)</li>
  <li>JavaScript (JS)</li>
</ul>

<h2>Testing Your ATS Compatibility</h2>

<h3>DIY Tests</h3>
<ol>
  <li><strong>Copy-Paste Test</strong>: Copy your resume into plain text to see if formatting is preserved</li>
  <li><strong>Upload to Job Boards</strong>: Test how your resume displays on LinkedIn, Indeed</li>
  <li><strong>Use ATS Checkers</strong>: Free online tools like Jobscan can analyze your resume</li>
</ol>

<h3>ResumeSpyWeb ATS Optimization</h3>
<p>ResumeSpyWeb automatically:</p>
<ul>
  <li>Formats your resume for ATS compatibility</li>
  <li>Suggests relevant keywords based on your target role</li>
  <li>Validates formatting against ATS best practices</li>
  <li>Generates ATS-friendly PDF exports</li>
</ul>

<h2>Balancing ATS and Human Readers</h2>

<h3>The Dual-Audience Challenge</h3>
<p>Your resume must:</p>
<ol>
  <li>Pass ATS filters (keyword matching, parsing)</li>
  <li>Engage human recruiters (compelling narrative, visual appeal)</li>
</ol>

<h3>Strategies for Both Audiences</h3>

<p><strong>For ATS</strong></p>
<ul>
  <li>Include keywords naturally throughout</li>
  <li>Use standard formatting and section titles</li>
  <li>List skills explicitly in a dedicated section</li>
</ul>

<p><strong>For Humans</strong></p>
<ul>
  <li>Tell a cohesive career story</li>
  <li>Use active language and strong verbs</li>
  <li>Highlight achievements with specific examples</li>
  <li>Maintain visual hierarchy and readability</li>
</ul>

<h2>Advanced ATS Optimization</h2>

<h3>Skills Section Strategy</h3>
<p>Create a comprehensive skills section that includes:</p>
<ul>
  <li>Technical proficiencies</li>
  <li>Software and tools</li>
  <li>Languages (programming and spoken)</li>
  <li>Certifications</li>
  <li>Industry knowledge</li>
</ul>

<h3>Context-Rich Descriptions</h3>
<p>Instead of simply listing keywords, embed them in context:</p>

<p><strong>Weak</strong>: "Experienced in Python, Django, PostgreSQL"</p>

<p><strong>Strong</strong>: "Developed scalable web applications using Python and Django framework, implementing PostgreSQL databases that supported 100,000+ concurrent users"</p>

<h2>Common ATS Optimization Mistakes</h2>

<h3>Mistakes to Avoid</h3>
<ol>
  <li><strong>Keyword Stuffing</strong>: Unnaturally forcing keywords damages readability</li>
  <li><strong>Ignoring Synonyms</strong>: Use variations of key terms</li>
  <li><strong>Overcomplicating Design</strong>: Fancy graphics confuse ATS</li>
  <li><strong>Omitting Standard Sections</strong>: Always include work experience and education</li>
  <li><strong>Using Graphics for Text</strong>: ATS can't read text embedded in images</li>
</ol>

<h2>Staying Current with ATS Technology</h2>
<p>ATS systems continuously evolve. Stay informed about:</p>
<ul>
  <li>New parsing capabilities</li>
  <li>Industry-standard keywords</li>
  <li>Emerging resume trends</li>
  <li>Platform-specific requirements</li>
</ul>

<h2>Conclusion</h2>
<p>Optimizing your resume for ATS is not about gaming the system—it's about ensuring your qualifications are accurately represented and easily discoverable. By understanding ATS functionality and implementing these strategies, you can increase your chances of reaching human reviewers while maintaining a compelling, readable resume.</p>
<p>ResumeSpyWeb's intelligent optimization tools help you navigate the ATS challenge, ensuring your resume performs well in both automated screening and human evaluation. Start optimizing your resume today to unlock more career opportunities.</p>
`,
      zh: `
<h1>简历优化：职业生涯的SEO</h1>

<h2>理解ATS挑战</h2>
<p>在数字时代，您的简历必须首先打动机器，然后才能到达人眼。申请人跟踪系统（ATS）是复杂的软件程序，可根据特定标准扫描、解析和排名简历。了解这些系统的工作原理对于求职成功至关重要。</p>

<h2>ATS如何工作</h2>

<h3>解析和提取</h3>
<p>ATS软件：</p>
<ol>
  <li>扫描您的简历文档</li>
  <li>将相关信息提取到结构化数据字段</li>
  <li>将您的资格与职位要求进行比较</li>
  <li>分配匹配分数或排名</li>
  <li>向招聘人员展示得分最高的简历</li>
</ol>

<h2>关键词策略</h2>

<h3>识别正确的关键词</h3>

<p><strong>职位描述分析</strong></p>
<ul>
  <li>突出显示重复的术语和短语</li>
  <li>注意必需与首选资格</li>
  <li>识别技术技能和认证</li>
  <li>注意行业特定术语</li>
</ul>

<h2>针对ATS成功的格式化</h2>

<h3>文档结构</h3>

<p><strong>使用标准部分标题</strong></p>
<ul>
  <li>工作经验（不是"职业旅程"）</li>
  <li>教育（不是"学术背景"）</li>
  <li>技能（不是"核心能力"）</li>
</ul>

<h2>ResumeSpyWeb ATS优化</h2>
<p>ResumeSpyWeb自动：</p>
<ul>
  <li>为ATS兼容性格式化您的简历</li>
  <li>根据您的目标角色建议相关关键词</li>
  <li>根据ATS最佳实践验证格式</li>
  <li>生成ATS友好的PDF导出</li>
</ul>

<h2>结论</h2>
<p>为ATS优化简历不是要欺骗系统——而是要确保您的资格得到准确表示并易于发现。通过理解ATS功能并实施这些策略，您可以增加到达人工审核人员的机会，同时保持引人注目、可读的简历。</p>
`,
      ja: `
<h1>履歴書の最適化：キャリアのためのSEO</h1>

<h2>ATSチャレンジの理解</h2>
<p>デジタル時代において、あなたの履歴書はまず機械を感動させ、その後人間の目に届く必要があります。応募者追跡システム（ATS）は、特定の基準に基づいて履歴書をスキャン、解析、ランク付けする洗練されたソフトウェアプログラムです。これらのシステムがどのように機能するかを理解することは、求職成功にとって重要です。</p>

<h2>ATSの仕組み</h2>

<h3>解析と抽出</h3>
<p>ATSソフトウェア：</p>
<ol>
  <li>履歴書文書をスキャン</li>
  <li>関連情報を構造化データフィールドに抽出</li>
  <li>資格を職務要件と比較</li>
  <li>マッチスコアまたはランキングを割り当て</li>
  <li>トップスコアの履歴書を採用担当者に提示</li>
</ol>

<h2>キーワード戦略</h2>

<h3>正しいキーワードの特定</h3>

<p><strong>求人票の分析</strong></p>
<ul>
  <li>繰り返される用語やフレーズを強調</li>
  <li>必須と優先資格を記録</li>
  <li>技術スキルと認定を特定</li>
  <li>業界固有の用語に注意を払う</li>
</ul>

<h2>ATS成功のためのフォーマット</h2>

<h3>文書構造</h3>

<p><strong>標準セクション見出しを使用</strong></p>
<ul>
  <li>職歴（「プロフェッショナルジャーニー」ではなく）</li>
  <li>学歴（「学術的背景」ではなく）</li>
  <li>スキル（「コアコンピテンシー」ではなく）</li>
</ul>

<h2>ResumeSpyWeb ATS最適化</h2>
<p>ResumeSpyWebは自動的に：</p>
<ul>
  <li>ATS互換性のために履歴書をフォーマット</li>
  <li>ターゲット役割に基づいて関連キーワードを提案</li>
  <li>ATSベストプラクティスに対してフォーマットを検証</li>
  <li>ATS対応PDFエクスポートを生成</li>
</ul>

<h2>結論</h2>
<p>ATS用に履歴書を最適化することは、システムを出し抜くことではありません——資格が正確に表現され、簡単に発見できるようにすることです。ATS機能を理解し、これらの戦略を実装することで、説得力があり読みやすい履歴書を維持しながら、人間のレビュアーに到達する可能性を高めることができます。</p>
`,
    },
    // Add remaining article slugs with condensed content...
    'showcasing-language-skills-on-resume': {
      en: `
<h1>How to List Language Skills on Your Resume (CEFR Guide)</h1>

<p>Language skills can be the deciding factor between two equally qualified candidates. In a global hiring market, hiring managers actively scan resumes for multilingual ability — yet most candidates either omit their language skills entirely or describe them so vaguely that the information is useless.</p>

<p>This guide shows you how to present language proficiency accurately, credibly, and in a way that directly serves your job search.</p>

<h2>Why Language Skills Matter More Than Ever</h2>

<p>Cross-border teams, international clients, and remote-first companies have made language ability a practical requirement rather than a nice-to-have. Even roles that appear fully domestic often involve documentation, tooling, or colleagues in other languages.</p>

<p>Listing your language skills correctly signals not just ability but professionalism — it tells recruiters you understand global standards.</p>

<h2>The CEFR Framework: The Global Standard</h2>

<p>The Common European Framework of Reference for Languages (CEFR) is the most widely recognized proficiency scale. It has six levels:</p>

<ul>
  <li><strong>A1 – Beginner:</strong> Can understand and use basic phrases</li>
  <li><strong>A2 – Elementary:</strong> Can communicate in simple, routine tasks</li>
  <li><strong>B1 – Intermediate:</strong> Can handle most travel and everyday situations</li>
  <li><strong>B2 – Upper Intermediate:</strong> Can interact fluently with native speakers</li>
  <li><strong>C1 – Advanced:</strong> Can express ideas fluently and spontaneously</li>
  <li><strong>C2 – Proficient:</strong> Can understand virtually everything heard or read</li>
</ul>

<p>When in doubt, map your self-assessment to CEFR. It removes ambiguity and gives hiring managers an immediate, calibrated picture of your ability.</p>

<h2>Recognized Certifications by Language</h2>

<p>Certifications lend objective credibility to your claimed proficiency. Include the score or level alongside the certification name:</p>

<ul>
  <li><strong>English:</strong> TOEFL (score/120), IELTS (band score), Cambridge C1/C2, TOEIC (score/990)</li>
  <li><strong>French:</strong> DELF/DALF (A1–C2), TCF</li>
  <li><strong>German:</strong> Goethe-Zertifikat (A1–C2), TestDaF</li>
  <li><strong>Japanese:</strong> JLPT (N5–N1), BJT Business Japanese</li>
  <li><strong>Chinese:</strong> HSK (Level 1–6), HSKK</li>
  <li><strong>Spanish:</strong> DELE (A1–C2), SIELE</li>
  <li><strong>Korean:</strong> TOPIK (Level 1–6)</li>
</ul>

<h2>Where to Place Language Skills on Your Resume</h2>

<p>For most candidates, language skills belong in one of two places:</p>

<ol>
  <li><strong>Within a "Skills" section</strong> — works well when you have one or two additional languages alongside technical skills</li>
  <li><strong>A dedicated "Languages" section</strong> — appropriate when you speak three or more languages or when language ability is central to the role</li>
</ol>

<p>Never bury language skills in a dense paragraph. List each language on its own line with its proficiency level clearly stated.</p>

<h2>Formatting Examples That Work</h2>

<p>Clear, scannable formatting matters. Here are two proven formats:</p>

<p><strong>Format 1 — Certification-backed:</strong></p>
<ul>
  <li>English — C1 Advanced (IELTS 7.5, 2023)</li>
  <li>Japanese — N2 (JLPT, 2022)</li>
  <li>French — B1 (DELF, 2021)</li>
</ul>

<p><strong>Format 2 — Self-assessed with context:</strong></p>
<ul>
  <li>English — Full professional proficiency (5 years in international team)</li>
  <li>Mandarin — Conversational (lived in Shanghai, 2019–2021)</li>
  <li>Spanish — Elementary (A2)</li>
</ul>

<h2>Mistakes That Undermine Your Credibility</h2>

<p>Avoid these common errors:</p>

<ul>
  <li><strong>Overrating yourself:</strong> Claiming "fluent" when you mean "conversational" is a red flag that surfaces immediately in interviews</li>
  <li><strong>Using vague terms alone:</strong> "Basic," "conversational," and "working knowledge" mean different things to different people — always pair them with CEFR or a certification</li>
  <li><strong>Listing your native language without context:</strong> Native speakers don't need to list their native language unless they hold formal literacy credentials relevant to the role</li>
  <li><strong>Omitting proficiency entirely:</strong> "Speaks French" tells a recruiter nothing actionable</li>
</ul>

<h2>Multilingual Resumes: Going Further</h2>

<p>If you're applying to international roles, consider maintaining separate resume versions in each language you speak professionally. A Japanese-language resume for Japanese companies demonstrates fluency far more convincingly than a claim on an English resume.</p>

<p>ResumeSpy is built for exactly this: you can create and manage language-specific resume versions from a single dashboard, ensuring each version is tailored to the cultural and professional norms of its target market.</p>

<h2>Key Takeaways</h2>

<ul>
  <li>Use CEFR levels (A1–C2) as your standard proficiency scale</li>
  <li>Back claims with certifications and scores wherever possible</li>
  <li>Create a dedicated Languages section if language is central to the role</li>
  <li>Never overstate — interviewers will find out immediately</li>
  <li>For serious multilingual job searches, maintain a separate resume in each target language</li>
</ul>
`,
      zh: `
<h1>如何在简历中专业展示语言能力</h1>

<p>语言能力可以成为两位同等资历候选人之间的决定性因素。在全球化招聘市场中，招聘官会主动扫描简历寻找多语言能力——然而大多数候选人要么完全省略语言技能，要么描述得过于模糊，使这部分信息毫无实际意义。</p>

<p>本文将告诉你如何准确、可信地展示语言能力，并让它真正服务于你的求职目标。</p>

<h2>中国求职市场的语言能力需求</h2>

<p>随着外资企业持续进入中国市场，以及中国企业加速出海，语言能力已成为许多岗位的硬性要求。常见需求包括：</p>

<ul>
  <li><strong>外资企业：</strong>商务英语读写流利，部分岗位要求日语或韩语</li>
  <li><strong>出海业务团队：</strong>英语或目标市场语言的实际工作能力</li>
  <li><strong>国内互联网大厂：</strong>英语文档阅读能力（技术岗位尤为重要）</li>
  <li><strong>学术与研究机构：</strong>英语论文写作与发表能力</li>
</ul>

<h2>主流语言证书参考</h2>

<p>证书赋予语言能力客观可信度。在简历中注明证书名称与分数/级别：</p>

<ul>
  <li><strong>英语：</strong>雅思（托福）分数、CET-4/CET-6（425分以上有参考价值）、TOEIC（职场英语）</li>
  <li><strong>日语：</strong>JLPT N1–N5（N2及以上对大多数商务岗位有效）、BJT商务日语</li>
  <li><strong>韩语：</strong>TOPIK 1–6级</li>
  <li><strong>德法西语：</strong>Goethe-Zertifikat / DELF / DELE（A1–C2）</li>
</ul>

<h2>语言能力怎么写才专业</h2>

<p>推荐两种格式：</p>

<p><strong>有证书时：</strong></p>
<ul>
  <li>英语 — 雅思7.0（2023年）/ CET-6（568分）</li>
  <li>日语 — JLPT N2（2022年）</li>
</ul>

<p><strong>无证书时，结合实际经验描述：</strong></p>
<ul>
  <li>英语 — 商务工作语言，可独立撰写英文报告及主持会议</li>
  <li>日语 — 日常沟通（在日资企业工作3年）</li>
</ul>

<h2>常见错误</h2>

<ul>
  <li><strong>夸大水平：</strong>写"流利"但在面试中词不达意，会立刻引发信任危机</li>
  <li><strong>只写"会一点"：</strong>模糊描述对招聘官毫无参考价值</li>
  <li><strong>CET-4分数过低：</strong>低于425分建议只写"通过"或不写分数</li>
  <li><strong>遗漏母语以外的强项：</strong>方言或地区语言在某些岗位（如港台业务、东南亚市场）可能是加分项</li>
</ul>

<h2>多语言简历策略</h2>

<p>如果目标岗位在外资公司或海外团队，建议为每种工作语言分别准备一份简历。日文简历投递日企、英文简历投递外资，比在中文简历上注明语言能力更有说服力。</p>

<p>使用ResumeSpy，你可以在同一平台上管理多语言简历版本，确保每个版本都符合目标市场的职场文化与规范。</p>
`,
      ja: `
<h1>履歴書の語学力・TOEICスコアの正しい書き方</h1>

<p>語学力は、同等のスキルを持つ候補者の間で決定的な差をつける要素です。グローバル採用が加速する中、採用担当者は履歴書で語学力を積極的にチェックしています。しかし多くの候補者が語学力を曖昧に記載し、せっかくのアピールポイントを活かせていません。</p>

<p>このガイドでは、語学力を正確・客観的・効果的に伝える方法を解説します。</p>

<h2>日本の採用市場における語学力の位置づけ</h2>

<p>日本企業の採用において、語学力の評価基準は企業タイプによって大きく異なります：</p>

<ul>
  <li><strong>日系大企業：</strong>TOEICスコアを数値で評価。700点以上が一つの基準</li>
  <li><strong>外資系企業：</strong>実際のビジネスでの使用経験を重視。英語面接が実施される場合も</li>
  <li><strong>スタートアップ：</strong>英語のドキュメント読解力、Slackでの英語コミュニケーション能力</li>
  <li><strong>グローバル展開企業：</strong>現地語（中国語・韓国語・東南アジア語等）話者を積極採用</li>
</ul>

<h2>主な語学資格と記載方法</h2>

<ul>
  <li><strong>英語：</strong>TOEIC L&R（スコア/990）、TOEFL iBT（スコア/120）、英検（準1級・1級）、IELTS（バンドスコア）</li>
  <li><strong>中国語：</strong>HSK（1〜6級）、HSKK</li>
  <li><strong>韓国語：</strong>TOPIK（1〜6級）</li>
  <li><strong>ドイツ語・フランス語：</strong>Goethe-Zertifikat / DELF（A1〜C2）</li>
  <li><strong>日本語（外国人向け）：</strong>JLPT（N5〜N1）、BJT ビジネス日本語テスト</li>
</ul>

<h2>避けるべき曖昧な表現</h2>

<p>日本の履歴書でよく見られる問題のある記載：</p>

<ul>
  <li><strong>「ビジネスレベル」：</strong>人によって意味が全く異なる。TOEIC800点以上であれば具体的なスコアを記載する</li>
  <li><strong>「日常会話レベル」：</strong>ビジネスでの使用可否が不明。「旅行・観光レベル（A2相当）」のように補足する</li>
  <li><strong>「読み書きのみ可能」：</strong>有益な情報だが、どの程度の文書かを明記する</li>
</ul>

<h2>効果的な記載例</h2>

<p><strong>資格あり：</strong></p>
<ul>
  <li>英語：TOEIC L&R 860点（2023年取得）／ビジネスメール・会議対応可</li>
  <li>中国語：HSK5級（2022年取得）／上海勤務3年の実務経験</li>
</ul>

<p><strong>資格なし・実務経験で補足：</strong></p>
<ul>
  <li>英語：英語のみの環境でのリモートチーム業務経験2年（米国本社とのやり取りを含む）</li>
</ul>

<h2>外資系企業向けのアドバイス</h2>

<p>外資系企業に応募する場合は、英語版の職務経歴書を別途用意することを強くお勧めします。日本語の書類に「英語上級」と記載するより、英語で書かれた書類そのものが語学力の証明になります。</p>

<p>ResumeSpy では日本語・英語・中国語など複数言語の職務経歴書を一つのダッシュボードで管理できます。応募先に合わせて最適な言語版を使い分けることで、語学力を最も効果的にアピールできます。</p>
`,
    },
    'version-control-for-your-resume': {
      en: `
<h1>Resume Version Control: Manage Multiple Versions Like a Pro</h1>

<p>Most job seekers maintain exactly one resume. They update it when they find a new job, tweak the dates, maybe swap a bullet point, and fire it off to every position they apply for. This approach is comfortable — and it quietly costs you interviews.</p>

<p>Resume version control is the discipline of treating your resume the way software engineers treat code: as a living document with deliberate, tracked variations optimized for specific targets.</p>

<h2>Why One Resume Fails</h2>

<p>Hiring managers and ATS systems both reward specificity. A resume that speaks directly to a job description — using its exact language, emphasizing the right skills, and leading with the most relevant experience — consistently outperforms a generic document.</p>

<p>Consider two candidates with identical experience applying to a data engineering role. Candidate A submits a general "Software Engineer" resume. Candidate B submits a version that leads with pipeline architecture, mentions the same tech stack named in the job posting, and frames every achievement around data scale. Candidate B gets the callback.</p>

<h2>The Master Resume: Your Single Source of Truth</h2>

<p>Version control starts with a master resume — an exhaustive document that contains everything you've ever done professionally:</p>

<ul>
  <li>Every role, with full bullet points for each responsibility and achievement</li>
  <li>Every technology, tool, and platform you've worked with</li>
  <li>Every certification, publication, side project, and open-source contribution</li>
  <li>Multiple versions of your professional summary for different role types</li>
</ul>

<p>Your master resume is never submitted directly. It's too long and unfocused. Its purpose is to be the reservoir from which you draw when building targeted versions.</p>

<h2>Deriving Targeted Versions</h2>

<p>For each application, create a targeted version by selecting and adapting content from your master:</p>

<ol>
  <li><strong>Read the job description carefully.</strong> Highlight required skills, preferred qualifications, and the exact language used to describe the role.</li>
  <li><strong>Match your summary.</strong> Rewrite the 2–3 sentence summary to mirror the role's language and priorities.</li>
  <li><strong>Reorder your skills.</strong> Lead with technologies and competencies the job description emphasizes.</li>
  <li><strong>Select and reorder bullet points.</strong> Surface the most relevant achievements for this role. Less relevant bullets move down or are cut entirely.</li>
  <li><strong>Mirror keywords naturally.</strong> If the job says "distributed systems," use that phrase — not "scalable architecture" — where accurate.</li>
</ol>

<h2>A Simple Version Naming Convention</h2>

<p>Without a consistent naming system, versions become chaos. A reliable convention:</p>

<ul>
  <li><code>resume-master.md</code> — the full source document</li>
  <li><code>resume-dataeng-stripe-2025-04.md</code> — company + role + date</li>
  <li><code>resume-pm-fintech-general-2025.md</code> — role type + industry + general target</li>
</ul>

<p>Always include the date. A resume from six months ago may have outdated framing even if the core content is the same.</p>

<h2>What Changes Between Versions</h2>

<p>Not everything needs to change for each application. Focus your edits on the highest-impact areas:</p>

<ul>
  <li><strong>Professional summary</strong> — always rewrite, 2–3 sentences</li>
  <li><strong>Skills section</strong> — reorder to lead with what the JD emphasizes</li>
  <li><strong>Top 3–4 bullet points per role</strong> — these carry the most weight</li>
  <li><strong>Job title phrasing</strong> — if your actual title was ambiguous, clarify it where accurate</li>
</ul>

<h2>When to Update Your Master Resume</h2>

<p>Add to your master resume immediately after any significant event:</p>

<ul>
  <li>Completing a project with measurable outcomes</li>
  <li>Earning a certification or completing a course</li>
  <li>Receiving a promotion or scope change</li>
  <li>Contributing to open source with meaningful results</li>
</ul>

<p>Updating in real time, while the details are fresh, is far easier than reconstructing months of work before a job search.</p>

<h2>Managing Versions with ResumeSpy</h2>

<p>ResumeSpy's version control system is built for exactly this workflow. Your master content lives in one place; targeted versions branch from it. You can compare versions, track which ones were submitted to which companies, and maintain language-specific variants for international applications — all without managing a folder of disconnected files.</p>
`,
      zh: `
<h1>简历版本管理：像产品经理一样迭代你的求职材料</h1>

<p>大多数求职者只维护一份简历。找到新机会时更新一下日期，调整一两个要点，然后向所有岗位投递同一份文件。这种做法省事——但它在悄悄地让你失去面试机会。</p>

<p>简历版本管理，是把简历当作代码来对待的方法：一份有意维护、针对不同目标进行差异化调整的活文档。</p>

<h2>为什么"一份简历走天下"会失败</h2>

<p>ATS系统和招聘官都会奖励针对性强的简历。一份使用岗位JD中相同关键词、突出相关技能、以最匹配的经历开头的简历，会稳定地胜过泛泛而谈的通用版本。</p>

<p>想象两位背景相同的候选人投递数据工程岗位：A投递通用"软件工程师"简历，B的简历开篇就讲数据管道架构，使用了与JD完全一致的技术栈名称，每条成就都聚焦数据规模。B会先接到电话。</p>

<h2>主简历：你的唯一事实来源</h2>

<p>版本管理从主简历开始——一份包含你所有职业经历的详尽文档：</p>

<ul>
  <li>每段工作经历的完整职责与成就描述</li>
  <li>你使用过的每种技术、工具和平台</li>
  <li>每个证书、论文、副业项目和开源贡献</li>
  <li>针对不同岗位类型的多个版本个人摘要</li>
</ul>

<p>主简历不直接投递——它太长、太全面。它的作用是成为你构建针对性版本时的"素材库"。</p>

<h2>针对不同场景派生版本</h2>

<p>中国职场有几种典型的简历差异化场景：</p>

<ul>
  <li><strong>互联网大厂：</strong>突出数据指标、增长结果、快速迭代经验</li>
  <li><strong>外资企业：</strong>强调英语能力、跨文化协作、国际化项目经验</li>
  <li><strong>国有企业：</strong>侧重稳定性、合规背景、政策理解与党建经历（如有）</li>
  <li><strong>创业公司：</strong>体现快速学习、独立负责、从0到1的经验</li>
</ul>

<h2>简历版本命名规范</h2>

<p>没有命名规范，版本管理很快会变成乱局。推荐格式：</p>

<ul>
  <li><code>简历-主版本.md</code> — 完整素材库</li>
  <li><code>简历-数据工程-字节-2025-04.md</code> — 岗位类型+公司+日期</li>
  <li><code>简历-产品经理-电商-通用-2025.md</code> — 岗位+行业+通用版</li>
</ul>

<h2>版本间什么内容需要修改</h2>

<ul>
  <li><strong>个人摘要（必改）：</strong>2-3句话，用JD的语言重写</li>
  <li><strong>技能栏顺序：</strong>把JD强调的技能排到最前面</li>
  <li><strong>每段经历前3条要点：</strong>替换为与目标岗位最相关的成就</li>
  <li><strong>项目经历筛选：</strong>删去不相关项目，突出匹配项</li>
</ul>

<h2>何时更新主简历</h2>

<p>趁记忆清晰，在以下事件发生后立即更新：</p>

<ul>
  <li>完成有可量化成果的项目</li>
  <li>获得认证或完成重要培训</li>
  <li>晋升或职责范围扩大</li>
  <li>开源项目有实质性贡献</li>
</ul>

<h2>用ResumeSpy管理版本</h2>

<p>ResumeSpy的版本管理功能正是为这套工作流设计的：主内容集中存储，针对性版本从主版本派生。你可以对比不同版本的差异，追踪哪个版本投递给了哪家公司，并为国际岗位维护多语言变体——无需管理一堆零散文件。</p>
`,
      ja: `
<h1>履歴書のバージョン管理術：複数の応募先に対応する転職戦略</h1>

<p>多くの転職者は一種類の履歴書しか持っていません。新しい求人を見つけたら日付を更新し、多少のアレンジをして同じ書類を送り続ける。この方法は楽ですが、知らないうちに書類選考の機会を失っています。</p>

<p>履歴書のバージョン管理とは、エンジニアがコードを管理するように履歴書を扱う方法です。つまり、特定のターゲットに最適化された、意図的かつ追跡可能なバリエーションを持つ「生きた書類」として管理することです。</p>

<h2>なぜ一つの履歴書では通用しないのか</h2>

<p>採用担当者もATSシステムも、具体性の高い書類を評価します。求人票の言葉を使い、必要なスキルを前面に出し、最も関連性の高い経験をリードする書類は、汎用的な書類を常に上回ります。</p>

<h2>マスター職務経歴書：唯一の情報源を作る</h2>

<p>バージョン管理はマスター職務経歴書から始まります。これはあなたが職業的に経験したすべてを網羅した詳細な文書です：</p>

<ul>
  <li>すべての職歴と、各役職での職責・実績の詳細な箇条書き</li>
  <li>使用したすべての技術・ツール・プラットフォーム</li>
  <li>取得した資格、執筆した記事、副業プロジェクト、OSS貢献</li>
  <li>職種タイプごとの複数パターンの自己PR文</li>
</ul>

<p>マスター職務経歴書は直接提出しません。長すぎて焦点が絞られていないためです。目的はターゲット別バージョン作成の「素材庫」となることです。</p>

<h2>日本市場でのバージョン差別化</h2>

<p>日本の転職市場特有の使い分けポイント：</p>

<ul>
  <li><strong>大企業向け：</strong>安定性・チームワーク・段階的な成長と実績を強調</li>
  <li><strong>スタートアップ向け：</strong>自律性・スピード感・ゼロからの立ち上げ経験を前面に</li>
  <li><strong>外資系向け：</strong>英語対応力・グローバルプロジェクト経験・成果の数値化を重視</li>
  <li><strong>エージェント経由：</strong>詳細な職責記載。直接応募より網羅的な内容が好まれる</li>
</ul>

<h2>バージョン間で変更すべき箇所</h2>

<ul>
  <li><strong>職務要約（必ず書き換える）：</strong>2〜3文で求人票の言葉を使って書き直す</li>
  <li><strong>スキルセクションの順序：</strong>求人票が重視するスキルを先頭に</li>
  <li><strong>各職歴の上位3〜4項目：</strong>最も関連性の高い実績に入れ替える</li>
  <li><strong>プロジェクト選択：</strong>無関係なプロジェクトを省き、マッチするものを前面へ</li>
</ul>

<h2>マスター職務経歴書の更新タイミング</h2>

<p>記憶が新鮮なうちに、以下の出来事の直後に更新しましょう：</p>

<ul>
  <li>数値で示せる成果が出たプロジェクトの完了時</li>
  <li>資格取得や重要な研修の修了時</li>
  <li>昇進や業務範囲の拡大時</li>
  <li>OSS貢献で意義ある成果を出した時</li>
</ul>

<h2>ResumeSpy でのバージョン管理</h2>

<p>ResumeSpy のバージョン管理機能はこのワークフローのために設計されています。マスターコンテンツを一元管理しながら、ターゲット別バージョンを派生させることができます。どの版をどの企業に提出したか追跡でき、国際応募向けの多言語バリアントも同じダッシュボードで管理できます。</p>
`,
    },
    'creating-job-specific-resumes-efficiently': {
      en: `
<h1>How to Tailor Your Resume for Every Job Without Starting Over</h1>

<p>Conventional wisdom says tailor your resume for every application. Practical reality says that tailoring is time-consuming enough that most people give up after a few attempts and revert to sending the same document everywhere.</p>

<p>The solution isn't to spend less time tailoring. It's to build a system that makes tailoring fast, consistent, and repeatable — so you can apply the same rigor to your fifteenth application as to your first.</p>

<h2>Why Generic Resumes Lose</h2>

<p>Recruiters typically spend six to ten seconds on an initial resume scan. In that window, they're pattern-matching: does this person's background map to what we need? A generic resume forces them to do that mapping work themselves. A tailored one does it for them.</p>

<p>ATS systems compound this. They score resumes against specific job descriptions. A resume that uses the exact language of the posting — the same job titles, the same technology names, the same skill vocabulary — scores higher before any human sees it.</p>

<h2>Step 1: Decode the Job Description</h2>

<p>Before touching your resume, spend ten minutes on the job posting:</p>

<ul>
  <li><strong>Required qualifications:</strong> These are non-negotiable. Every required item you satisfy must appear in your resume.</li>
  <li><strong>Preferred qualifications:</strong> Include these where accurate — they separate you from candidates who only meet the minimum bar.</li>
  <li><strong>Repeated phrases:</strong> If a skill or term appears more than once in the posting, the company considers it important. Use the same language.</li>
  <li><strong>Role-specific verbs:</strong> "Architect," "scale," "automate," "own" — the verbs a company uses reveal its culture. Mirror them in your bullet points.</li>
</ul>

<h2>Step 2: Rewrite Your Summary First</h2>

<p>The professional summary (2–3 sentences at the top) is the highest-leverage element to customize. It's the first thing read, and it sets the frame for everything that follows.</p>

<p>Write your summary to answer three questions the recruiter has when they open your resume:</p>

<ol>
  <li>What kind of professional is this person?</li>
  <li>Do they have the core experience this role requires?</li>
  <li>Why would they be good at this specific job?</li>
</ol>

<h2>Step 3: Reorder and Select Bullet Points</h2>

<p>You don't need to rewrite every bullet — you need to surface the right ones. For each role in your experience section:</p>

<ul>
  <li>Move the most relevant achievements to the top 3 positions</li>
  <li>Cut bullets that have no bearing on this specific role (you can restore them for other applications)</li>
  <li>Lightly rephrase 1–2 bullets to use the job description's exact terminology where accurate</li>
</ul>

<p>This process takes 10–15 minutes when you have a master resume to pull from. It cannot be rushed if you're writing from scratch each time.</p>

<h2>Step 4: Adjust Your Skills Section</h2>

<p>Reorder your skills to lead with what the job description prioritizes. If the posting lists Python, AWS, and Kubernetes in that order, those three should appear at the front of your technical skills list.</p>

<p>Add any skills from the job description that you genuinely have but haven't listed. Many candidates possess relevant skills they simply forgot to include.</p>

<h2>Step 5: Audit for Keyword Match</h2>

<p>Do a final pass specifically looking for language in the job description that hasn't appeared in your resume yet:</p>

<ul>
  <li>Job title variations (the company may say "Senior Engineer" while your history shows "Software Engineer III" — clarify where accurate)</li>
  <li>Industry-specific terminology you've replaced with synonyms</li>
  <li>Certification names or tool names the company uses</li>
</ul>

<h2>How Long Should This Take?</h2>

<p>With a well-maintained master resume and a clear system:</p>

<ul>
  <li><strong>Strong match (role you're well-suited for):</strong> 20–30 minutes</li>
  <li><strong>Moderate match (stretch role or new industry):</strong> 45–60 minutes</li>
  <li><strong>Weak match:</strong> reconsider whether to apply rather than spending hours forcing a fit</li>
</ul>

<h2>Using AI to Accelerate Tailoring</h2>

<p>ResumeSpy's AI tailoring feature automates the most mechanical parts of this process. Paste a job description, and the system identifies keyword gaps, suggests bullet point adjustments, and flags misaligned language — leaving you to review and approve changes rather than hunt for them manually.</p>

<p>The human judgment stays with you. The pattern-matching and first-pass editing happens in seconds.</p>

<h2>The Compound Effect</h2>

<p>A well-tailored resume doesn't just improve your odds for one application — it trains you to read job descriptions more precisely, articulate your experience more sharply, and identify which opportunities are genuinely worth pursuing. Over a job search, these skills compound.</p>
`,
      zh: `
<h1>高效定制简历：不从零开始的针对性投递策略</h1>

<p>大家都知道应该为每个岗位定制简历。但现实是，定制足够耗时，多数人尝试几次后就放弃了，又开始向所有岗位投递同一份文件。</p>

<p>解决方法不是减少定制工作，而是建立一套让定制变得快速、一致、可复制的系统——让你第十五次投递和第一次一样认真。</p>

<h2>为什么通用简历会失败</h2>

<p>招聘官初筛一份简历通常只用6-10秒。在这个窗口期内，他们在做模式匹配：这个人的背景是否符合我们的需求？通用简历让招聘官自己做这个对应工作，而定制简历帮他们完成了这一步。</p>

<p>ATS系统让问题更复杂——它们将简历与特定岗位描述进行评分比对。使用与招聘信息相同语言的简历会在人工筛选之前就获得更高分数。</p>

<h2>第一步：解码岗位JD</h2>

<p>动笔之前，花10分钟研究招聘信息：</p>

<ul>
  <li><strong>必要条件：</strong>你满足的每一项都必须出现在简历中</li>
  <li><strong>加分条件：</strong>准确满足时要写——这是拉开与最低门槛候选人差距的地方</li>
  <li><strong>重复出现的词汇：</strong>出现超过一次的技能或术语，公司认为重要，使用相同措辞</li>
  <li><strong>特定动词：</strong>"架构"、"规模化"、"自动化"——公司使用的动词透露其文化，在要点中映射这些词</li>
</ul>

<h2>第二步：先重写个人摘要</h2>

<p>个人摘要（开头2-3句话）是定制性价比最高的部分。它是第一个被阅读的内容，并为后续所有内容定下基调。</p>

<p>摘要要回答招聘官打开简历时的三个问题：</p>
<ol>
  <li>这个人是什么类型的专业人员？</li>
  <li>他们是否有这个岗位所需的核心经验？</li>
  <li>为什么他们会在这个具体职位上表现出色？</li>
</ol>

<h2>第三步：调整要点顺序与选取</h2>

<p>你不需要重写每条要点——你需要呈现正确的要点：</p>

<ul>
  <li>将最相关的成就移到每段经历的前3位</li>
  <li>删去与本岗位无关的要点（其他申请可以恢复）</li>
  <li>微调1-2条要点，使用招聘信息中的准确术语</li>
</ul>

<p>当你有主简历可供调取时，这个过程需要10-15分钟。每次从头写则不可能这么快。</p>

<h2>第四步：调整技能栏顺序</h2>

<p>按招聘信息的优先级重排技能。如果岗位将Python、AWS、Kubernetes按此顺序列出，这三项就应该出现在你技能列表的最前面。</p>

<h2>第五步：关键词匹配审查</h2>

<p>最后检查招聘信息中尚未出现在简历中的语言：</p>

<ul>
  <li>职位名称变体（公司可能写"高级工程师"，你的经历写的是"T7"或"P7"）</li>
  <li>你用同义词替换的行业术语</li>
  <li>公司使用的特定认证名称或工具名称</li>
</ul>

<h2>用AI加速定制</h2>

<p>ResumeSpy的AI定制功能自动处理这个过程中最机械的部分：粘贴职位描述，系统识别关键词差距、建议要点调整、标记不匹配的语言——让你审查和批准修改，而不是手动搜寻问题。</p>

<p>判断仍然由你来做，模式匹配和初步编辑在几秒内完成。</p>
`,
      ja: `
<h1>職種別履歴書の効率的な作り方：ゼロから始めない応募戦略</h1>

<p>応募ごとに書類をカスタマイズすべきというのは常識です。しかし現実には、カスタマイズは十分に時間がかかるため、多くの人が数回試みた後に諦め、同じ書類を全ての求人に送り続けます。</p>

<p>解決策はカスタマイズに費やす時間を減らすことではありません。カスタマイズを速く、一貫して、繰り返し実行できるシステムを作ることです。</p>

<h2>なぜ汎用書類は通らないのか</h2>

<p>採用担当者が最初の書類確認に費やす時間は通常6〜10秒です。この間に行うのはパターンマッチングです。カスタマイズされた書類はこのマッチング作業を代わりに行い、採用担当者の負担を減らします。</p>

<h2>ステップ1：求人票を解読する</h2>

<p>書類に手をつける前に、求人票を10分間分析します：</p>

<ul>
  <li><strong>必須要件：</strong>満たしているものはすべて書類に明示する</li>
  <li><strong>歓迎要件：</strong>該当する場合は積極的に記載 — 最低ラインの候補者との差別化ポイント</li>
  <li><strong>繰り返し登場するキーワード：</strong>複数回出てくるスキルは重要度が高い。同じ表現を使う</li>
  <li><strong>使われている動詞：</strong>「設計する」「構築する」「推進する」— 企業の文化が現れる動詞を書類に反映させる</li>
</ul>

<h2>ステップ2：職務要約から書き直す</h2>

<p>冒頭の自己PR文（2〜3文）はカスタマイズの投資対効果が最も高い部分です。採用担当者が最初に読む箇所であり、その後の印象を決定します。</p>

<p>採用担当者が書類を開いた時の3つの疑問に答える内容にしましょう：</p>
<ol>
  <li>この人はどのような専門家か？</li>
  <li>この職種に必要な核心的な経験があるか？</li>
  <li>なぜこのポジションに向いているのか？</li>
</ol>

<h2>ステップ3：箇条書きを選択・並び替える</h2>

<p>すべての箇条書きを書き直す必要はありません。適切なものを前面に出すことが重要です：</p>

<ul>
  <li>最も関連性の高い実績を各職歴の上位3位に移動</li>
  <li>この職種と無関係な箇条書きを削除（他の応募では復元可能）</li>
  <li>1〜2項目を求人票の正確な表現に合わせて微修正</li>
</ul>

<h2>ステップ4：スキルセクションを整える</h2>

<p>求人票が優先するスキルを先頭に並び替えます。求人票がPython、AWS、Kubernetesの順で記載していれば、その3つをスキルリストの先頭に。</p>

<h2>ステップ5：キーワードの最終チェック</h2>

<ul>
  <li>職種名の表記ゆれ（求人は「シニアエンジニア」、経歴書は「リードエンジニア」など）</li>
  <li>同義語に置き換えた業界用語</li>
  <li>企業が使用する特定ツール名や資格名</li>
</ul>

<h2>AI を活用した効率化</h2>

<p>ResumeSpy のAIカスタマイズ機能は、このプロセスの機械的な部分を自動化します。求人票を貼り付けるだけで、キーワードのギャップを特定し、箇条書きの修正を提案し、ミスマッチした表現を指摘します。あなたは修正を確認・承認するだけです。</p>
`,
    },
    'github-profile-to-professional-resume': {
      en: `
<h1>From GitHub Profile to Professional Developer Resume</h1>

<p>For software engineers and developers, GitHub is not just a code repository — it's a living portfolio that can strengthen every claim made on a traditional resume. Yet most developers either ignore it as a hiring asset or link to a profile without making it work for them.</p>

<p>This guide shows you how to make your GitHub profile and your resume reinforce each other, turning commit history and open-source contributions into concrete, interview-ready evidence of your abilities.</p>

<h2>Why GitHub Matters in Developer Hiring</h2>

<p>Technical hiring involves a level of scrutiny that doesn't exist in other fields. Claims like "built scalable microservices" or "improved system performance" are common — and hiring managers have learned to be skeptical. GitHub gives you a way to back those claims with verifiable evidence.</p>

<p>Many engineering teams review a candidate's public GitHub activity before or during the interview process. A well-curated profile can accelerate trust-building and sometimes replace an early technical screen.</p>

<h2>Start with Your Profile README</h2>

<p>GitHub's profile README (a <code>README.md</code> file in a repository named after your username) is your first impression on the platform. Think of it as the summary section of your resume extended to a digital canvas:</p>

<ul>
  <li><strong>Who you are:</strong> current role, specialization, what you're currently building or learning</li>
  <li><strong>What you're good at:</strong> languages, frameworks, domains (not a laundry list — top 5–7 that actually define your work)</li>
  <li><strong>How to reach you:</strong> professional email, LinkedIn, personal site</li>
  <li><strong>A few lines of personality:</strong> open source interests, what problems excite you</li>
</ul>

<p>Keep it scannable. A wall of text or badge overload works against you.</p>

<h2>Curate Your Pinned Repositories</h2>

<p>GitHub lets you pin up to six repositories. Choose them with the same intentionality you'd apply to selecting bullet points for a targeted resume:</p>

<ul>
  <li><strong>Relevance over volume:</strong> pin projects that demonstrate skills relevant to the roles you're pursuing, not just your most starred repos</li>
  <li><strong>Finished work over fragments:</strong> a polished project with a complete README signals professionalism; a skeleton repo with no commits in two years signals abandonment</li>
  <li><strong>Diversity:</strong> aim for a spread — different problem domains, different scales, different technologies — unless you're targeting a highly specialized role</li>
</ul>

<h2>Write Repository READMEs That Sell</h2>

<p>Every pinned repository needs a README that frames the project the way a resume bullet frames an achievement:</p>

<ul>
  <li><strong>Problem:</strong> What did this solve, and why did it matter?</li>
  <li><strong>Approach:</strong> What technologies did you use, and why those over alternatives?</li>
  <li><strong>Results:</strong> Usage numbers, performance improvements, users served, stars earned, PRs merged</li>
  <li><strong>Setup instructions:</strong> A running demo or clear instructions show you can ship, not just code</li>
</ul>

<p>A README that reads like a technical case study is far more convincing than a list of file descriptions.</p>

<h2>Quantifying Open Source Contributions</h2>

<p>Contributing to well-known open source projects carries significant weight with engineering teams. When listing OSS contributions on your resume, be specific:</p>

<ul>
  <li>Name the project and its scale (<em>"React (220k+ GitHub stars)"</em>)</li>
  <li>Describe what you contributed (<em>"Fixed a memory leak in the reconciler that affected async rendering"</em>)</li>
  <li>Link to the merged PR directly — the PR itself is the evidence</li>
</ul>

<p>One meaningful contribution to a widely used project is worth more on a resume than dozens of small commits to unknown repositories.</p>

<h2>Translating Technical Work into Business Outcomes</h2>

<p>The weakest developer resumes describe what code does. The strongest describe what it achieves.</p>

<ul>
  <li><strong>Weak:</strong> "Built a caching layer using Redis"</li>
  <li><strong>Strong:</strong> "Implemented Redis caching layer that reduced average API response time from 340ms to 45ms, eliminating the primary source of user-reported lag"</li>
</ul>

<p>Apply this framing to GitHub project descriptions, README content, and resume bullet points alike. The habit transfers naturally between the two.</p>

<h2>What Recruiters Actually Look At</h2>

<p>Based on common recruiter behavior, the GitHub elements that get the most attention are:</p>

<ol>
  <li>Profile README — does this person know how to communicate?</li>
  <li>Pinned repositories — what are they proud of?</li>
  <li>Contribution graph — are they actively coding?</li>
  <li>Recent commit activity — what are they working on right now?</li>
</ol>

<p>Stars, followers, and raw repository count receive far less attention than most developers expect.</p>

<h2>Connecting GitHub to Your Resume</h2>

<p>On your resume, link your GitHub profile in the contact section. For technical roles, this is as expected as a LinkedIn link. Then:</p>

<ul>
  <li>For significant personal projects, reference the GitHub repo directly in the resume bullet (<em>"github.com/yourname/projectname"</em>)</li>
  <li>For OSS contributions, link the specific merged PR rather than the project home page</li>
  <li>Use ResumeSpy to maintain different resume versions that emphasize different GitHub projects depending on the role you're targeting</li>
</ul>

<h2>If Your GitHub Is Thin</h2>

<p>Not all strong developers have active public GitHub profiles — especially those who've worked primarily in private enterprise environments. If this describes you:</p>

<ul>
  <li>Create one or two focused, well-documented projects that demonstrate your primary skill set</li>
  <li>Contribute to one active open source project — even documentation improvements count</li>
  <li>Use your profile README to explain your professional context honestly</li>
</ul>

<p>A lean but polished GitHub is better than no GitHub at all for most developer roles.</p>
`,
      zh: `
<h1>从GitHub到offer：开发者如何把代码变成职业资产</h1>

<p>对于软件工程师和开发者来说，GitHub不仅仅是代码仓库——它是一个活的作品集，可以为传统简历上的每项声明提供支撑。然而大多数开发者要么忽视它作为求职工具的价值，要么只是随手附上一个链接而没有真正发挥其作用。</p>

<p>本文介绍如何让GitHub主页与简历相互强化，将提交记录和开源贡献转化为具体的、在面试中站得住脚的能力证明。</p>

<h2>国内技术招聘中GitHub的现实情况</h2>

<p>国内大厂和外企对GitHub的重视程度有所不同：</p>

<ul>
  <li><strong>外资技术公司：</strong>积极使用GitHub，面试前通常会查看候选人主页</li>
  <li><strong>国内互联网大厂：</strong>部分团队会参考，特别是基础架构、开源相关岗位</li>
  <li><strong>初创公司：</strong>重视实际项目代码质量多于平台本身</li>
  <li><strong>传统行业IT部门：</strong>关注度相对较低，但有活跃主页依然是加分项</li>
</ul>

<p>如果GitHub在国内访问受限，码云（Gitee）可作为备选，但国际岗位仍以GitHub为主。</p>

<h2>从Profile README开始</h2>

<p>GitHub的个人主页README是你在平台上的第一印象。把它当作简历摘要的数字版扩展：</p>

<ul>
  <li>当前身份与专业方向</li>
  <li>擅长的语言、框架、技术域（精选5-7项，非罗列清单）</li>
  <li>联系方式：邮箱、领英、个人网站</li>
  <li>简短的技术兴趣描述：什么问题让你兴奋？</li>
</ul>

<h2>精心策划置顶仓库</h2>

<p>GitHub允许置顶最多6个仓库。像挑选简历要点一样有选择性：</p>

<ul>
  <li><strong>相关性优先于数量：</strong>选择展示目标岗位所需技能的项目，而不只是星标最多的</li>
  <li><strong>完成品优先于半成品：</strong>有完整README的精品项目远胜于两年没有提交的骨架仓库</li>
  <li><strong>多样性：</strong>涵盖不同问题域、不同规模、不同技术栈（除非目标是高度专业化岗位）</li>
</ul>

<h2>写出有说服力的仓库README</h2>

<p>每个置顶仓库的README要像简历要点展示成就一样框架清晰：</p>

<ul>
  <li><strong>问题：</strong>这个项目解决了什么，为什么重要？</li>
  <li><strong>方案：</strong>使用了什么技术，为什么选择它而不是替代方案？</li>
  <li><strong>结果：</strong>用户数、性能提升、Stars数、被合并的PR数量</li>
  <li><strong>运行说明：</strong>能运行的Demo或清晰的部署说明，证明你能交付而不只是写代码</li>
</ul>

<h2>量化你的开源贡献</h2>

<p>在简历上列出开源贡献时，要具体：</p>

<ul>
  <li>说明项目及其规模（<em>"Vue.js（200k+ GitHub Stars）"</em>）</li>
  <li>描述具体贡献（<em>"修复了SSR场景下的内存泄漏问题"</em>）</li>
  <li>直接链接到已合并的PR——PR本身就是证据</li>
</ul>

<h2>把技术工作翻译成业务成果</h2>

<p>弱的开发者简历描述代码做了什么，强的描述代码实现了什么。</p>

<ul>
  <li><strong>弱：</strong>"基于Redis构建了缓存层"</li>
  <li><strong>强：</strong>"实现Redis缓存层，将API平均响应时间从340ms降至45ms，消除了用户反馈的主要卡顿来源"</li>
</ul>

<h2>用ResumeSpy连接GitHub与简历</h2>

<p>对于重要的个人项目，在简历要点中直接引用GitHub仓库地址。针对不同岗位，使用ResumeSpy维护不同简历版本，突出与该岗位最相关的GitHub项目。</p>
`,
      ja: `
<h1>GitHubプロフィールをエンジニアの最強職務経歴書に変える方法</h1>

<p>ソフトウェアエンジニアや開発者にとって、GitHubは単なるコードリポジトリではありません。職務経歴書のあらゆる主張を裏付けることができる生きたポートフォリオです。しかし多くの開発者は、採用ツールとしてGitHubを無視するか、プロフィールにリンクを貼るだけで活用し切れていません。</p>

<p>このガイドでは、GitHubプロフィールと職務経歴書が互いを強化し合うようにする方法を解説します。コミット履歴とOSS貢献を、面接で通用する具体的な能力の証拠に変えましょう。</p>

<h2>日本の技術系採用におけるGitHubの実態</h2>

<p>企業タイプによってGitHubの重視度は異なります：</p>

<ul>
  <li><strong>外資系IT企業：</strong>採用プロセスでGitHubを積極的に確認。書類選考前にプロフィールを見ることも</li>
  <li><strong>日系大手IT企業：</strong>インフラ・OSS関連ポジションでは参照されることが増加</li>
  <li><strong>スタートアップ：</strong>コードの質を直接評価。活発なコミット履歴が好印象</li>
  <li><strong>SIer・受託開発：</strong>重視度は低めだが、あれば差別化要因になる</li>
</ul>

<h2>プロフィールREADMEを整える</h2>

<p>GitHubのプロフィールREADMEはプラットフォーム上での第一印象です。職務経歴書の自己PR欄をデジタルキャンバスに拡張したものとして設計しましょう：</p>

<ul>
  <li>現在の役職・専門分野・取り組んでいる技術</li>
  <li>得意な言語・フレームワーク・技術領域（上位5〜7項目、羅列ではなく厳選）</li>
  <li>連絡先：メール、LinkedIn、ポートフォリオサイト</li>
  <li>技術的な興味・OSS活動への関心</li>
</ul>

<h2>リポジトリをキュレーションする</h2>

<p>GitHubでは最大6つのリポジトリをピン留めできます。職種ごとに最適な要点を選ぶ感覚で選択しましょう：</p>

<ul>
  <li><strong>関連性を数より優先：</strong>最もスターが多いリポジトリより、応募職種に関連するプロジェクトを選ぶ</li>
  <li><strong>完成度の高い作品を優先：</strong>2年間コミットがないスケルトンより、完全なREADMEを持つプロジェクトが好印象</li>
  <li><strong>多様性を意識：</strong>異なる問題領域・規模・技術スタックを組み合わせる</li>
</ul>

<h2>採用担当者に響くREADMEの書き方</h2>

<p>各ピン留めリポジトリのREADMEは、職務経歴書の実績記載と同じフレームで書きましょう：</p>

<ul>
  <li><strong>課題：</strong>何を解決したか、なぜ重要だったか</li>
  <li><strong>アプローチ：</strong>どの技術を選び、なぜその技術を使ったか</li>
  <li><strong>成果：</strong>ユーザー数、パフォーマンス改善率、スター数、マージされたPR数</li>
  <li><strong>動作確認：</strong>デモまたは明確な実行手順 — 「コードを書ける」だけでなく「動くものを届けられる」ことを示す</li>
</ul>

<h2>OSS貢献を職務経歴書に落とし込む</h2>

<p>OSS貢献を記載する際は具体的に：</p>

<ul>
  <li>プロジェクト名と規模（<em>"Vue.js（GitHubスター200k+）"</em>）</li>
  <li>具体的な貢献内容（<em>"SSRレンダリング時のメモリリークを修正"</em>）</li>
  <li>マージ済みPRへの直リンク — PRそのものが証拠になる</li>
</ul>

<h2>技術的な仕事をビジネス成果に翻訳する</h2>

<ul>
  <li><strong>弱い表現：</strong>「Redisを使ったキャッシュレイヤーを実装した」</li>
  <li><strong>強い表現：</strong>「Redisキャッシュレイヤーの実装により、API平均応答時間を340msから45msに短縮し、ユーザー報告の遅延問題を解消した」</li>
</ul>

<h2>Qiita・Zennとの連携</h2>

<p>技術ブログ（Qiita・Zenn）での発信は、GitHubのコードと組み合わせることで説明力を高めます。「このOSSの仕組みを解説した記事」を書き、リポジトリのREADMEからリンクすることで、技術理解の深さを示せます。</p>

<p>ResumeSpy では応募先ごとに異なるGitHubプロジェクトを強調する職務経歴書を管理できます。外資系向けと日系向けで異なるバージョンを使い分けましょう。</p>
`,
    },
  }

  function getArticleBySlug(slug: string): string {
    const article = articles[slug]
    if (!article) {
      return ''
    }
    return article[locale.value] || article['en'] || ''
  }

  return {
    getArticleBySlug,
  }
}
