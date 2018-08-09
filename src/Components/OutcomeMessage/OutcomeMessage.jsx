/* eslint-env browser */
/* eslint-disable react/no-typos */
/* eslint-disable react/forbid-prop-types */

import React, { Component } from 'react';
import propTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import Snippets from './templates/snippets.json';
import OutcomeCopy from './templates/outcome-copy.json';

const ReactMarkdown = require('react-markdown');
const shortid = require('shortid');

/**
 * OutcomeMessage class
 */
class OutcomeMessage extends Component {
  constructor(props) {
    super(props);

    this.handleJustInTime = this.handleJustInTime.bind(this);

    this.state = {
      isRejected: false,
      jitOpen: false,
    };
  }

  componentWillMount() {
    /* Cache our success values */
    let successValues = Object.values(this.props.location.state.successes);

    /* Format to a regex pattern */
    successValues = (successValues).map(i => '^' + i + '$').join('|');

    let isRejected = new RegExp(successValues).test('fail');
    const checksToDo = new RegExp(successValues).test('check');
    const theseResponses = this.props.location.state.responses;

    console.log('pre-check reject?:', isRejected);

    /* Only run if any of the users choices require additional logic */
    if (checksToDo) {
      /* This check represents our 'under 250k' choice */
      if (theseResponses.income === 'Under £250,000') {
        const sportCheck = theseResponses['sport-for-change'] === 'No';
        isRejected = sportCheck || isRejected;
      }
    }

    console.log('post-check reject?:', isRejected);

    this.state.isRejected = isRejected;

    /* Submit the form details, now we've completed all of our logic */
    this.submitInfo();
  }

  componentDidMount() {
    this.props.resize();
  }

  componentDidUpdate() {
    this.props.resize();
  }

  componentWillUnmount() {
    /* If the user is attempting to 'back button' away from the outcome to
     * re-enter question answers, reset the whole form */
    this.props.history.push({ pathname: '/' });
  }

  /**
   * Helper function to determine parent page url the form is embedded into
   */
  getParentUrl() {
    return (window.location !== window.parent.location)
      ? document.referrer : document.location.href;
  }

  handleJustInTime(e) {
    // Stop the hash from messing with React Router
    e.preventDefault();

    // Toggle class so we can update styling slightly
    document.getElementById(e.target.id).classList.toggle('active');

    // Toggle component state used by renderer
    this.setState({ jitOpen: !(this.state.jitOpen) });
  }

  /**
   * Handles submission to the message queues
   */
  submitInfo() {
    /* Cache question responses passed from Question component via Router */
    const allResponses = this.props.location.state.responses;
    const isSuccessful = !(this.state.isRejected);
    const endpointUrl = process.env.REACT_APP_ENDPOINT_URL + '/grants-eligibility/submit';
    const xhr = this.createCORSRequest('POST', endpointUrl);

    /* Construct json object only of values required by data contract */
    let postBody = {
      success: isSuccessful,
      transSourceURL: 'https://www.comicrelief.com/eligibility-checker',
      campaign: 'CR',
      transSource: 'CR_GrantsEligibility',
      organisation: allResponses.organisation,
      income: allResponses.income,
      locationWeFund: allResponses['location-we-fund'],
      sportForChange: allResponses['sport-for-change'],
      activityWeDontFund: allResponses['activity-we-dont-fund'],
    };

    postBody = JSON.stringify(postBody);

    if (!xhr) { throw new Error('CORS not supported'); }

    xhr.onerror = function () { console.log('There was an error'); };

    xhr.onreadystatechange = function () {
      if (xhr.status === 200 && xhr.readyState === 4) {
        console.log('post successful');
      }
    };

    const thisDomain = window.location.href;

    if (thisDomain.includes('localhost')) {
      console.log('Simulated local submit', postBody);
    } else {
      xhr.send(postBody);
    }
  }

  /* Helper function used during submission */
  createCORSRequest(method, url) {
    let xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== 'undefined') {
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // Otherwise, CORS is not supported by the browser.
      xhr = null;
    }
    xhr.setRequestHeader('Content-type', 'application/json');

    return xhr;
  }

  renderJit(renderedSnippets) {
    return (
      <div className="form__row form__row--just-in-time-block">
        <div className="form__fieldset">
          <a
            href="#show"
            aria-expanded="true"
            className="link toggle-link show-link"
            aria-label="click to open"
            id="show"
            onClick={this.handleJustInTime}
          >
            See how you answered:
          </a>
          { this.state.jitOpen ?
            <div className="just-in-time--content">
              <ul>{renderedSnippets}</ul>
            </div>
            : null
          }
        </div>
      </div>
    );
  }

  /**
   * Render the OutcomeMessage
   * @return {XML}
   */
  render() {
    const snippetsToShow = Object.values(this.props.location.state.snippets);

    const failOrSuccess = (this.state.isRejected ? 'fail' : 'success');

    /* Build our list items from the relevant snippets */
    const renderedSnippets = snippetsToShow.map(thisSnippet => (
      <li className={thisSnippet + ' ' + Snippets[thisSnippet].value} key={thisSnippet}> {Snippets[thisSnippet].copy} </li>));

    return (
      <div className={'outcome-wrapper outcome-' + failOrSuccess}>
        <header className="bg--blue promo-header promo-header--default promo-header--no-image">
          <div className="promo-header__content">
            <div className="promo-header__content-inner promo-header__content-inner--centre">
              <div className="cr-body">
                {OutcomeCopy[failOrSuccess].heading.map(thisHeading => (
                  <ReactMarkdown
                    key={shortid.generate()}
                    source={thisHeading}
                    className="font--white"
                    renderers={{ link: this.props.markdownLinkRenderer }}
                  />
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="outcome-message">
          <section className="single-msg single-msg--copy-only bg--white">
            <div className="single-msg__outer-wrapper">
              <div className="single-msg__copy_wrapper bg--white">
                <div className="single-msg__copy">
                  <div className="cr-body outcome-subheading text-align-center">

                    {/* Render the subheading */}
                    {OutcomeCopy[failOrSuccess].subheading.map(thisHeading => (
                      <ReactMarkdown
                        key={shortid.generate()}
                        source={thisHeading}
                        renderers={{ link: this.props.markdownLinkRenderer }}
                      />
                    ))}
                  </div>

                  {/* Render the snippets */}
                  <div className="cr-body snippets text-align-center">
                    {this.renderJit(renderedSnippets)}
                  </div>

                  {/* Render the first copy field */}
                  <div className="cr-body outcome-copy1 text-align-center">
                    {OutcomeCopy[failOrSuccess].copy1.map(thisCopy => (
                      <ReactMarkdown
                        key={shortid.generate()}
                        source={thisCopy}
                        renderers={{ link: this.props.markdownLinkRenderer }}
                      />
                    ))}
                  </div>

                  {/* Render the button field */}
                  <div className="cr-body outcome-button text-align-center">
                    <a
                      className="btn btn--red"
                      href={OutcomeCopy[failOrSuccess].button.link}
                      target="_blank"
                    >
                      {OutcomeCopy[failOrSuccess].button.text}
                    </a>
                  </div>

                  {/* Render the second copy field */}
                  <div className="cr-body outcome-copy2">
                    {OutcomeCopy[failOrSuccess].copy2.map(thisCopy => (
                      <ReactMarkdown
                        key={shortid.generate()}
                        source={thisCopy}
                        renderers={{ link: this.props.markdownLinkRenderer }}
                      />
                      ))}
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

OutcomeMessage.propTypes = {
  resize: propTypes.func,
  markdownLinkRenderer: propTypes.func,
  location: ReactRouterPropTypes.location,
  history: propTypes.shape({
    push: propTypes.func,
  }),
};

OutcomeMessage.defaultProps = {
  resize: propTypes.func,
  markdownLinkRenderer() { },
  history: { push: null },
  location: {},
};

export default OutcomeMessage;
