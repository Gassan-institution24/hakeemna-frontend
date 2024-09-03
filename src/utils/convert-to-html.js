import { Typography } from '@mui/material';
import { decode } from 'he';

export const ConvertToHTML = (data) => {
    if (data) {
        const decodedHTML = decode(data);
        return (
            <Typography variant="body2" sx={{ px: 3 }} dangerouslySetInnerHTML={{ __html: decodedHTML }} />
        );
    }
    return ''
}
