import { useContext } from 'react';

import { WebRTCContext } from './web-rtc-context';

// ----------------------------------------------------------------------

export const useWebRTC = () => {
    const context = useContext(WebRTCContext);

    if (!context) throw new Error('useWebRTC context must be use inside AuthProvider');

    return context;
};
