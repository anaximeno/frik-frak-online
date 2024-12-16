import styled from "styled-components";

export const HelloWorldWrapper = styled.h1`
  color: #eee;
  text-shadow: 0px 1.5px 0.18rem #007bff,
                -1.5px 0px 0.18rem #00cc00,
                 1.5px -1.5px 0.18rem #dc3545;

  &:hover {
    cursor: grab;
    text-shadow: 0px 1.5px 0.35rem #007bff,
                  -1.5px 0px 0.35rem #00cc00,
                  1.5px -1.5px 0.35rem #dc3545;
  }
`;


