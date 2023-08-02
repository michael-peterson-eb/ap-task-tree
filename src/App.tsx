import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import MultiStep from './MultiSteps';

export default function App({ recordInfo }) {
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 1 }}>
        <MultiStep recordInfo={recordInfo} />
      </Box>
    </Container>
  );
}