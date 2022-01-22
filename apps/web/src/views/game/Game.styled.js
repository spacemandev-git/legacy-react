import styled from 'styled-components';

export const _game = styled.div`
  min-width: 100%;
  width: 100%;
  min-height: ${({ $vh }) => `calc(${$vh}px * 100)`};
  height: ${({ $vh }) => `calc(${$vh}px * 100)`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2px;
`;
