export type UserType = {
	id: number; // TODO: figure out if this could have stayed as "string" as it was initially
	name: string;
	email: string;
	avatar: string;
};

// Design decision: Instead of using explicit Edge type,
// treat User as Edge to reduce redundancy since we are
// assuming id is reliable cursor.
export type UsersConnectionType = {
	users: Array<UserType>
	pageInfo: PageInfoType
}

// TODO: Decide if this should be exported based on best practices.
type PageInfoType = {
	hasPreviousPage: boolean,
	hasNextPage: boolean,
	startCursor: number,
	endCursor: number
}

export type PageVariables = {
	first: number,
	after: number | null, // TODO: Again, figure out if null is the correct type
}