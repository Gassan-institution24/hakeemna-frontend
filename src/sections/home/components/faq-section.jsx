import PropTypes from 'prop-types';

import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// Each FAQ item is generated only when the underlying field is actually present in the data -
// no generic boilerplate questions are shown without a real answer.
export default function FaqSection({ items }) {
  const validItems = items?.filter((item) => item?.question && item?.answer);

  if (!validItems?.length) {
    return null;
  }

  return (
    <div>
      {validItems.map((item, index) => (
        <Accordion key={index} disableGutters>
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle2">{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

FaqSection.propTypes = {
  items: PropTypes.array,
};
