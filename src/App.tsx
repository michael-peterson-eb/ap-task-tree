import { Container, Box, ThemeProvider } from "@mui/material";
import { ImpactAssessment } from "./components/ImpactAssessment";

import { customTheme } from "./style/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataProvider } from "./contexts/DataContext";
import { GlobalProvider } from "./contexts/GlobalContext";

export const queryClient = new QueryClient();

export default function App({ recordInfo: appParams }) {
  if (!appParams) return <div>Please provide params in BCIC Design Page to render the component</div>;

  const viewModeParentContainer = window.document.getElementsByClassName("k-content k-state-active")[0];

  setTimeout(() => {
    /** Remove overflow from view mode parent container, this is necessary for the carousel to be sticky. The container style
     * we want to modify is not in the react application itself. It is in a parent container, so we need to access it via the DOM.
     * The timeout is necessary to allow the view mode container to be rendered before we can access it. This is an ugly but
     * necessary workaround.
     * */

    //@ts-expect-error
    viewModeParentContainer.style.overflow = "visible";
  }, 1000);

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ m: 1 }}>
        <ThemeProvider theme={customTheme}>
          <QueryClientProvider client={queryClient}>
            <DataProvider appParams={appParams}>
              <GlobalProvider appParams={appParams}>
                <ImpactAssessment />
              </GlobalProvider>
            </DataProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </Box>
    </Container>
  );
}
