export enum Resource {
    PARENT = "PARENT",
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    ADMINISTRATOR = "ADMINISTRATOR",
    ASSIGNMENT = "ASSIGNMENT",
    USER = "USER",
    PROFILE = "PROFILE",
    EXAM_MARK = "EXAM_MARK",
    REPORT_CARD = "REPORT_CARD",
    REPRIMAND = "REPRIMAND",
}

const Operation = {
    [Resource.PARENT]: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"] as const,
    [Resource.STUDENT]: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"] as const,
    [Resource.TEACHER]: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"] as const,
    [Resource.ADMINISTRATOR]: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"] as const,
    [Resource.ASSIGNMENT]: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"] as const,
    [Resource.USER]: ["CHANGE_OWN_PASSWORD", "DELETE", "SELECT_CHILD"] as const,
    [Resource.PROFILE]: ["DELETE"] as const,
    [Resource.EXAM_MARK]: ["LIST", "CREATE", "READ", "UPDATE"] as const,
    [Resource.REPORT_CARD]: ["LIST", "READ", "CREATE", "UPDATE"] as const,
    [Resource.REPRIMAND]: ["LIST", "CREATE", "READ"] as const,
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
