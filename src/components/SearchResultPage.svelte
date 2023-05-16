<script lang="ts">
	import { Client, gql, queryStore } from "@urql/svelte";
	import type { PageVariables, UsersConnectionType } from "lib/types";
	import Loader from "./Loader.svelte";
	import User from "./User.svelte";
	import { beforeUpdate, onMount } from "svelte";

    export let client: Client;
    export let variables: PageVariables;
    export let onLoadMore: Function; // TODO: figure out type of event handlers
    export let isLastPage: boolean;

	// TODO: See if these requests need to be cached to avoid duplicates.
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

	export let endCursor: number | null;
	export let hasNextPage: boolean;

	beforeUpdate(() => {
		if (isLastPage && $result.data) {
			if ($result.data.usersConnection.pageInfo.hasNextPage) {
				endCursor = $result.data.usersConnection.pageInfo.endCursor;
				hasNextPage = true;
			} else {
				hasNextPage = false;
			}
		}
	});
</script>

{#if $result.fetching}
    <Loader />
{:else if $result.data}
    {#each $result.data.usersConnection.users as user (user.id)}
        <User {user} />
    {/each}

    <!-- {#if isLastPage && $result.data.usersConnection.pageInfo.hasNextPage}
        <button on:click={}>Load More</button>
    {/if} -->
{/if}
