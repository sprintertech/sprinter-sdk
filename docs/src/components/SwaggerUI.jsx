import React from "react";
import { RedocStandalone } from "redoc";

export default function SwaggerUI({ specUrl }) {
  return (
    <div className="swagger-container">
      <RedocStandalone
        specUrl={specUrl}
        options={{
          nativeScrollbars: true,
          theme: {
            sidebar: {
              width: "0px",
            },
            rightPanel: {
              backgroundColor: "#808080",
              width: "650px", // try reducing width
            },
          },
          hideDownloadButton: true,
          disableSearch: true,
          hideLoading: false,
          hideHostname: true,
          hideSchemaExpansion: "true",
          hideSingleRequestSampleTab: true,
          expandResponses: "all",
          hideRequestPayloadSample: false,
        }}
      />
    </div>
  );
}
