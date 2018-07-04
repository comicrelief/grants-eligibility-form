/* eslint-env browser */
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

  componentDidMount() {
    this.props.resize();
  }

  componentDidUpdate() {
    this.props.resize();
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
        <header className="bg--red promo-header promo-header--default  promo-header--no-image">
          <div className="promo-header__content">
            <div className="promo-header__content-inner promo-header__content-inner--centre">
              <div className="cr-body">
                <h1 className="font--white text-align-center">Find out if you&#39;re eligible</h1>
              </div>
            </div>
          </div>
        </header>
        <main role="main">
          <section className="paragraph single-msg single-msg--copy-only bg--white home question">
            <div className="single-msg__outer-wrapper">
              <div className="single-msg__copy_wrapper bg--white">
                <div className="single-msg__copy">
                  <div className="single-msg__body">
                    <div className="cr-body text-align-center">
                      <h3>You can use our eligibility checker to find
                      out if you might be eligible for any of our initiatives.
                      </h3>
                      <h3>
                        We&#39;ll use your answers to a few questions
                        about your organisation and what you
                        need funding for to do this.
                      </h3>
                      <div className="buttons text-align-center">
                        <button
                          onClick={() => this.handleStartForm()}
                          className="btn btn--red"
                        >
                          Get started
                        </button>
                      </div>
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
  resize: propTypes.func,
  history: propTypes.shape({
    push: propTypes.func,
  }),
};

Home.defaultProps = {
  resize() { },
  history: { push: null },
};

export default Home;
