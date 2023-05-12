type UserType = {
	id: number;
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

type PageInfoType = {
	hasPreviousPage: boolean,
	hasNextPage: boolean,
	startCursor: number,
	endCursor: number
}
