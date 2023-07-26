import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import MultiStep from './MultiSteps';

export default function App({recordInfo}) {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h3" gutterBottom>
          Impact Assessment - POC
        </Typography>
        <MultiStep recordInfo={recordInfo}/>
      </Box>
    </Container>
  );
}