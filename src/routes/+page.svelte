<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, gql, queryStore } from '@urql/svelte';
	import Loader from 'components/Loader.svelte';
	import SearchResultPage from 'components/SearchResultPage.svelte';
	import User from 'components/User.svelte';
	import type { PageVariables, UserType, UsersConnectionType } from 'lib/types';

	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});

	const first = 10;

	let pageVariables: PageVariables[] = [
		{
			first,
			after: null
		}
	];

	function onLoadMore(after: number) {
		pageVariables = [...pageVariables, { first, after }]
	}

	// let after: number | null = null;
	// let users: UserType[] = [];

	// // TODO: Go back to schema and mark types as non-nullable if applicable
	// $: result = queryStore<{ usersConnection: UsersConnectionType }>({
	// 	client,
	// 	query: gql`
	// 		query($first: Int!, $after: ID) {
	// 			usersConnection(first: $first, after: $after) {
	// 				users {
	// 					id
	// 					name
	// 					avatar
	// 					email
	// 				}
	// 				pageInfo {
	// 					hasPreviousPage
	// 					hasNextPage
	// 					startCursor
	// 					endCursor
	// 				}
	// 			}
	// 		}
	// 	`,
	// 	variables: { first, after }
	// });
</script>

<!-- TODO: Figure out if the divs should be here or in child -->
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
