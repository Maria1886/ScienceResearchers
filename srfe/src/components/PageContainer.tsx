import React from 'react';
import Header from './Header';

const PageContainer: React.FC = ({ children }) => {
    return (
        <>
            <br />
            <div className="container" style={{"minHeight" : "90vh"}}>
                {children}
            </div>
        </>
    );
}

export default PageContainer;