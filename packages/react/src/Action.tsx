import { useSprinterBalances } from "../lib/hooks.ts";

export function Action() {
  const hook = useSprinterBalances(
    "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519"
  );
  return (
    <button
      onClick={() => {
        hook.getUserBalances();
        hook.getUserBalances();
      }}
    >
      Action
    </button>
  );
}
