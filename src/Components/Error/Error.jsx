/* eslint-env browser */
import React from 'react';

function Error() {
  return (
    <header className="bg--white promo-header promo-header--default promo-header--no-image">
      <div className="promo-header__content">
        <div className="promo-header__content-inner promo-header__content-inner--centre">
          <div className="cr-body">
            <h2 className="font--black text-align-center">
              We&#39;re sorry, there&#39;s been an error with your submission.
            </h2>
            <h3 className="font--black text-align-center">
              Please refresh the page and try again.
            </h3>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Error;
