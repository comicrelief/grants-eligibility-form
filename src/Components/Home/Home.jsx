import React, { Component } from 'react';
import propTypes from 'prop-types';

/**
 * Home class
 */
class Home extends Component {
  /**
   * Home constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.handleStartForm = this.handleStartForm.bind(this);
  }

  /**
   * Render the Home
   * @return {XML}
   */
  render() {
    return (
        <div>
          <p>Thanks for using our eligibility checker. We’re going to ask you a few questions about your organisation and what you need funding for. We’ll use these answers to see whether you might be eligible for an open initiative.</p>
          
          <button onClick={() => this.handleStartForm()} className="btn btn--red">Start</button>
        </div>
    );
  }

  handleStartForm() {
    this.props.history.push({
      pathname: `/question/1`,
    });
  }
}

Home.propTypes = {
  history: propTypes.shape({
    push: propTypes.func,
  }),
};

Home.defaultProps = {
  history: { push: null },
};

export default Home;
