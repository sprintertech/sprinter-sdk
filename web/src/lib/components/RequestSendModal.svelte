<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import {Accordion, AccordionItem, getModalStore, ListBox, ListBoxItem} from '@skeletonlabs/skeleton';
  import {hacks_getChainIcon} from "$lib/hacks";

  // Props
  /** Exposes parent props to this component. */
  export let parent: SvelteComponent;

  // selections
  let selectedToke;
  let selectedNetwork;
  //
  let whitelisted: string[] = [];

  // inputs
  let amount: number;
  let threshold: number;

  $: whitelisted, console.log(whitelisted);

  let balances;
  $: if (selectedToke) {

    console.log("dis!");

    balances = $modalStore[0].value.balances.get(selectedToke);
    whitelisted = balances.map(balance => balance.chainId);
  }

  const modalStore = getModalStore();

  function onRequestQuota(): void {
    console.log("request quota");

    if ($modalStore[0].response) $modalStore[0].response({});
    modalStore.close();
  }

  // Base Classes
  const cBase = 'card p-4 w-modal shadow-xl space-y-4';
  const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
    <div class="modal-example-form {cBase}">
        <header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}
        </header>
        <article>
            <div class="space-y-4">
                <div>
                    Token
                    <select class="select" bind:value={selectedToke}>
                        {#each $modalStore[0].value.tokens as token}
                            <option value="{token[1].Symbol}">{token[1].Name}</option>
                        {/each}
                    </select>
                </div>

                <div>
                    Destination
                    <select class="select" bind:value={selectedNetwork}>
                        {#each $modalStore[0].value.networks as network}
                            <option value="{network[1].ChainID}">{network[1].Name}</option>
                        {/each}
                    </select>
                </div>

            <label class="label">
                <span>Amount</span>
                <input class="input" type="number" placeholder="0.5" bind:value={amount} />
            </label>

            <Accordion>
                <AccordionItem>
                    <svelte:fragment slot="summary">Advance Options</svelte:fragment>
                    <svelte:fragment slot="content">
                        <label class="label">
                            <span>Threshold</span>
                            <input class="input" type="number" placeholder="0.005" bind:value={threshold} />
                        </label>

                        <div>
                        whitelistedSourceChains
                        <ListBox multiple>
                            {#each balances as balance}
                            <ListBoxItem bind:group={whitelisted} name="{$modalStore[0].value.networks.get(balance.chainId).Name}" value="{balance.chainId}">
                                <svelte:fragment slot="lead">
                                    <img class="size-6" src={hacks_getChainIcon(balance.chainId)} alt={`${balance.chainId}-LOGO`} />
                                </svelte:fragment>
                                {$modalStore[0].value.networks.get(balance.chainId).Name}
                                <svelte:fragment slot="trail">{balance.balance}</svelte:fragment>
                            </ListBoxItem>
                            {/each}
                        </ListBox>
                        </div>
                    </svelte:fragment>
                </AccordionItem>
            </Accordion>
            </div>
        </article>
        <footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
            <button class="btn {parent.buttonPositive}" on:click={onRequestQuota}>Send Tokens</button>
        </footer>
    </div>
{/if}
