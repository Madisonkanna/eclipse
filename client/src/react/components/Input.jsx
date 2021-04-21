import React from 'react';

const Input = ({label, placeholder, defaultVal, inputRef, onChange, onFocus}) => {

    return (
        <div className="Input">
            {label ? <label>{label}</label> :  null}
            <input 
                placeholder={placeholder}
                defaultVal={defaultVal}
                ref={inputRef}
                onChange={onChange}
                onFocus={onFocus}
            />
        </div>
    )
}
export default Input