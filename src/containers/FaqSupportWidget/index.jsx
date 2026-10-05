import React from 'react';

import {
  Button,
  ModalDialog,
} from '@openedx/paragon';

import { FAQ_ITEMS, findFaqAnswer } from './faqData';
import './index.scss';

const SUGGESTED_QUESTIONS = FAQ_ITEMS.slice(0, 4);

const FaqSupportWidget = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [answer, setAnswer] = React.useState(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  const ask = (question) => {
    const normalizedQuestion = question.trim();
    setQuery(normalizedQuestion);
    setAnswer(findFaqAnswer(normalizedQuestion));
    setHasSearched(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    ask(query);
  };

  const reset = () => {
    setQuery('');
    setAnswer(null);
    setHasSearched(false);
  };

  return (
    <>
      <Button
        className="cloudswyft-faq-support__launcher"
        onClick={() => setIsOpen(true)}
        variant="primary"
      >
        Need help?
      </Button>
      <ModalDialog
        className="cloudswyft-faq-support__dialog"
        hasCloseButton
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); reset(); }}
        title="Cloudswyft Help"
      >
        <ModalDialog.Header>
          <ModalDialog.Title>Cloudswyft Help</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <p className="cloudswyft-faq-support__intro">
            Search our frequently asked questions. Your question stays in this browser and is not sent to an AI service.
          </p>
          <form onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="faq-support-question">Ask a frequently asked question</label>
            <div className="cloudswyft-faq-support__search">
              <input
                id="faq-support-question"
                onChange={event => setQuery(event.target.value)}
                placeholder="For example: I forgot my password"
                type="search"
                value={query}
              />
              <Button type="submit" variant="primary">Search</Button>
            </div>
          </form>

          {!hasSearched && (
            <div className="cloudswyft-faq-support__suggestions">
              <p>Common questions</p>
              {SUGGESTED_QUESTIONS.map(item => (
                <button key={item.id} onClick={() => ask(item.question)} type="button">
                  {item.question}
                </button>
              ))}
            </div>
          )}

          <div aria-live="polite" className="cloudswyft-faq-support__answer">
            {hasSearched && answer && (
              <>
                <h3>{answer.question}</h3>
                <p>{answer.answer}</p>
                <a href="/faq">Browse all FAQs</a>
              </>
            )}
            {hasSearched && !answer && (
              <>
                <h3>We could not find that in the FAQs</h3>
                <p>
                  For account, billing, technical, or course-specific help, please chat with the support team
                  through our contact form.
                </p>
                <a className="btn btn-primary" href="/contact">Contact support</a>
              </>
            )}
          </div>
        </ModalDialog.Body>
      </ModalDialog>
    </>
  );
};

export default FaqSupportWidget;
