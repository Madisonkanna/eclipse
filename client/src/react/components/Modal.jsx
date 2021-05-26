import React from 'react'

const Modal = ({visible, body}) => {
    console.log('visible', visible)
    return (
        <div
            className={`Modal ${visible ? 'visible' : null }`}
            >

            {visible ? body : null}
        </div>
    )
}

export default Modal