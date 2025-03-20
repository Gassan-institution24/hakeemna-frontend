import { decode } from 'he';

import { Typography } from '@mui/material';

export const ConvertToHTML = (data) => {
  if (data) {
    const decodedHTML = decode(data);
    return (
      <Typography
        variant="body2"
        sx={{ px: 3 }}
        dangerouslySetInnerHTML={{ __html: decodedHTML }}
      />
    );
  }
  return '';
};

export const HTMLToText = (data) => {
  if (data) {
    const decodedHTML = decode(data);

    // Create a temporary element to extract text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = decodedHTML;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    return {
      html: (
        <Typography
          variant="body2"
          sx={{ px: 3 }}
          dangerouslySetInnerHTML={{ __html: decodedHTML }}
        />
      ),
      text: plainText, // return plain text as a string
    };
  }
  return { html: '', text: '' };
};
