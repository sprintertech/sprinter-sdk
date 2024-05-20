<script lang="ts">
  import { hacks_getGopherData } from '$lib/hacks';
  import type { ModalSettings } from "@skeletonlabs/skeleton";
  import TokenModal from "$lib/components/TokenModal.svelte";
  import { getModalStore } from '@skeletonlabs/skeleton';

  const modalStore = getModalStore();

  const promise = hacks_getGopherData();

  const handleListClick = async (index: number) => {
    const data = await promise;
    console.log(data);
    const token = data.tokens[index];

    const modal: ModalSettings = {
      type: 'component',
      component: { ref: TokenModal },
      title: token.Name,
      value: { networks: data.raw.networks, balances: token.balances },
      meta: { icon: token.LogoURI, sybol: token.Symbol }
    };
    modalStore.trigger(modal);
  }
</script>

{#await promise}
    <p>...waiting</p>
{:then data}
    <div class="table-container">
        <table class="table table-hover">
            <thead>
            <tr>
                <th />
                <th>Token</th>
                <th />
                <th>Balance</th>
            </tr>
            </thead>
            <tbody>
            {#each data.tokens as token, i}
                <tr on:click={() => handleListClick(i)}>
                    <td><img class="size-8" src={token.LogoURI} alt={`${token.LogoURI}-LOGO`} /></td>
                    <td>{token.Name}</td>
                    <td />
                    <td>{token.total}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
