import React from "react";
import Link from "next/link";
import IntlMessages from "../../../../util/IntlMessages";

const Forbidden = () => (
  <div className="gx-page-error-container">
    <div className="gx-page-error-content" style={{ width: "100%" }}>
      <div className="gx-error-code gx-mb-4" style={{ color: "red" }}>
        Forbidden
      </div>
      <h2 className="gx-text-center">
        <IntlMessages id="extraPages.forbidden" />
      </h2>
      <p className="gx-text-center">
        <Link className="gx-btn gx-btn-primary" href="/"><a><IntlMessages id="extraPages.logout" /></a></Link>
      </p>
    </div>
  </div>
);

export default Forbidden;
