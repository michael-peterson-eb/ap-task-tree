import { Container, Box, ThemeProvider } from "@mui/material";
import { ImpactAssessment } from "./components/ImpactAssessment";

import { customTheme } from "./style/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataProvider } from "./contexts/DataContext";
import { GlobalProvider } from "./contexts/GlobalContext";

export const queryClient = new QueryClient();

export default function App({ recordInfo: appParams }) {
  if (!appParams) return <div>Please provide params in BCIC Design Page to render the component</div>;

  let count = 0;

  const styleInterval = setInterval(() => {
    const viewModeParentContainer = window.document.getElementsByClassName("k-content k-state-active")[0] as HTMLElement;
    /** Set overflow to visible of one of the parent containers. This is necessary for the carousel to be sticky. The container style
     * we want to modify is not in the react application itself, which is in a parent container, so we need to access it via the DOM.
     * The interval is necessary to allow the view mode container to be rendered. This is preferential to timeout as we don't know
     * how long the view mode container will take to render.This is an ugly but necessary workaround. Count is used to prevent the
     * interval from running indefinitely.
     * */

    if (viewModeParentContainer && viewModeParentContainer.style) {
      viewModeParentContainer.style.overflow = "visible";
    }

    if (viewModeParentContainer?.style?.overflow === "visible" || count > 20) {
      clearInterval(styleInterval);
    }
  }, 500);

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
