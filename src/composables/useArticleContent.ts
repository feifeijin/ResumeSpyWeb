import { useI18n } from 'vue-i18n'

export function useArticleContent() {
  const { locale } = useI18n()

  const articles: Record<string, Record<string, string>> = {
    'mastering-resume-writing-best-practices-2025': {
      en: `
<h1>Mastering Resume Writing: Best Practices for 2025</h1>

<h2>Introduction</h2>
<p>In today's competitive job market, your resume is often your first—and sometimes only—chance to make a lasting impression on potential employers. As we move into 2025, the art and science of resume writing continue to evolve, influenced by technological advancements, changing workplace dynamics, and shifting recruiter expectations.</p>

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
<h1>掌握简历写作：2025年最佳实践</h1>

<h2>简介</h2>
<p>在当今竞争激烈的就业市场中，您的简历往往是给潜在雇主留下持久印象的第一次——有时也是唯一的一次——机会。随着我们进入2025年，简历写作的艺术和科学继续演变，受到技术进步、工作场所动态变化和招聘人员期望转变的影响。</p>

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
<h1>履歴書作成の習得：2025年のベストプラクティス</h1>

<h2>はじめに</h2>
<p>今日の競争の激しい就職市場において、履歴書は潜在的な雇用主に永続的な印象を与える最初の、そして時には唯一のチャンスとなることがよくあります。2025年に向けて、履歴書作成の技術と科学は、技術の進歩、職場のダイナミクスの変化、採用担当者の期待の変化に影響を受けながら進化し続けています。</p>

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
      en: '<h1>Showcasing Language Skills on Your Resume</h1><p>Content for language skills article in English...</p>',
      zh: '<h1>在简历中展示语言技能</h1><p>语言技能文章的中文内容...</p>',
      ja: '<h1>履歴書で言語スキルを効果的に示す</h1><p>言語スキル記事の日本語コンテンツ...</p>',
    },
    'version-control-for-your-resume': {
      en: '<h1>Version Control for Your Resume</h1><p>Content for version control article in English...</p>',
      zh: '<h1>简历版本控制</h1><p>版本控制文章的中文内容...</p>',
      ja: '<h1>履歴書のバージョン管理</h1><p>バージョン管理記事の日本語コンテンツ...</p>',
    },
    'creating-job-specific-resumes-efficiently': {
      en: '<h1>Creating Job-Specific Resumes Efficiently</h1><p>Content for job-specific resumes article in English...</p>',
      zh: '<h1>高效创建针对特定职位的简历</h1><p>针对特定职位简历文章的中文内容...</p>',
      ja: '<h1>職種特化の履歴書を効率的に作成</h1><p>職種特化履歴書記事の日本語コンテンツ...</p>',
    },
    'github-profile-to-professional-resume': {
      en: '<h1>GitHub Profile to Professional Resume</h1><p>Content for GitHub article in English...</p>',
      zh: '<h1>GitHub简介转专业简历</h1><p>GitHub文章的中文内容...</p>',
      ja: '<h1>GitHubプロフィールからプロフェッショナルな履歴書へ</h1><p>GitHub記事の日本語コンテンツ...</p>',
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
