import React from 'react';

import Box from '@mui/material/Box';

export default function FamilyMembers() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      marginTop="50px"
    >
      <Box textAlign="center" margin="10px" padding="10px" border="2px solid #333" borderRadius="8px">
        <div style={{ fontWeight: 'bold' }}>Test</div>
        <div style={{ color: '#555' }}>Father</div>
        <Box
          marginTop="10px"
          display="flex"
          justifyContent="space-around"
          borderTop="2px solid #555"
          paddingTop="10px"
        >
          <Box textAlign="center" margin="10px" padding="10px" border="2px solid #333" borderRadius="8px">
            <div style={{ fontWeight: 'bold' }}>Test</div>
            <div style={{ color: '#555' }}>Daughter</div>
          </Box>
          <Box textAlign="center" margin="10px" padding="10px" border="2px solid #333" borderRadius="8px">
            <div style={{ fontWeight: 'bold' }}>Test</div>
            <div style={{ color: '#555' }}>Son</div>
          </Box>
        </Box>
      </Box>
      {/* Add more family members as needed */}
    </Box>
  );
}
