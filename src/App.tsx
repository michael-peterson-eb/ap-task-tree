import "bcic-shared-ui/styles.css";
import { Button } from "bcic-shared-ui";

export default function App() {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return (
    <div>
      <div>App container</div>
      <Button onClick={handleClick}>Test</Button>
      {/* <Select options={severityChips} /> */}
    </div>
  );
}
