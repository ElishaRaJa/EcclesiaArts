import React from 'react';
import { useHistory } from 'react-router-dom';

const BackButton = ({ label = 'Back' }) => {
    const history = useHistory();

    const handleBack = () => {
        history.goBack();
    };

    return (
        <button onClick={handleBack} style={styles.button}>
            {label}
        </button>
    );
};

const styles = {
    button: {
        padding: '10px 20px',
        margin: '10px',
        backgroundColor: '#007BFF',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

// Usage
// <BackButton label="Go Back" />

export default BackButton;