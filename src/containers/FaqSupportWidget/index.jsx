import React from 'react';

import {
  Button,
  ModalDialog,
} from '@openedx/paragon';

import { FAQ_ITEMS, findFaqAnswer, RECOMMENDED_QUESTIONS } from './faqData';
import './index.scss';

const SUGGESTED_QUESTIONS = RECOMMENDED_QUESTIONS
  .map(question => FAQ_ITEMS.find(item => item.question === question))
  .filter(Boolean);

const FaqSupportWidget = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [answer, setAnswer] = React.useState(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const answerTimer = React.useRef(null);

  React.useEffect(() => () => window.clearTimeout(answerTimer.current), []);

  const ask = (question) => {
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion || isTyping) {
      return;
    }
    window.clearTimeout(answerTimer.current);
    setQuery(normalizedQuestion);
    setAnswer(null);
    setHasSearched(true);
    setIsTyping(true);
    answerTimer.current = window.setTimeout(() => {
      setAnswer(findFaqAnswer(normalizedQuestion));
      setIsTyping(false);
    }, 550);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    ask(query);
  };

  const reset = () => {
    setQuery('');
    setAnswer(null);
    setHasSearched(false);
    setIsTyping(false);
    window.clearTimeout(answerTimer.current);
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
            Ask in your own words. The local FAQ assistant matches common phrases and keeps your
            question in this browser.
          </p>
          <form onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="faq-support-question">Ask a frequently asked question</label>
            <div className="cloudswyft-faq-support__search">
              <input
                disabled={isTyping}
                id="faq-support-question"
                onChange={event => setQuery(event.target.value)}
                placeholder="For example: I forgot my password"
                type="search"
                value={query}
              />
              <Button disabled={isTyping} type="submit" variant="primary">Search</Button>
            </div>
          </form>

          <div className="cloudswyft-faq-support__suggestions">
            <p>{hasSearched ? 'Recommended questions' : 'Try a recommended question'}</p>
            {SUGGESTED_QUESTIONS.map(item => (
              <button disabled={isTyping} key={item.id} onClick={() => ask(item.question)} type="button">
                {item.question}
              </button>
            ))}
          </div>

          {!hasSearched && <p className="cloudswyft-faq-support__tip">Tip: ask about enrollment, payments, certificates, or account access.</p>}

          <div aria-live="polite" className="cloudswyft-faq-support__answer">
            {isTyping && (
              <p className="cloudswyft-faq-support__typing" role="status">
                <span aria-hidden="true"><i /><i /><i /></span>
                Cloudswyft Help is typing
              </p>
            )}
            {hasSearched && !isTyping && answer && (
              <>
                <h3>{answer.question}</h3>
                <p>{answer.answer}</p>
                <a href="/faq">Browse all FAQs</a>
              </>
            )}
            {hasSearched && !isTyping && !answer && (
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
