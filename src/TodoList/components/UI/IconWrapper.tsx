import styled from 'styled-components';

export const IconWrapper = styled.div`
  width: 30px;
  height: 30px;

  & .MuiSvgIcon-root {
    transition: 200ms;
    color: #808080;

    &:hover {
      color: #1976d2;
      cursor: pointer;
    }
  }
`;
