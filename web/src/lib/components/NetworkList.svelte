<script lang="ts">
  import {Accordion, AccordionItem} from "@skeletonlabs/skeleton";
  import NetworkDetails from "$lib/components/NetworkDetails.svelte";

    const url = "https://corsproxy.io/?" + encodeURIComponent("https://api.gopher.chainsafe.dev/networks");
    const promise = fetch(url).then(r => r.json());
</script>

{#await promise}
    <p>...waiting</p>
{:then networks}
    <Accordion>
    {#each networks.data as network}
        <NetworkDetails chainID={network.ChainID} name={network.Name} />
    {/each}
    </Accordion>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}