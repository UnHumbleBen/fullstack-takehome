<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, gql, queryStore } from '@urql/svelte';
	import Loader from 'components/Loader.svelte';
	import User from 'components/User.svelte';
	import type { UsersConnectionType } from 'lib/types';

	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});

	// TODO: Go back to schema and mark types as non-nullable if applicable
	const result = queryStore<{ usersConnection: UsersConnectionType }>({
		client,
		query: gql`
			query {
				usersConnection(first: 10) {
					users {
						id
						name
						avatar
						email
					}
					pageInfo {
						hasPreviousPage
						hasNextPage
						startCursor
						endCursor
					}
				}
			}
		`
	});
</script>

<div class="w-full h-full overflow-scroll">
	<div class="flex flex-col gap-4 items-center p-4">
		{#if $result.fetching}
			<Loader />
		{:else if $result.data}
			{#each $result.data.usersConnection.users as user (user.id)}
				<User {user} />
			{/each}
		{/if}
	</div>
</div>
