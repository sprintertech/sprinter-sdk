import React from "react";

import CodeSnippets from "@theme/ApiExplorer/CodeSnippets";
import Request from "@theme/ApiExplorer/Request";
import Response from "@theme/ApiExplorer/Response";
import SecuritySchemes from "@theme/ApiExplorer/SecuritySchemes";
import { ApiItem } from "docusaurus-plugin-openapi-docs/src/types";
import sdk from "postman-collection";

function ApiExplorer({
  item,
  infoPath,
}: {
  item: NonNullable<ApiItem>;
  infoPath: string;
}) {
  const postman = new sdk.Request(item.postman);

  return (
    <>
      <SecuritySchemes infoPath={infoPath} />
      <Request item={item} />
      <Response item={item} />
      {item.method !== "event" && (
        <CodeSnippets
          postman={postman}
          codeSamples={(item as any)["x-codeSamples"] ?? []}
        />
      )}
    </>
  );
}

export default ApiExplorer;
