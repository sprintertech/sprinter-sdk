<script lang="ts">
	import { ListBox, ListBoxItem, type PopupSettings, popup } from "@skeletonlabs/skeleton";

	let comboboxValue: string;

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	let token;
</script>

<div class="self-stretch px-5 py-1.5 bg-slate-50 justify-center items-center gap-1.5 inline-flex">
	<div
		class="grow shrink basis-0 text-slate-400 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
	>
		Amount & Account
	</div>
</div>
<div
	class="self-stretch p-5 bg-white border-t border-b border-gray-300 flex-col justify-center items-start gap-1 flex"
>
	<div class="self-stretch h-[98px] py-3 rounded-3xl flex-col justify-start items-start flex">
		<div class="self-stretch h-[74px] flex-col justify-center items-start gap-2 flex">
			<div class="self-stretch h-10 flex-col justify-start items-start gap-2 flex">
				<div class="self-stretch justify-between items-center inline-flex">
					<!-- Value Input -->
					<input class="w-full border-transparent focus:border-transparent focus:ring-0 text-zinc-600 text-[34px] font-medium font-['Inter'] leading-10 outline-none border-0 pl-0" value="0" />
					<!-- Token Selection -->
					<button class="px-2 py-1.5 bg-zinc-100 rounded-[40px] justify-end items-center gap-1 flex" use:popup={popupCombobox}>
						<div class="w-6 h-6 relative">
							<div class="w-6 h-6 left-0 top-0 absolute"></div>
							<div class="w-5 h-5 left-[2px] top-[2px] absolute"></div>
						</div>
						<div class="text-zinc-700 text-lg font-medium font-['Inter'] leading-relaxed">USDC</div>
						<div class="justify-end items-center gap-3 flex">
							<div class="w-6 h-6 relative">↓</div>
						</div>
					</button>
					<div class="card w-48 shadow-xl py-2" data-popup="popupCombobox">
						<ListBox rounded="rounded-none">
							<ListBoxItem bind:group={comboboxValue} name="medium" value="books">Books</ListBoxItem>
							<ListBoxItem bind:group={comboboxValue} name="medium" value="movies">Movies</ListBoxItem>
							<ListBoxItem bind:group={comboboxValue} name="medium" value="television">TV</ListBoxItem>
						</ListBox>
						<div class="arrow bg-surface-100-800-token" />
					</div>
				</div>
			</div>
			<div class="self-stretch justify-between items-center inline-flex">
				<div />
				<div
					class="h-[26px] text-right text-zinc-500 text-sm font-normal font-['Inter'] leading-[15px] p-1 pt-2"
				>
					Balance: 1536
				</div>
			</div>
		</div>
	</div>
</div>

<div class="self-stretch px-5 py-1.5 bg-slate-50 justify-center items-center gap-1.5 inline-flex">
	<div
		class="grow shrink basis-0 text-gray-400 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
	>
		to
	</div>
</div>
<div
	class="self-stretch px-[9px] py-2 bg-white flex-col justify-center items-start gap-4 flex"
>
	<div class="self-stretch h-[62px] px-4 py-3 rounded-lg border border-zinc-200"></div>
</div>
<div
	class="self-stretch px-5 py-1.5 bg-slate-50 rounded-lg justify-center items-center gap-1.5 inline-flex"
>
	<div
		class="grow shrink basis-0 text-slate-400 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
	>
		Destination network
	</div>
</div>
<div
	class="self-stretch px-[9px] py-2 bg-white rounded-lg flex-col justify-center items-start gap-4 flex"
>
	<div
		class="self-stretch h-[62px] px-4 py-3 rounded-lg border border-zinc-200 flex-col justify-center items-start gap-1 flex"
	>
		<div class="self-stretch py-1.5 rounded-[40px] justify-between items-center inline-flex">
			<div class="text-zinc-800 text-lg font-medium font-['Inter'] leading-relaxed">
				Select Network
			</div>
			<div class="justify-end items-center gap-3 flex">
				<div class="w-6 h-6 relative"></div>
			</div>
		</div>
	</div>
</div>
<div class="self-stretch px-5 py-1.5 bg-slate-50 justify-center items-center gap-1.5 inline-flex">
	<div
		class="grow shrink basis-0 text-slate-400 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
	>
		Advanced methods
	</div>
</div>
<div class="self-stretch p-5 bg-white flex-col justify-start items-start gap-3 flex">
	<div class="self-stretch h-4 flex-col justify-center items-start gap-1 flex">
		<div class="self-stretch justify-start items-center gap-1 inline-flex">
			<div
				class="grow shrink basis-0 text-slate-700 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
			>
				whitelist a network
			</div>
		</div>
	</div>
	<div class="self-stretch py-[1.50px] justify-center items-center gap-2 inline-flex">
		<div class="grow shrink basis-0 h-px bg-zinc-200"></div>
	</div>
	<div class="self-stretch h-[60px] flex-col justify-center items-start gap-1 flex">
		<div
			class="self-stretch text-slate-700 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
		>
			set custom threshold
		</div>
		<div class="self-stretch h-10 px-4 py-3 rounded-lg border border-zinc-200"></div>
	</div>
	<div class="self-stretch py-[1.50px] justify-center items-center gap-2 inline-flex">
		<div class="grow shrink basis-0 h-px bg-zinc-200"></div>
	</div>
</div>
<div
	class="w-full p-5 bg-white border-t border-zinc-200 justify-start items-center gap-4 inline-flex"
>
	<div class="grow shrink basis-0 flex-col justify-center items-center gap-4 inline-flex">
		<div
			class="self-stretch h-[60px] p-2.5 bg-indigo-600 rounded-[10px] shadow border border-zinc-200 justify-center items-center gap-1 inline-flex"
		>
			<div class="px-1 justify-center items-center flex">
				<div class="text-white text-base font-semibold font-['Inter'] leading-normal">Send</div>
			</div>
		</div>
	</div>
</div>
