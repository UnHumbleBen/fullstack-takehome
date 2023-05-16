<script lang="ts">
	import { Client, gql, queryStore } from "@urql/svelte";
	import type { PageVariables, UsersConnectionType } from "lib/types";
	import Loader from "./Loader.svelte";
	import User from "./User.svelte";
	import { onMount } from "svelte";

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

	let bottomOfTheList: Element;

	function handleIntersection(entries: IntersectionObserverEntry[]) {
		console.log(`handleIntersection for SearchPageResult("${variables.after}")`)
		entries.forEach(entry => {
			if (entry.isIntersecting && isLastPage && $result.data && $result.data.usersConnection.pageInfo.hasNextPage) {
				onLoadMore($result.data?.usersConnection.pageInfo.endCursor);
			}
		});
	}

	let observer: IntersectionObserver;

	onMount(() => {
		console.log(`Mounting observer for SearchPageResult("${variables.after}")`)
		observer = new IntersectionObserver(
				handleIntersection,
				{ threshold: 1.0 }
		);
		observer.observe(bottomOfTheList);
	});
</script>

{#if $result.fetching}
    <Loader />
{:else if $result.data}
    {#each $result.data.usersConnection.users as user (user.id)}
        <User {user} />
    {/each}
{/if}

<!--
	The !$result.data condition is used to include this div in the first render,
	so that set as a target for the IntersectionObserver API in onMount().
.-->
{#if isLastPage && (!$result.data || $result.data.usersConnection.pageInfo.hasNextPage)}
	<div bind:this={bottomOfTheList}></div>
{/if}