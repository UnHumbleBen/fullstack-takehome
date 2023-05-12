import { createYoga, createSchema } from 'graphql-yoga';
import { useGraphQlJit } from '@envelop/graphql-jit';

import type { RequestEvent } from '@sveltejs/kit';

import { users } from '$lib/data';

import schema from '$lib/schema.gql';
import type { UsersConnectionType } from 'lib/types';

const yogaApp = createYoga<RequestEvent>({
	schema: createSchema({
		typeDefs: schema,
		resolvers: {
			Query: {
				usersConnection: (source, args, context, info) => {
					// TODO: delcare types for first and after
					const allUsers = users;
					const { first, after } = args;
					// TODO: double check this conditional for after
					// TODO: What if after does not exist in allUsers?
					const indexStart = after ? allUsers.findIndex((user) => user.id == after) + 1 : 0;

					// Slice automatically handles cases where end
					// is greater than the array length.
					const indexEnd = indexStart + first;
					const usersToReturn = users.slice(indexStart, indexEnd);


					const usersConnection: UsersConnectionType = {
						users: usersToReturn,
						pageInfo: {
							hasPreviousPage: indexStart > 0,
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
