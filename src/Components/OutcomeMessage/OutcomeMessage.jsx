/* eslint-env browser */
/* eslint-disable react/no-typos */
/* eslint-disable react/forbid-prop-types */

import React, { Component } from 'react';
import propTypes from 'prop-types';
// import Parser from 'html-react-parser';
import ReactRouterPropTypes from 'react-router-prop-types';
import Snippets from './templates/snippets.json';

// Import all of our template variants
/* import m1 from './templates/m1.html'; */
/* import m2 from './templates/m2.html'; */
/* import m3 from './templates/m3.html'; */
/* import m4 from './templates/m4.html'; */

/**
 * OutcomeMessage class
 */
class OutcomeMessage extends Component {
  /**
   * Trigger our submission when this component mounts, at the end of the journey
   */
  componentWillMount() {
    // Submission endpoint from env file
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
    const url = (window.location !== window.parent.location)
      ? document.referrer : document.location.href;
    return url;
  }
  /**
   * Handles submission to the message queues
   */
  submitInfo() {
    /* Cache question responses passed from Question component via Router */
    const allResponses = this.props.location.state.responses;
    const endpointUrl = process.env.REACT_APP_ENDPOINT_URL + '/grants-eligibility/submit';
    const xhr = this.createCORSRequest('POST', endpointUrl);

    // console.log('responses:', allResponses);
    // console.log('responses.snippets:', allResponses.snippets);

    /* Construct json object only of values required by data contract */
    let postBody = {
      organisation: allResponses.company_name,
      success: allResponses.success ? 1 : 0,
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
      // console.log('postBody', postBody);
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
    // console.log('copy', Snippets.snippet1.copy);
    /* to remove, just to keep logic happy
    let currentMessage = 1; */

    const snippetsToShow = this.props.location.state.responses.snippets;

    // currentMessage = currentMessage.toString();

    /* Build our list items from the relevant snippets */
    const renderedSnippets = snippetsToShow.map(thisSnippet => (
      <li>
        {Snippets[thisSnippet].copy}
      </li>));

    return (
      <div className="outcome-message">

        <ul>
          {renderedSnippets}
        </ul>

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
  resize() { },
  history: { push: null },
  // messages: [m1, m2, m3, m4],
  location: {},
};

export default OutcomeMessage;
