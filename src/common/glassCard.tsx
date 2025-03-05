import React, { ReactNode } from 'react';

const GlassCard = (props: { children: ReactNode; className?: string }) =>
{
    return (
        <div className={`p-1 ${props.className}`} style={styles.card}>
            {props.children}
        </div>
    );
};

const styles = {
    card: {
        background: 'rgba(138, 250, 146, 0.43)', // String value
        borderRadius: '16px', // String value
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // String value
        backdropFilter: 'blur(8.4px)', // Use camelCase
        WebkitBackdropFilter: 'blur(8.4px)', // Webkit prefix
        border: '1px solid rgba(138, 250, 146, 0.39)', // String value
    },
};

export default GlassCard;
