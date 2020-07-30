
import React from 'react';
import './index.scss'
const Hover = ({ onHover, children, className }) => (
    <div className={`${className} hover`}>
        {children}
        {/* <div className="hover__no-hover">{children}</div> */}
        <div className="hover__hover">{onHover}</div>
    </div>
)
export default Hover;
