import React from 'react';

import { logError } from '@edx/frontend-platform/logging';
import {
  Button,
  ModalDialog,
} from '@openedx/paragon';

import api from 'data/services/lms/api';
import urls from 'data/services/lms/urls';

import './index.scss';

/**
 * Learner-facing Microsoft Copilot Studio entry point.
 *
 * The LMS decides whether the feature is available and hosts the Web Chat
 * canvas.  This MFE only embeds that authenticated same-site canvas, so a
 * Copilot Direct Line token is never compiled into frontend assets.
 */
const AiAssistant = () => {
  const [assistant, setAssistant] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    api.fetchAiAssistantStatus()
      .then(({ data }) => {
        if (!cancelled && data.enabled) {
          setAssistant(data);
        }
      })
      // A disabled or temporarily unavailable assistant must not affect the
      // learner dashboard. It simply stays out of the interface.
      .catch((error) => { logError(error); });
    return () => { cancelled = true; };
  }, []);

  if (!assistant) {
    return null;
  }

  const chatUrl = urls.baseAppUrl(assistant.chat_url);

  return (
    <>
      <Button
        className="cloudswyft-ai-assistant__launcher"
        onClick={() => setIsOpen(true)}
        variant="primary"
      >
        Ask Cloudswyft AI
      </Button>
      <ModalDialog
        className="cloudswyft-ai-assistant__dialog"
        hasCloseButton
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={assistant.name}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>{assistant.name}</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body className="p-0">
          <iframe
            className="cloudswyft-ai-assistant__frame"
            src={chatUrl}
            title={assistant.name}
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
          />
        </ModalDialog.Body>
      </ModalDialog>
    </>
  );
};

export default AiAssistant;
