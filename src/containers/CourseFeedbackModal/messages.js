import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  giveFeedback: {
    id: 'dashboard.courseFeedback.giveFeedback',
    defaultMessage: 'Give feedback',
  },
  feedbackSent: {
    id: 'dashboard.courseFeedback.feedbackSent',
    defaultMessage: 'Feedback sent',
  },
  sentTooltip: {
    id: 'dashboard.courseFeedback.sentTooltip',
    defaultMessage: 'You rated this course {rating} out of 5. Feedback can only be given once per course.',
  },
  modalTitle: {
    id: 'dashboard.courseFeedback.modalTitle',
    defaultMessage: 'How was {courseName}?',
  },
  modalIntro: {
    id: 'dashboard.courseFeedback.modalIntro',
    defaultMessage: 'Your review is shown on the course page with your name, so other learners can see it. You can only send it once per course.',
  },
  ratingLabel: {
    id: 'dashboard.courseFeedback.ratingLabel',
    defaultMessage: 'Your rating',
  },
  ratingHint: {
    id: 'dashboard.courseFeedback.ratingHint',
    defaultMessage: 'One star is poor, five is excellent.',
  },
  starLabel: {
    id: 'dashboard.courseFeedback.starLabel',
    defaultMessage: '{value} out of 5 - {label}',
  },
  rating1: { id: 'dashboard.courseFeedback.rating1', defaultMessage: 'Poor' },
  rating2: { id: 'dashboard.courseFeedback.rating2', defaultMessage: 'Fair' },
  rating3: { id: 'dashboard.courseFeedback.rating3', defaultMessage: 'Good' },
  rating4: { id: 'dashboard.courseFeedback.rating4', defaultMessage: 'Very good' },
  rating5: { id: 'dashboard.courseFeedback.rating5', defaultMessage: 'Excellent' },
  headlineLabel: {
    id: 'dashboard.courseFeedback.headlineLabel',
    defaultMessage: 'Headline (optional)',
  },
  headlinePlaceholder: {
    id: 'dashboard.courseFeedback.headlinePlaceholder',
    defaultMessage: 'Sum it up in a few words',
  },
  commentLabel: {
    id: 'dashboard.courseFeedback.commentLabel',
    defaultMessage: 'Your review',
  },
  commentPlaceholder: {
    id: 'dashboard.courseFeedback.commentPlaceholder',
    defaultMessage: 'What worked, what did not, and who would you send here next?',
  },
  commentHint: {
    id: 'dashboard.courseFeedback.commentHint',
    defaultMessage: 'At least {min} characters.',
  },
  recommendLabel: {
    id: 'dashboard.courseFeedback.recommendLabel',
    defaultMessage: 'Would you recommend this course?',
  },
  recommendYes: {
    id: 'dashboard.courseFeedback.recommendYes',
    defaultMessage: 'Yes',
  },
  recommendNo: {
    id: 'dashboard.courseFeedback.recommendNo',
    defaultMessage: 'No',
  },
  recommendSkip: {
    id: 'dashboard.courseFeedback.recommendSkip',
    defaultMessage: 'Prefer not to say',
  },
  cancel: {
    id: 'dashboard.courseFeedback.cancel',
    defaultMessage: 'Cancel',
  },
  submit: {
    id: 'dashboard.courseFeedback.submit',
    defaultMessage: 'Send feedback',
  },
  submitting: {
    id: 'dashboard.courseFeedback.submitting',
    defaultMessage: 'Sending...',
  },
  ratingRequired: {
    id: 'dashboard.courseFeedback.ratingRequired',
    defaultMessage: 'Please choose a rating.',
  },
  commentTooShort: {
    id: 'dashboard.courseFeedback.commentTooShort',
    defaultMessage: 'Please write a little more (at least {min} characters).',
  },
  genericError: {
    id: 'dashboard.courseFeedback.genericError',
    defaultMessage: 'Something went wrong and your feedback was not saved. Please try again.',
  },
});

export default messages;
