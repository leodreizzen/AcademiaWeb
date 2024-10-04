export enum Resource {
    PARENT = "PARENT",
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    ADMINISTRATOR = "ADMINISTRATOR",
    ASSIGNMENT = "ASSIGNMENT",
    USER = "USER"
}

const Operation = {
    [Resource.PARENT]: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"] as const,
    [Resource.STUDENT]: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"] as const,
    [Resource.TEACHER]: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"] as const,
    [Resource.ADMINISTRATOR]: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"] as const,
    [Resource.ASSIGNMENT]: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"] as const,
    [Resource.USER]: ["CHANGE_OWN_PASSWORD"] as const
} as const;

type Operations = {
    [K in Resource]: typeof Operation[K][number][];
};

export type PermissionList = {
    [K in Resource]: {
        resource: K;
        operations: Operations[K];
    }
}[Resource];

export type Permission = {
    [K in Resource]: {
        resource: K;
        operation: typeof Operation[K][number];
    }
}[Resource];
