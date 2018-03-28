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

  handleStartForm() {
    this.props.history.push({
      pathname: '/question/1',
    });
  }

  /**
   * Render the Home
   * @return {XML}
   */
  render() {
    return (
      <div>
        <header className="bg--red promo-header promo-header--default   promo-header--no-image">
          <div className="promo-header__content">
            <div className="promo-header__content-inner promo-header__content-inner--centre">
              <div className="cr-body">
                <h1 className="font--white text-align-center">Find out if you&#39;re eligible</h1>
              </div>
            </div>
          </div>
        </header>
        <main role="main">
          <section className="paragraph single-msg single-msg--copy-only bg--white">
            <div className="single-msg__outer-wrapper">
              <div className="single-msg__copy_wrapper bg--white">
                <div className="single-msg__copy">
                  <div className="single-msg__body">
                    <div className="cr-body">
                      <h4>
                        Thanks for using our eligibility checker. We&#39;re
                        going to ask you a few questions
                        about your organisation and what you need funding for.
                      </h4>
                      <h4>
                        We&#39;ll use these answers to see whether
                        you might be eligible for an open initiative.
                      </h4>
                      <p className="text-align-center">
                        <button
                          onClick={() => this.handleStartForm()}
                          className="btn btn--red"
                        >
                          Get started
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
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
