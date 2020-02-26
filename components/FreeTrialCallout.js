import React, { Component } from 'react';
import cn from 'classnames';

export default ({ text }) => (
  <span
    className={cn({
      'order-card__free-trial-callout': true,
      'order-card__free-trial-callout--long': text.length > 45
    })}
  >
    {text}
  </span>
);
