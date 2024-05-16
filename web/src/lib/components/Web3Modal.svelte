<script lang="ts">
    import {connect} from "$lib/stores/wallet";

    connect
</script>

<button class="btn variant-filled" on:click={() => connect()}>
    Connect Wallet
</button>
