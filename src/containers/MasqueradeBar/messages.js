import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  ViewAs: {
    id: 'MasqueradeBar.ViewAs',
    defaultMessage: 'View as: ',
    description: 'Label for the View as',
  },
  ViewingAs: {
    id: 'MasqueradeBar.ViewingAs',
    defaultMessage: 'Viewing as: ',
    description: 'Label for the Viewing as',
  },
  SubmitButton: {
    id: 'MasqueradeBar.SubmitButton',
    defaultMessage: 'Submit',
    description: 'Label for the Submit button',
  },
  StudentNameInput: {
    id: 'MasqueradeBar.StudentNameInput',
    defaultMessage: 'Username or email',
    description: 'Label for the Student Name or email input',
  },
  MinimizeBar: {
    id: 'MasqueradeBar.MinimizeBar',
    defaultMessage: 'Minimize the view as controls',
    description: 'Alt text for the button that minimizes the masquerade bar',
  },
  ExpandBar: {
    id: 'MasqueradeBar.ExpandBar',
    defaultMessage: 'Show the view as controls',
    description: 'Alt text for the button that reopens the minimized masquerade bar',
  },
  NoStudentFound: {
    id: 'MasqueradeBar.NoStudentFound',
    defaultMessage: 'No student with this username or email could be found',
    description: 'Error message when no student is found',
  },
  UnknownError: {
    id: 'MasqueradeBar.UnknownError',
    defaultMessage: 'An unknown error occurred',
    description: 'Error message when an unknown error occurs',
  },
});

export default messages;
