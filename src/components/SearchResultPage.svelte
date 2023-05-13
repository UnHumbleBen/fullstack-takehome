<script lang="ts">
	import { Client, gql, queryStore } from "@urql/svelte";
	import type { PageVariables, UsersConnectionType } from "lib/types";
	import Loader from "./Loader.svelte";
	import User from "./User.svelte";

    export let client: Client;
    export let variables: PageVariables;
    export let onLoadMore: Function; // TODO: figure out type of event handlers
    export let isLastPage: boolean;

	// TODO: Go back to schema and mark types as non-nullable if applicable
	$: result = queryStore<{ usersConnection: UsersConnectionType }>({
		client,
		query: gql`
			query($first: Int!, $after: ID) {
				usersConnection(first: $first, after: $after) {
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
		`,
		variables,
	});
</script>

{#if $result.fetching}
    <Loader />
{:else if $result.data}
    {#each $result.data.usersConnection.users as user (user.id)}
        <User {user} />
    {/each}

    {#if isLastPage && $result.data.usersConnection.pageInfo.hasNextPage}
        <button on:click={() => onLoadMore($result.data?.usersConnection.pageInfo.endCursor)}>Load More</button>
    {/if}
{/if}
