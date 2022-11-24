import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


interface NavAccordionProps {
  details: React.ReactNode,
  title: string,
};

const NavAccordion: React.FC<NavAccordionProps> = (props) => {
  const { details, title } = props;
  const aria = `panel${title ? '_' + title : ''}`;

  return (
    <Accordion
      disableGutters={true}
      defaultExpanded={true}
    >
      <AccordionSummary
        aria-controls={`${aria}-content`}
        expandIcon={<ExpandMoreIcon color='primary' />}
        id={`${aria}-header`}
      >
        <Typography
          sx={(theme) => ({ fontSize: theme.typography.pxToRem(24) })}
          color='primary'
          variant='button'
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {details}
      </AccordionDetails>
    </Accordion>
  );
}

export default NavAccordion;
