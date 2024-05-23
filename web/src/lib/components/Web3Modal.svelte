<script lang="ts">
	import { connect } from '$lib/stores/wallet';
</script>

<button class="btn variant-filled" on:click={() => connect()}> Connect Wallet </button>
