import styled from 'styled-components'

export const ModalStyles = {
  style: {
    top: 20,
    border: 'none',
    boxShadow: 'none',
    marginBottom: 100,
  },
  maskStyle: { mask: { background: '#f2f3f4' } },
}

export const CNFormCommonStyles = {
  fontWeight: 'bold',
}

export const ModalStyle = styled.div`
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: #333;
    text-align: right;
    padding: 10px;
    z-index: 99;
    padding-left: 14px;
    padding-right: 18px;
    transition: all 0.3s ease !important;
  }
`
