import "./footer.style.css"
import {HealthProvider} from "../../providers/health/health.provider.tsx";
import {Health} from "./health.component.tsx";

export function Footer() {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();


  return (
    <footer className={"footer-component"}>
      <div className={"footer-component-container container"}>
        <div className={"footer-component-item"}>
          <p style={{marginBottom: "42px"}}>
            Copyright © {startYear}{currentYear === startYear ? '' : ` - ${currentYear}`} FunkWeb.
            All rights reserved.
          </p>
        </div>
        <div className={"footer-component-item"}>
          <HealthProvider>
            <Health/>
          </HealthProvider>
        </div>
      </div>
    </footer>
  );
}
