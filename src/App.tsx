import { Container, Box, ThemeProvider } from "@mui/material";
import { ImpactAssessment } from "./components/ImpactAssessment";

import { customTheme } from "./style/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataProvider } from "./contexts/DataContext";
import { GlobalProvider } from "./contexts/GlobalContext";

const queryClient = new QueryClient();

export default function App({ recordInfo }) {
  if (!recordInfo) return <div>Please provide params in BCIC Design Page to render the component</div>;

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ m: 1 }}>
        <ThemeProvider theme={customTheme}>
          <QueryClientProvider client={queryClient}>
            <DataProvider recordInfo={recordInfo}>
              <GlobalProvider appParams={recordInfo}>
                <ImpactAssessment />
              </GlobalProvider>
            </DataProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </Box>
    </Container>
  );
}
