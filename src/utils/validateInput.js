import React from 'react'

export const required = (value) => {
  if (!value.toString().trim().length) {
    return <span className={'input-error'}>Bắt buộc nhập.</span>;
  }
};
export const minLength = (value) => {
    if (value.length < 5) {
        return <span className={'input-error'}>Ít nhất 5 ký tự.</span>;
    }
}
export const maxLength = (value) => {
    if (value.length > 20) {
        return <span className={'input-error'}>Tối đa 20 ký tự.</span>;
    }
}

export const alpha = (value) => {
  if(/[^0-9a-zA-Z]/.test(value)) {
      return <span className={'input-error'}>Không được có dấu và ký tự đặc biệt.</span>;
  }
}

export const lt = (value, props) => {
    if (value.length < props.minLength) {
        return <span className={'input-error'}>Ít nhất {props.minLength} ký tự.</span>;
    }
}