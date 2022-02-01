import React, { useEffect } from 'react';
import {
  _create,
  _description,
  _import,
  _login,
  _pubKey,
} from '../Login/Login.styled';

const ActionsDemo = ({ player }) => {
  useEffect(() => {
    console.log(player);
  }, [player]);
  return (
    <_login>
      {player ? (
        <>
          <_description>
            Hello {player.name}, you have {player.cards?.length} cards!!! and
            reddemable cards: {player.redeemableCards?.length}
          </_description>
        </>
      ) : null}
    </_login>
  );
};

export default ActionsDemo;
