/* eslint-env browser */
/* eslint-disable react/no-typos */
/* eslint-disable react/forbid-prop-types */

import React, { Component } from 'react';
import propTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import Snippets from './templates/snippets.json';
import OutcomeHeading from './templates/outcome-headings.json';
import OutcomeCopy from './templates/outcome-copy.json';

const ReactMarkdown = require('react-markdown');

/**
 * OutcomeMessage class
 */
class OutcomeMessage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRejected: false,
    };
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
    const url = (window.location !== window.parent.location)
      ? document.referrer : document.location.href;
    return url;
  }

  /* Helper function to add custom rendered for Markdown links */
  markdownLinkRenderer(props) {
    return props.href.startsWith('/') ?
      <a href={props.href}>{props.children}</a> :
      <a href={props.href} target="_blank" rel="nofollow noopener noreferrer">{props.children}</a>;
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
      organisation: allResponses.company_name,
      success: isSuccessful,
      transSourceURL: 'https://www.comicrelief.com/eligibility-checker',
      campaign: 'CR',
      transSource: 'CR_GrantsEligibility',
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

  /**
   * Render the OutcomeMessage
   * @return {XML}
   */
  render() {
    /* IE-friendly check to see if any of our submissions contain a 'failure' */
    const allSuccesses = (this.props.location.state.successes).map(i => '^' + i + '$').join('|');

    /* Check for failures and checks */
    const isRejected = new RegExp(allSuccesses).test('fail');
    const checksToDo = new RegExp(allSuccesses).test('check');

    if (checksToDo) {
      console.log('CHECKS TO DO', this.props.location.state);
    }

    this.state.isRejected = isRejected;

    /* Submit the form details, now we've completed all of our logic */
    this.submitInfo();

    const snippetsToShow = this.props.location.state.snippets;

    const failOrSuccess = (isRejected ? 'fail' : 'success');

    /* Build our list items from the relevant snippets */
    const renderedSnippets = snippetsToShow.map(thisSnippet => (
      <li className={thisSnippet} key={thisSnippet}> {Snippets[thisSnippet].copy} </li>));

    return (
      <div className="outcome-message">

        <section className="single-msg single-msg--copy-only bg--white">
          <div className="single-msg__outer-wrapper">
            <div className="single-msg__copy_wrapper bg--white">
              <div className="single-msg__copy">
                <div className="single-msg__title text-align-center">
                  <ReactMarkdown
                    source={OutcomeHeading[failOrSuccess].copy}
                    className="outcome-heading"
                    renderers={{ link: this.markdownLinkRenderer }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="single-msg single-msg--copy-only single-msg--no-padding bg--white">
          <div className="single-msg__outer-wrapper">
            <div className="single-msg__copy_wrapper bg--white">
              <div className="single-msg__copy">
                <div className="single-msg__title text-align-center">
                  <h3>How you answered:</h3>
                  <ul>{renderedSnippets}</ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="single-msg single-msg--copy-only bg--white">
          <div className="single-msg__outer-wrapper">
            <div className="single-msg__copy_wrapper bg--white">
              <div className="single-msg__copy">
                <div className="single-msg__title text-align-center">
                  <ReactMarkdown
                    source={OutcomeCopy[failOrSuccess].copy}
                    className="outcome-copy"
                    renderers={{ link: this.markdownLinkRenderer }}

                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

OutcomeMessage.propTypes = {
  resize: propTypes.func,
  location: ReactRouterPropTypes.location,
  history: propTypes.shape({
    push: propTypes.func,
  }),

};

OutcomeMessage.defaultProps = {
  resize: propTypes.func,
  history: { push: null },
  location: {},
};

export default OutcomeMessage;
