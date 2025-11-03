import {useHealth} from "../../providers/health/health.context.tsx";
import {Button} from "../button/button.component.tsx";

export function Health() {
  const {health, refresh, loading, error} = useHealth();

  // TODO: should we return "checking health..." or not (?)
  if (loading) return <p>Checking health...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
<div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "10px",
  padding: "10px",  
  height: "10%",
  borderRadius: "8px"
}}>
  <span style={{ fontWeight: "500" }}>
    Status: <strong>{health?.status}</strong> — Uptime: <strong>{health?.uptime.toFixed(1)}s</strong>
  </span>
  <Button style={{ minWidth: "100px", height: "50px" }} onClick={refresh}>
    Refresh
  </Button>
</div>
  )
}
