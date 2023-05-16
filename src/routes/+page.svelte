<script lang="ts">
	import { cacheExchange, createClient, fetchExchange } from '@urql/svelte';
	import SearchResultPage from 'components/SearchResultPage.svelte';
	import type { PageVariables } from 'lib/types';

	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});

	const first = 10;

	// TODO: Format document and reorder document structure based on best practices

	let pageVariables: PageVariables[] = [
		{
			first,
		}
	];

	function onLoadMore(after: string) {
		pageVariables = [...pageVariables, { first, after }]
	}
</script>

<div class="w-full h-full overflow-scroll">
	<div class="flex flex-col gap-4 items-center p-4">
		{#each pageVariables as pageVariable, index}
			<SearchResultPage
				{client}
				variables = {pageVariable}
				isLastPage = {index === pageVariables.length - 1}
				onLoadMore = {onLoadMore}
			/>
		{/each}
	</div>
</div>
