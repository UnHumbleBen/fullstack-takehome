import { createYoga, createSchema } from 'graphql-yoga';
import { useGraphQlJit } from '@envelop/graphql-jit';

import type { RequestEvent } from '@sveltejs/kit';

import { users } from '$lib/data';

import schema from '$lib/schema.gql';

const yogaApp = createYoga<RequestEvent>({
	schema: createSchema({
		typeDefs: schema,
		resolvers: {
			Query: {
				usersConnection: (source, args, context, info) => {
					const allUsers = users;
					const { first, after } = args;
					// Set indexStart to 0 if after does not exist or no user has id after
					// Note that if findIndex does not find a user, then -1 is returned,
					// so indexStart will be set to -1 + 1 = 0, which is what we want.
					const indexStart = after ? allUsers.findIndex((user) => user.id == after) + 1 : 0;

					// Slice automatically handles cases where end is greater than the array length.
					const indexEnd = indexStart + first;
					const usersToReturn = users.slice(indexStart, indexEnd);


					const usersConnection = {
						users: usersToReturn,
						pageInfo: {
							hasNextPage: indexEnd < allUsers.length,
							startCursor: usersToReturn[0].id,
							endCursor: usersToReturn[usersToReturn.length - 1].id
						}
					}

					return usersConnection;
				}
			}
		}
	}),
	plugins: [useGraphQlJit()],
	fetchAPI: globalThis
});

export { yogaApp as GET, yogaApp as POST };
