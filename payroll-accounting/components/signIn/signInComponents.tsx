import styled from "styled-components";

export const SignInContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;

export const SignInRight = styled.div`
  width: 40%;
  height: 100%;
  position: relative;
  background-color: #00b5ad !important;
  color: #fff !important;

  display: none;

  @media (min-width: 893px) {
    display: block;
  }
`;

export const SingInRightContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 25px;
`;

export const SignInLeft = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  position: relative;

  @media (min-width: 893px) {
    width: 60%;
    padding: 25px;
  }
`;

export const SingInLeftContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 25px;
  width: 100%;
  height: 100%;
  position: relative;

  @media (min-width: 893px) {
    padding: 50px;
  }
`;
