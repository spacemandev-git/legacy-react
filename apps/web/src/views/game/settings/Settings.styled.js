import styled from 'styled-components';

export const _settings = styled.div`
  border: 1px solid ${({ theme }) => theme.settings['border']};
  border-radius: 8px;
  color: ${({ theme }) => theme.settings['font']};
  padding: 16px;
`;
