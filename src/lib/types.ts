export type UserType = {
	id: string;
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

export type PageInfoType = {
	hasNextPage: boolean,
	startCursor: string,
	endCursor: string
}

export type PageVariables = {
	first: number,
	after?: string,
}