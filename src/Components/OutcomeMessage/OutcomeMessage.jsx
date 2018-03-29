/* eslint-env browser */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import Parser from 'html-react-parser';

// Import all of our template variants
import m1 from './templates/m1.html';
import m2 from './templates/m2.html';
import m3 from './templates/m3.html';
import m4 from './templates/m4.html';
import m5 from './templates/m5.html';
import m6 from './templates/m6.html';
import m7 from './templates/m7.html';
import m8 from './templates/m8.html';
import m9 from './templates/m9.html';
import m10 from './templates/m10.html';
import m11 from './templates/m11.html';
import m12 from './templates/m12.html';
import m13 from './templates/m13.html';
import m14 from './templates/m14.html';
import m15 from './templates/m15.html';

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

    /* Get the current parent URL and the endpoint URL for submitting to */
    const thisURL = this.getParentUrl();
    const endpointUrl = process.env.REACT_APP_ENDPOINT_URL + '/grants-eligibility/submit';
    const xhr = this.createCORSRequest('POST', endpointUrl);

    /* Construct json object only of values required by data contract */
    let postBody = {
      organisation: allResponses['organisation-type'],
      success: allResponses.success ? 1 : 0,
      transSourceURL: thisURL,
      created: new Date().getTime(),
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

    xhr.send(postBody);
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
    /* Convert the current number to suit our zero-indexed array of messages */
    let currentMessage = this.props.match.params.outcome_number - 1;

    currentMessage = currentMessage.toString();

    console.log('currentMsg:', currentMessage);

    return (
      <div className="outcome-message">
        {Parser(this.props.messages[currentMessage])}
        <section className="single-msg single-msg--copy-only bg--white apply-footer">
          <div className="single-msg__outer-wrapper">
            <div className="single-msg__copy_wrapper bg--white">
              <div className="single-msg__copy">
                <div className="single-msg__title text-align-center">
                  <h3>You can find more information in</h3>
                  <h3>
                    <a className="link link--dark-purple inline" target="_blank" rel="noopener noreferrer" href="https://www.comicrelief.com/funding/applying-for-grants/guidance">
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
  messages: propTypes.element,
  match: propTypes.shape({
    params: propTypes.shape({
      outcome_number: propTypes.string,
    }),
  }),
  location: propTypes.shape({
    state: propTypes.shape({
      responses: propTypes.shape,
    }),
  }),
};

OutcomeMessage.defaultProps = {
  messages: [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15],
  match: {},
  location: {},
};

export default OutcomeMessage;
