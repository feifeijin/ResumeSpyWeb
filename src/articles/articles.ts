const year = new Date().getFullYear()

export interface ArticleMeta {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  author: string
  date: string        // ISO 8601
  updatedDate?: string
  readTime: number    // minutes
  metaDescription: string
  targetKeyword: string
}

export type SupportedLocale = 'en' | 'zh' | 'ja'

export const articlesByLocale: Record<SupportedLocale, ArticleMeta[]> = {
  en: [
    {
      slug: 'mastering-resume-writing-best-practices-2025',
      title: `Mastering Resume Writing: Best Practices for ${year}`,
      excerpt:
        'Your resume is your first impression. Learn how structure, language, and strategy combine to open doors in a competitive market.',
      tags: ['Writing', 'Best Practices'],
      author: 'ResumeSpy Editorial',
      date: '2025-01-15',
      readTime: 8,
      metaDescription:
        `Master resume writing in ${year} with proven best practices. Learn structure, ATS optimization, and language strategies that get interviews.`,
      targetKeyword: `resume writing best practices ${year}`,
    },
    {
      slug: 'resume-optimization-seo-for-your-career',
      title: 'Resume Optimization: SEO for Your Career',
      excerpt:
        'ATS systems screen you before any human does. Learn the keyword and formatting strategies that get you through the filter.',
      tags: ['ATS', 'Keywords'],
      author: 'ResumeSpy Editorial',
      date: '2025-02-03',
      readTime: 10,
      metaDescription:
        'Learn how to optimize your resume for Applicant Tracking Systems. Keyword strategy, formatting tips, and ATS compatibility checks that work.',
      targetKeyword: 'resume ATS optimization',
    },
    {
      slug: 'showcasing-language-skills-on-resume',
      title: 'How to List Language Skills on Your Resume (CEFR Guide)',
      excerpt:
        'In a global market, multilingual ability is a competitive edge. How to present your language skills with precision and impact.',
      tags: ['Languages', 'Global'],
      author: 'ResumeSpy Editorial',
      date: '2025-03-10',
      readTime: 6,
      metaDescription:
        'Learn how to list language skills on your resume using CEFR levels. Stand out in global job markets with accurate proficiency ratings and certifications.',
      targetKeyword: 'language skills on resume',
    },
    {
      slug: 'version-control-for-your-resume',
      title: 'Resume Version Control: Manage Multiple Versions Like a Pro',
      excerpt:
        'One resume for every job is a losing strategy. Learn how to maintain a living document that evolves with every application.',
      tags: ['Strategy', 'Versions'],
      author: 'ResumeSpy Editorial',
      date: '2025-03-28',
      readTime: 7,
      metaDescription:
        'Stop sending the same resume to every job. Learn resume version control strategies to tailor applications and systematically track your job search.',
      targetKeyword: 'resume version control multiple versions',
    },
    {
      slug: 'creating-job-specific-resumes-efficiently',
      title: 'How to Tailor Your Resume for Every Job Without Starting Over',
      excerpt:
        'Tailoring takes time — unless you have a system. A framework for producing targeted resumes without starting from scratch.',
      tags: ['Productivity', 'Tailoring'],
      author: 'ResumeSpy Editorial',
      date: '2025-04-05',
      readTime: 7,
      metaDescription:
        'Discover how to tailor your resume for each job posting efficiently. A master resume system that saves time and measurably boosts interview rates.',
      targetKeyword: 'tailor resume for every job',
    },
    {
      slug: 'github-profile-to-professional-resume',
      title: 'From GitHub Profile to Professional Developer Resume',
      excerpt:
        'Your commit history tells a story. How to translate open-source contributions and side projects into compelling resume content.',
      tags: ['Developers', 'GitHub'],
      author: 'ResumeSpy Editorial',
      date: '2025-04-10',
      readTime: 9,
      metaDescription:
        'Turn your GitHub profile into a professional developer resume. Learn how to showcase open source contributions, projects, and skills to land developer roles.',
      targetKeyword: 'GitHub profile developer resume',
    },
  ],

  zh: [
    {
      slug: 'mastering-resume-writing-best-practices-2025',
      title: `${year}年简历写作精要：赢得面试的核心技巧`,
      excerpt: '简历是你留下的第一印象。学习如何通过结构、语言和策略在竞争激烈的市场中脱颖而出。',
      tags: ['写作', '最佳实践'],
      author: 'ResumeSpy 编辑团队',
      date: '2025-01-15',
      readTime: 8,
      metaDescription:
        `掌握${year}年简历写作技巧，学习结构设计、ATS优化和关键词策略，让你的简历在竞争中脱颖而出，获得更多面试机会。`,
      targetKeyword: `${year}年简历写作技巧`,
    },
    {
      slug: 'resume-optimization-seo-for-your-career',
      title: '简历优化：让招聘系统主动找到你',
      excerpt: '在人工审核前，ATS系统已经筛选了你的简历。学习关键词策略和格式规范，突破系统筛选。',
      tags: ['ATS优化', '关键词'],
      author: 'ResumeSpy 编辑团队',
      date: '2025-02-03',
      readTime: 10,
      metaDescription:
        '学习如何优化简历通过ATS筛选系统。掌握关键词策略、格式规范和兼容性技巧，大幅提高简历曝光率和面试邀约率。',
      targetKeyword: '简历ATS优化',
    },
    {
      slug: 'showcasing-language-skills-on-resume',
      title: '如何在简历中专业展示语言能力',
      excerpt: '在全球化市场中，多语言能力是竞争优势。学习如何精准、有力地呈现你的语言技能。',
      tags: ['语言能力', '国际化'],
      author: 'ResumeSpy 编辑团队',
      date: '2025-03-10',
      readTime: 6,
      metaDescription:
        '学习如何在简历中专业展示语言能力，正确使用HSK、JLPT、雅思等标准评级，在外资和国际化岗位求职中占据优势。',
      targetKeyword: '简历语言能力怎么写',
    },
    {
      slug: 'version-control-for-your-resume',
      title: '简历版本管理：像产品经理一样迭代你的求职材料',
      excerpt: '每次投递用同一份简历是失败策略。学习如何维护一份随每次申请持续迭代的"活文档"。',
      tags: ['求职策略', '版本管理'],
      author: 'ResumeSpy 编辑团队',
      date: '2025-03-28',
      readTime: 7,
      metaDescription:
        '停止向所有职位投递相同简历。学习简历版本管理策略，针对互联网、外资、国企等不同岗位定制简历，系统化提升面试率。',
      targetKeyword: '简历版本管理多个版本',
    },
    {
      slug: 'creating-job-specific-resumes-efficiently',
      title: '高效定制简历：不从零开始的针对性投递策略',
      excerpt: '定制简历耗时耗力——除非你有一套系统。分享一套无需每次重写的定制化简历框架。',
      tags: ['效率', '定制化'],
      author: 'ResumeSpy 编辑团队',
      date: '2025-04-05',
      readTime: 7,
      metaDescription:
        '学习如何高效针对每个职位定制简历。建立主简历体系节省时间，通过精准关键词和成就描述大幅提升面试邀约率。',
      targetKeyword: '针对性简历定制技巧',
    },
    {
      slug: 'github-profile-to-professional-resume',
      title: '从GitHub到offer：开发者如何把代码变成职业资产',
      excerpt: '你的提交历史就是你的职业故事。学习如何把开源贡献和个人项目转化为有说服力的简历内容。',
      tags: ['开发者', 'GitHub'],
      author: 'ResumeSpy 编辑团队',
      date: '2025-04-10',
      readTime: 9,
      metaDescription:
        '将GitHub主页转化为专业开发者简历。学习如何量化展示开源贡献、项目经历和技术技能，让技术面试官眼前一亮。',
      targetKeyword: 'GitHub简历开发者求职',
    },
  ],

  ja: [
    {
      slug: 'mastering-resume-writing-best-practices-2025',
      title: `${year}年版 履歴書・職務経歴書の書き方完全ガイド`,
      excerpt:
        '履歴書は最初の印象を決定します。構成、言葉遣い、戦略を組み合わせて競争の激しい市場で道を開く方法を学びましょう。',
      tags: ['書き方', 'ベストプラクティス'],
      author: 'ResumeSpy 編集部',
      date: '2025-01-15',
      readTime: 8,
      metaDescription:
        `${year}年の転職市場に対応した履歴書・職務経歴書の書き方を徹底解説。ATS対策から採用担当者の目を引く表現まで、内定率を高めるポイントを網羅。`,
      targetKeyword: `履歴書 書き方 ${year}年`,
    },
    {
      slug: 'resume-optimization-seo-for-your-career',
      title: '採用システムに選ばれる履歴書最適化術',
      excerpt:
        'ATSが人間より先に履歴書をスクリーニングします。フィルターを突破するキーワード戦略と書式を学びましょう。',
      tags: ['ATS対策', 'キーワード'],
      author: 'ResumeSpy 編集部',
      date: '2025-02-03',
      readTime: 10,
      metaDescription:
        '応募者追跡システム(ATS)に対応した履歴書最適化術。キーワード戦略と書式のベストプラクティスで書類選考突破率を高める実践ガイド。',
      targetKeyword: '履歴書 ATS対策 最適化',
    },
    {
      slug: 'showcasing-language-skills-on-resume',
      title: '履歴書の語学力・TOEICスコアの正しい書き方',
      excerpt:
        'グローバル市場では多言語能力が競争優位性になります。語学スキルを正確かつ効果的に伝える方法を学びましょう。',
      tags: ['語学力', 'グローバル'],
      author: 'ResumeSpy 編集部',
      date: '2025-03-10',
      readTime: 6,
      metaDescription:
        '履歴書・職務経歴書での語学力の書き方を徹底解説。TOEICスコア、TOEFL、JLPT、英語レベルの正しい表記法と外資系・グローバル企業向けのアピール法。',
      targetKeyword: '履歴書 語学力 TOEICスコア 書き方',
    },
    {
      slug: 'version-control-for-your-resume',
      title: '履歴書のバージョン管理術：複数の応募先に対応する転職戦略',
      excerpt:
        'すべての求人に同じ履歴書を送るのは負け戦略です。応募ごとに進化する「生きた書類」の管理方法を学びましょう。',
      tags: ['転職戦略', 'バージョン管理'],
      author: 'ResumeSpy 編集部',
      date: '2025-03-28',
      readTime: 7,
      metaDescription:
        '複数の求人に対応する履歴書バージョン管理術。業界・職種・企業規模ごとに最適化した書類を効率的に管理し、書類選考通過率を高める方法。',
      targetKeyword: '転職 履歴書 複数バージョン 管理',
    },
    {
      slug: 'creating-job-specific-resumes-efficiently',
      title: '職種別履歴書の効率的な作り方：ゼロから始めない応募戦略',
      excerpt:
        '応募ごとの書類作成は時間がかかります——システムがあれば別ですが。毎回ゼロから書かない職種特化型履歴書の作り方。',
      tags: ['生産性', 'カスタマイズ'],
      author: 'ResumeSpy 編集部',
      date: '2025-04-05',
      readTime: 7,
      metaDescription:
        '求人ごとに履歴書を効率よくカスタマイズする方法。マスター職務経歴書の作り方から求人票の読み解きテクニックまで、転職活動を加速させる実践ガイド。',
      targetKeyword: '転職 履歴書 カスタマイズ 効率化',
    },
    {
      slug: 'github-profile-to-professional-resume',
      title: 'GitHubプロフィールをエンジニアの最強職務経歴書に変える方法',
      excerpt:
        'コミット履歴があなたのキャリアを語ります。オープンソース貢献と個人プロジェクトを説得力ある書類に変換する方法。',
      tags: ['エンジニア', 'GitHub'],
      author: 'ResumeSpy 編集部',
      date: '2025-04-10',
      readTime: 9,
      metaDescription:
        'GitHubプロフィールをエンジニアの職務経歴書に活かす方法。OSS貢献・個人開発の経験を採用担当者に刺さる形で伝える実践的なコツを解説します。',
      targetKeyword: 'GitHub 職務経歴書 エンジニア 転職',
    },
  ],
}

export function getArticlesByLocale(locale: string): ArticleMeta[] {
  const key = locale as SupportedLocale
  return articlesByLocale[key] ?? articlesByLocale['en']
}

export function getArticleMetaBySlug(slug: string, locale: string): ArticleMeta | undefined {
  return getArticlesByLocale(locale).find((a) => a.slug === slug)
}
