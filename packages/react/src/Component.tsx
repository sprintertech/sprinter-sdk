import { useEffect } from 'react';
import {useSprinterTokens} from "../lib/hooks.ts";

export function Component() {
  const hook = useSprinterTokens();

  useEffect(() => {
    hook.getAvailableTokens();
  }, []);

  return <div>A component</div>;
}
