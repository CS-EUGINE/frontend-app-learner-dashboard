const FAQ_ITEMS = [
  {
    id: 'browse-account',
    question: 'Do I need an account to browse courses?',
    answer: 'No. You can browse the course catalog and course descriptions without signing in. You need an account to enroll, track progress, or earn a certificate.',
    keywords: ['browse', 'catalog', 'account', 'sign in'],
  },
  {
    id: 'create-account',
    question: 'How do I create an account?',
    answer: 'Select Register for free in the top navigation, then enter a working email address, username, and password. Registration is free.',
    keywords: ['register', 'sign up', 'create account', 'username'],
  },
  {
    id: 'enroll',
    question: 'How do I enroll in a course?',
    answer: 'Open a course from the catalog and select Enroll. Free courses open immediately. Paid courses are added to your cart and become available after payment is confirmed.',
    keywords: ['enroll', 'enrollment', 'join course', 'start course'],
  },
  {
    id: 'devices',
    question: 'What do I need to use the platform?',
    answer: 'Use a current version of Chrome, Firefox, Edge, or Safari and a reliable internet connection. The platform works on phones and tablets, though longer assignments are easier on a laptop.',
    keywords: ['browser', 'phone', 'tablet', 'device', 'requirements', 'internet'],
  },
  {
    id: 'course-pace',
    question: 'Are courses self-paced or scheduled?',
    answer: 'It depends on the course. Self-paced courses can be completed on your schedule, while scheduled courses show start dates and assignment deadlines on the course page.',
    keywords: ['self paced', 'schedule', 'deadline', 'start date'],
  },
  {
    id: 'course-access',
    question: 'How long can I access a paid course?',
    answer: 'Access stays with your account while the course remains on the platform. If a paid course is retired, learners are notified before it is removed.',
    keywords: ['access', 'paid course', 'course expiry', 'retired'],
  },
  {
    id: 'downloads',
    question: 'Can I download videos and course material?',
    answer: 'Course material is available in the browser, and some courses include downloadable handouts. Bulk downloading or redistributing course material is not allowed.',
    keywords: ['download', 'video', 'handout', 'material'],
  },
  {
    id: 'course-discussions',
    question: 'Where can I ask questions about course material?',
    answer: 'Most courses include a discussion area for questions to the course team and other learners. Use support for account, billing, and technical issues instead.',
    keywords: ['discussion', 'course question', 'course team', 'lesson help'],
  },
  {
    id: 'tracks',
    question: 'What are Learning Tracks?',
    answer: 'Learning Tracks group related courses into a suggested route through a subject. You can browse them from the Scale-Up page.',
    keywords: ['track', 'learning track', 'scale up', 'pathway'],
  },
  {
    id: 'subscription',
    question: 'Is this a subscription?',
    answer: 'No. There is no monthly or yearly subscription. Courses are purchased individually and charged once per purchase.',
    keywords: ['subscription', 'monthly', 'yearly', 'recurring'],
  },
  {
    id: 'payment',
    question: 'How do I pay for a course?',
    answer: 'Add a course to your cart and check out. Payments are processed through Paymongo using supported cards and local e-wallet options.',
    keywords: ['pay', 'payment', 'paymongo', 'wallet', 'card', 'checkout'],
  },
  {
    id: 'refund',
    question: 'Can I get a refund?',
    answer: 'You can request a refund within 14 days of purchase if you have not completed more than one quarter of the course and have not been issued its certificate. Contact support with the course name and payment email.',
    keywords: ['refund', 'money back', 'return payment'],
  },
  {
    id: 'receipt',
    question: 'Where is my receipt?',
    answer: 'A confirmation is sent to your account email when payment clears. Check spam first, then contact support if you need it resent.',
    keywords: ['receipt', 'invoice', 'confirmation', 'payment email'],
  },
  {
    id: 'certificate',
    question: 'How do I earn and share a certificate?',
    answer: 'Meet the course completion requirements, usually by passing graded assessments. Your certificate has a shareable verification link once it is issued.',
    keywords: ['certificate', 'certification', 'share certificate', 'verify certificate'],
  },
  {
    id: 'password',
    question: 'I forgot my password. What should I do?',
    answer: 'Use the Forgot password link on the sign-in page. A time-limited reset link is sent to your registered email address.',
    keywords: ['password', 'reset', 'forgot password', 'login'],
  },
  {
    id: 'profile',
    question: 'How do I change my email address or name?',
    answer: 'Open Account Settings from the menu under your name. Changing your email address requires confirmation of the new address.',
    keywords: ['change email', 'change name', 'profile', 'account settings'],
  },
  {
    id: 'video',
    question: 'A video will not play. What can I do?',
    answer: 'Try a different browser or network first. If the problem continues, contact support with the course name, unit, and browser you are using.',
    keywords: ['video', 'play', 'streaming', 'browser issue'],
  },
  {
    id: 'account-security',
    question: 'I think someone else has access to my account.',
    answer: 'Change your password immediately and contact support so the account can be secured. Never send your password to support.',
    keywords: ['account hacked', 'security', 'someone access', 'compromised'],
  },
];

const STOP_WORDS = new Set(['a', 'an', 'and', 'are', 'can', 'do', 'for', 'how', 'i', 'is', 'my', 'of', 'the', 'to', 'what', 'where', 'with']);

const SYNONYMS = {
  account: ['profile', 'user'],
  certificate: ['cert', 'credential', 'completion'],
  course: ['class', 'lesson', 'training'],
  enroll: ['enrol', 'register', 'join'],
  login: ['log', 'signin', 'sign'],
  password: ['passcode', 'credential'],
  payment: ['pay', 'billing', 'purchase'],
  refund: ['refund', 'reimburse', 'cancel'],
};

export const RECOMMENDED_QUESTIONS = [
  'How do I enroll in a course?',
  'I forgot my password. What should I do?',
  'How do I earn and share a certificate?',
  'How do I pay for a course?',
];

const termsFor = value => (value.toLowerCase().match(/[a-z0-9]+/g) || [])
  .filter(term => term.length > 1 && !STOP_WORDS.has(term))
  .map((term) => {
    if (term.endsWith('ing') && term.length > 5) {
      return term.slice(0, -3);
    }
    if (term.endsWith('ed') && term.length > 4) {
      return term.slice(0, -2);
    }
    if (term.endsWith('s') && !term.endsWith('ss') && term.length > 3) {
      return term.slice(0, -1);
    }
    return term;
  });

const expandTerms = (terms) => {
  const expanded = new Set(terms);
  terms.forEach((term) => {
    Object.entries(SYNONYMS).forEach(([intent, variants]) => {
      if (term === intent || variants.includes(term)) {
        expanded.add(intent);
        variants.forEach(variant => expanded.add(variant));
      }
    });
  });
  return [...expanded];
};

/**
 * Return an FAQ answer only when the supplied words meaningfully match it.
 * This is intentionally local and deterministic: it does not call an AI or
 * transmit the learner's question to any service.
 */
export const findFaqAnswer = (query) => {
  const queryTerms = expandTerms(termsFor(query));
  if (!queryTerms.length) {
    return null;
  }

  const ranked = FAQ_ITEMS.map((item) => {
    const primarySearchable = expandTerms(termsFor(`${item.question} ${item.keywords.join(' ')}`));
    const answerSearchable = expandTerms(termsFor(item.answer));
    const primaryMatches = queryTerms.filter(term => primarySearchable.includes(term)).length;
    const answerMatches = queryTerms.filter(term => answerSearchable.includes(term)).length;
    return {
      item,
      score: ((primaryMatches * 2) + (answerMatches * 0.25)) / queryTerms.length,
      matches: primaryMatches + answerMatches,
      primaryMatches,
    };
  }).sort((left, right) => (
    right.score - left.score
    || right.primaryMatches - left.primaryMatches
    || right.matches - left.matches
  ));

  const best = ranked[0];
  if (!best || !best.primaryMatches || best.score < (queryTerms.length === 1 ? 1 : 0.5)) {
    return null;
  }
  return best.item;
};

export { FAQ_ITEMS };
