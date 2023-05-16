<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, gql, queryStore } from '@urql/svelte';
	import Loader from 'components/Loader.svelte';
	import SearchResultPage from 'components/SearchResultPage.svelte';
	import type { PageVariables, UserType, UsersConnectionType } from 'lib/types';
	import { onMount } from 'svelte';

	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});

	const first = 10;
	let after: number | null = null;
	let hasNextPage: boolean = true;

	let pageVariables: PageVariables[] = [

	];

	function onLoadMore(after: number | null) {
		pageVariables = [...pageVariables, { first, after }]
	}

	let bottomOfTheList: Element;

	function handleIntersection(entries: IntersectionObserverEntry[]) {
		entries.forEach(entry => {
			if (entry.isIntersecting && hasNextPage) {
				onLoadMore(after);
			}
		});
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			handleIntersection,
			{ threshold: 1.0 }
		);
		observer.observe(bottomOfTheList);
	})
</script>

<!-- TODO: Figure out if the divs should be here or in child -->
<div class="w-full h-full overflow-scroll">
	<div class="flex flex-col gap-4 items-center p-4">
		{#if pageVariables.length == 0}
			<Loader />
		{:else}
			{#each pageVariables as pageVariable, index}
				<SearchResultPage
					{client}
					variables = {pageVariable}
					isLastPage = {index === pageVariables.length - 1}
					onLoadMore = {onLoadMore}
					bind:endCursor = {after}
					bind:hasNextPage = {hasNextPage}
				/>
			{/each}
		{/if}
	</div>


	<div bind:this={bottomOfTheList}></div>
</div>
