/* eslint-env browser */
/* eslint-disable react/no-typos */
/* eslint-disable react/forbid-prop-types */

import React, { Component } from 'react';
import propTypes from 'prop-types';
// import Parser from 'html-react-parser';
import ReactRouterPropTypes from 'react-router-prop-types';
import Snippets from './templates/snippets.json';

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
  /**
   * Handles submission to the message queues
   */
  submitInfo() {
    console.log('submit info', this.state);

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
    let isRejected = this.props.location.state.successes;

    /* IE-friendly check to see if any of our submissions contain a 'failure' */
    isRejected = isRejected.map(i => '^' + i + '$').join('|');
    isRejected = new RegExp(isRejected).test('no');

    console.log('isRejected? ', isRejected);

    this.state.isRejected = isRejected;

    // Submit the form details, now we've done all our logic
    this.submitInfo();

    const snippetsToShow = this.props.location.state.snippets;

    /* Build our list items from the relevant snippets */
    const renderedSnippets = snippetsToShow.map(thisSnippet => (
      <li key={thisSnippet}>
        {Snippets[thisSnippet].copy}
      </li>));

    return (
      <div className="outcome-message">

        <section className="single-msg single-msg--copy-only bg--white apply-footer">
          <div className="single-msg__outer-wrapper">
            <div className="single-msg__copy_wrapper bg--white">
              <div className="single-msg__copy">
                <div className="single-msg__title text-align-center">
                  <ul>{renderedSnippets}</ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* {Parser(this.props.messages[currentMessage])} */}
        <section className="single-msg single-msg--copy-only bg--white apply-footer">
          <div className="single-msg__outer-wrapper">
            <div className="single-msg__copy_wrapper bg--white">
              <div className="single-msg__copy">
                <div className="single-msg__title text-align-center">
                  <h3>You can find more information in</h3>
                  <h3>
                    <a
                      className="link link--dark-purple inline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.comicrelief.com/funding/applying-for-grants/guidance"
                    >
                    &#39;Guidance on applying&#39;
                    </a>
                    .
                  </h3>
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
  // messages: propTypes.array,
  history: propTypes.shape({
    push: propTypes.func,
  }),

};

OutcomeMessage.defaultProps = {
  resize: propTypes.func,
  history: { push: null },
  // messages: [m1, m2, m3, m4],
  location: {},
};

export default OutcomeMessage;
