import React from 'react';
import { AppContext } from '@edx/frontend-platform/react';

import {
  Chip,
  Form,
  FormControl,
  FormControlFeedback,
  FormLabel,
  FormGroup,
  IconButton,
  StatefulButton,
  Icon,
} from '@openedx/paragon';
import { Close, KeyboardArrowUp, PersonSearch } from '@openedx/paragon/icons';

import messages from './messages';
import { useMasqueradeBarData } from './hooks';
import './index.scss';

export const MasqueradeBar = () => {
  const { authenticatedUser } = React.useContext(AppContext);

  const {
    canMasquerade,
    isMasquerading,
    isMasqueradingFailed,
    isMasqueradingPending,
    masqueradeInput,
    masqueradeErrorMessage,
    handleMasqueradeInputChange,
    handleClearMasquerade,
    handleMasqueradeSubmit,
    isCollapsed,
    handleToggleCollapsed,
    formatMessage,
  } = useMasqueradeBarData({ authenticatedUser });

  if (!canMasquerade) { return null; }

  // Minimized, the bar keeps a thin strip with the person-search icon on it
  // rather than disappearing: an icon that depicts the tool is findable again,
  // where a bar that vanishes completely is not.
  if (isCollapsed) {
    return (
      <div className="w-100 shadow-sm px-2">
        <div className="masquerade-bar masquerade-bar--collapsed">
          <IconButton
            className="masquerade-toggle"
            type="button"
            size="sm"
            src={PersonSearch}
            iconAs={Icon}
            alt={formatMessage(messages.ExpandBar)}
            aria-expanded={false}
            onClick={handleToggleCollapsed}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 shadow-sm px-2">
      <Form className="masquerade-bar w-100">
        {isMasquerading ? (
          <>
            <FormLabel inline className="masquerade-form-label">
              <Icon src={PersonSearch} />
              {formatMessage(messages.ViewingAs)}
            </FormLabel>
            <Chip
              className="masquerade-chip"
              iconAfter={Close}
              onClick={handleClearMasquerade}
            >
              {masqueradeInput}
            </Chip>
          </>
        ) : (
          <>
            <FormLabel inline id="masquerade-form-label" className="masquerade-form-label">
              <Icon src={PersonSearch} />
              {formatMessage(messages.ViewAs)}
            </FormLabel>
            <FormGroup isInvalid={isMasqueradingFailed} className="masquerade-form-input">
              {/*
                A placeholder rather than Paragon's floatingLabel: the label
                animates up out of the field and over its own top border, which
                in a one-line bar sitting between the header and the hero reads
                as text floating loose on the page. The field is still named
                for assistive tech by the "View as:" label it already points
                at through aria-labelledby.
              */}
              <FormControl
                value={masqueradeInput}
                onChange={handleMasqueradeInputChange}
                placeholder={formatMessage(messages.StudentNameInput)}
                aria-labelledby="masquerade-form-label"
              />
              {isMasqueradingFailed && (
                <FormControlFeedback type="invalid" hasIcon={false}>
                  {formatMessage(masqueradeErrorMessage)}
                </FormControlFeedback>
              )}
            </FormGroup>
            <StatefulButton
              disabled={!masqueradeInput.length}
              variant="brand"
              onClick={handleMasqueradeSubmit(masqueradeInput)}
              labels={{
                default: formatMessage(messages.SubmitButton),
              }}
              className="mr-3"
              state={isMasqueradingPending ? 'pending' : 'default'}
              type="submit"
            />
          </>
        )}
        {/*
          `type="button"`, because a bare <button> inside a <form> defaults to
          submit and minimizing the bar would otherwise try to masquerade.
          Hidden while masquerading: there is nothing to minimize then, and the
          hook refuses to collapse in that state anyway.
        */}
        {!isMasquerading && (
          <IconButton
            className="masquerade-toggle"
            type="button"
            size="sm"
            src={KeyboardArrowUp}
            iconAs={Icon}
            alt={formatMessage(messages.MinimizeBar)}
            aria-expanded
            onClick={handleToggleCollapsed}
          />
        )}
      </Form>
    </div>
  );
};

export default MasqueradeBar;
