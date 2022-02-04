import React from 'react';
import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_TEST } from 'core/remix/state';
import { subscriber } from 'web/client';
import eye from 'design/assets/lance-overdose-loader-eye.png';

const CardProps = (scene) => {
  const setState = (next_state) => {
    subscriber.next(next_state);
  };

  const getCards = () => {
    const state = subscriber.getValue();

    // do some call for the cards
    const spoof_cards = [
      {
        id: 'first_card',
        url: eye,
      },
      {
        id: 'second-card',
        url: eye,
      },
      {
        id: 'third-card',
        url: eye,
      },
      {
        id: 'fourth-card',
        url: eye,
      },
      {
        id: 'fifth-card',
        url: eye,
      },
      {
        id: 'sixth-card',
        url: eye,
      },
      {
        id: 'seventh-card',
        url: eye,
      },
      {
        id: 'eighth-card',
        url: eye,
      },
    ];
    setState({ ...state, cards: spoof_cards });
  };

  scene.prototype.props = {
    setState,
    getCards,
  };

  return scene;
};

export default CardProps;
