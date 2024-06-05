<script>
    import {AppBar, LightSwitch} from "@skeletonlabs/skeleton";
</script>

<AppBar>
    <svelte:fragment slot="lead">
        <div class="h-10 px-2.5 justify-start items-center gap-2.5 flex">
            <div class="w-10 h-10 relative bg-slate-200 rounded-[500px] overflow-hidden">
                <img src="https://media1.tenor.com/m/zfhl02Fs4ZwAAAAC/raccoon-dancing-in-a-circle-raccoon-dancing.gif" />
            </div>
            <div class="text-black text-xl font-medium font-['Inter'] leading-7">Gopher Demo</div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="trail">
            <LightSwitch />
        <a
                class="btn btn-sm variant-ghost-surface"
                href="https://github.com/ChainSafe/gopher-ts"
                target="_blank"
                rel="noreferrer"
        >
            GitHub
        </a>
    </svelte:fragment>
</AppBar>