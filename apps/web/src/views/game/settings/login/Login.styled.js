import styled from 'styled-components';

export const _login = styled.div`
  border: 1px solid ${({ theme }) => theme.settings['border']};
  border-radius: 8px;
  color: ${({ theme }) => theme.settings['font']};
  padding: 16px;

  margin-bottom: 32px;
`;

export const _create = styled.button`
  margin-right: 16px;
  padding: 4px 8px;
`;

export const _import = styled.input`
  border: none;
  background: none;
  color: ${({ theme }) => theme.settings['font']};
  margin-right: 16px;
`;

export const _pubKey = styled.div`
  margin-top: 16px;
`;

export const _description = styled.p`
  padding-bottom: 8px;
  color: gray;
`;
