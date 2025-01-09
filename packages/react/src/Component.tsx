import { useEffect } from "react";
import { useSprinterTokens } from "../lib/hooks.ts";

export function Component() {
  const hook = useSprinterTokens();

  useEffect(() => {
    hook.getAvailableTokens();
  }, [hook]);

  return <div>A component</div>;
}
