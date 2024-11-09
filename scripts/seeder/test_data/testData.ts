import {IssueData, RefinementCtx, z, ZodArray, ZodEffects, ZodSchema, ZodType, ZodTypeAny} from "zod";
import {_subjects, DateSchema, GradeSchema, SubjectSchema, UserListSchema, UserSchema} from "./person";
import {DniSchema} from "@/lib/models/user";
import {isValid, parse} from "date-fns";
import {fromZonedTime} from "date-fns-tz";

function transformArray<Input, Output>(arr: unknown[], ctx: z.RefinementCtx, schema: ZodType<Output, any, Input>, schemaName: string): Output[] {
    const resList: z.infer<typeof schema>[] = [];
    for (let i = 0; i < arr.length; i++) {
        const person = arr[i];
        const parsedPerson = schema.safeParse(person);
        if (!parsedPerson.success) {
            ctx.addIssue({
                code: "custom",
                message: `Error parsing ${schemaName} (index ${i}): ${JSON.stringify(parsedPerson.error.errors)}`,
            });
            return z.NEVER;
        } else
            resList.push(parsedPerson.data);
    }
    return resList;
}

function listSchema<Input, Output>(schema: ZodType<Output, any, Input>, schemaName: string): ZodEffects<z.ZodArray<z.ZodUnknown>, Output[], unknown[]> | ZodArray<ZodType<Output, any, Input>> {
    if (!process.env.TEST_DATA_SCHEMA_GENERATION)
        return z.array(z.unknown()).transform((arr, ctx) => transformArray(arr, ctx, schema, schemaName))
    else
        return z.array(schema);
}

function nonEmptyListSchema<Input, Output>(schema: ZodType<Output, any, Input>, schemaName: string): ZodEffects<ReturnType<typeof listSchema>, Output[], unknown[]> {
    return listSchema(schema, schemaName).refine((list) => list.length > 0, {
        message: `List of ${schemaName} must not be empty`
    });
}


function uniqueBy<Output>(
    schema: ZodType<Output[], any, any>,
    key: (value: Output) => any,
    keyName: string
): ZodEffects<typeof schema, Output[]> {
    return schema.superRefine((list, ctx) => {
        if ((list as { status?: string })["status"] == "aborted")
            return z.NEVER;
        const keys = new Set<any>();
        for (const item of list as Output[]) {
            const k = key(item);
            if (keys.has(k)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Repeated ${keyName} ${k}`,
                });
                return z.NEVER;
            }
            keys.add(k);
        }
    });
}

export const DateTimeSchema = z.string().transform((value, ctx) => {
    const date = parse(value, 'dd-MM-yyyy HH:mm:ss', new Date());
    if (!isValid(date)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid datetime. Format must be DD-MM-YYYY HH:mm:ss",
        });
        return z.NEVER;
    }
    return fromZonedTime(date, 'America/Argentina/Buenos_Aires');
})


const SignatureSchema = z.object({
    signedByDni: DniSchema,
    dateTime: DateTimeSchema,
})


const ReprimandStudentSchema = z.object({
    dni: DniSchema,
    signature: SignatureSchema.optional()
})

const ReprimandSchema = z.object({
    students: uniqueBy(listSchema(ReprimandStudentSchema, "reprimand student"), value => value.dni, "student dni"),
    teacherDni: DniSchema,
    message: z.string(),
    date: DateSchema,
});

const ExamMarkSchema = z.object({
    studentDni: DniSchema,
    mark: z.number().int().min(1, "mark must be betweeen 1 and 10").max(10, "mark must be betweeen 1 and 10"),
    signature: SignatureSchema.optional()
});


const ExamSchema = z.object({
    subject: SubjectSchema,
    date: DateSchema,
    marks: uniqueBy(nonEmptyListSchema(ExamMarkSchema, "exam mark"), (mark) => mark.studentDni, "student dni")
})

const AssignmentSubmissionSchema = z.object({
    uploadDate: DateSchema,
    fileUrl: z.string().url(),
    studentDni: DniSchema,
})

const AssignmentSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    fileUrl: z.string().url(),
    uploadDate: DateSchema,
    subject: SubjectSchema,
    submissions: uniqueBy(listSchema(AssignmentSubmissionSchema, "assignment submission"), (submission) => submission.studentDni, "student dni")
});

const subjectSemesterMarks = z.object({
    subject: z.string(),
    marks: uniqueBy(listSchema(z.object({
        studentDni: DniSchema,
        mark: z.string().min(1).max(1).regex(new RegExp("[A-D]"), "mark must be between A and D"),
    }), "marks"), (mark) => mark.studentDni, "student dni")
})


const subjectFinalMarks = z.object({
    subject: z.string(),
    marks: uniqueBy(listSchema(z.object({
        studentDni: DniSchema,
        mark: z.number().int().min(1, "mark must be betweeen 1 and 10").max(10, "mark must be betweeen 1 and 10")
    }), "marks"), (mark) => mark.studentDni, "student dni")
})


const ReportCardSchema = z.object({
    year: z.number().int().min(2000).max(2100),
    grade: GradeSchema,
    firstSemesterMarks: uniqueBy(listSchema(subjectSemesterMarks, "subject first semester marks"), (subject) => subject.subject, "subject"),
    secondSemesterMarks: uniqueBy(listSchema(subjectSemesterMarks, "subject second semester marks"), (subject) => subject.subject, "subject"),
    finalMarks: uniqueBy(listSchema(subjectFinalMarks, "subject final marks"), (subject) => subject.subject, "subject"),
    firstSemesterReleased: z.boolean(),
    secondSemesterReleased: z.boolean(),
}).superRefine((reportCard, ctx) => {
    if (!reportCard.firstSemesterReleased && reportCard.secondSemesterMarks.length > 0) {
        ctx.addIssue({
            code: "custom",
            message: `Seconds semester marks can't be stored until first semester marks are released`
        });
        return z.NEVER;
    }
    if (reportCard.secondSemesterReleased && reportCard.finalMarks.length === 0) {
        ctx.addIssue({
            code: "custom",
            message: `Final marks are necessary to release second semester report card`
        });
        return z.NEVER;
    }
})

export const AttendanceItemSchema = z.object({
    studentDni: DniSchema,
    status: z.enum(["present", "absent"]),
})

const AttendanceDataSchema = z.object({
    date: DateSchema,
    grade: GradeSchema,
    items: uniqueBy(listSchema(AttendanceItemSchema, "attendance item"), (item) => item.studentDni, "student dni")
});

const messageSchema = z.object({
    fromDni: DniSchema,
    toDni: DniSchema,
    dateTime: DateTimeSchema,
    message: z.string().min(1),
    isRead: z.boolean(),
})


export const TestDataSchema = z.object({
    users: UserListSchema,
    reprimands: listSchema(ReprimandSchema, "reprimand"),
    exams: listSchema(ExamSchema, "exam"),
    assignments: listSchema(AssignmentSchema, "assignment"),
    reportCards: uniqueBy(listSchema(ReportCardSchema, "report card"), (reportCard) => JSON.stringify([reportCard.year, reportCard.grade]), "year_grade"),
    attendance: uniqueBy(listSchema(AttendanceDataSchema, "attendance data"), (attendanceData) => JSON.stringify([attendanceData.grade, attendanceData.date]), "grade_date"),
    messages: listSchema(messageSchema, "message")
}).superRefine((data, ctx) => {
        // @ts-ignore
        if (Object.keys(data).some(key => (data[key] as { status?: string })["status"] == "aborted"))
            return z.NEVER;
        const users = new Map<number, z.infer<typeof UserSchema>>();
        for (const user of data.users) {
            users.set(user.dni, user);
        }
        let issue;

        issue = validateReprimands(data.reprimands, users);
        if (issue) {
            ctx.addIssue(issue);
            return z.NEVER;
        }

        issue = validateExams(data.exams, users);
        if (issue) {
            ctx.addIssue(issue);
            return z.NEVER;
        }

        issue = validateAssignments(data.assignments, users);
        if (issue) {
            ctx.addIssue(issue);
            return z.NEVER;
        }

        issue = validateReportCards(data.reportCards, users);
        if (issue) {
            ctx.addIssue(issue);
            return z.NEVER;
        }

        issue = validateAttendance(data.attendance, users);
        if (issue) {
            ctx.addIssue(issue);
            return z.NEVER;
        }

        issue = validateMessages(data.messages, users);
        if (issue) {
            ctx.addIssue(issue);
            return z.NEVER;
        }
    }
);


function checkRole(dni: number, role: z.infer<typeof UserSchema>["profiles"][0]["role"] | "any", users: Map<number, z.infer<typeof UserSchema>>): IssueData | undefined {
    const user = users.get(dni);
    if (!user) {
        return ({
            code: "custom",
            message: `User with dni ${dni} not found`
        });
    }
    if (role != "any" && !user.profiles.some(p => p.role === role)) {
        return ({
            code: "custom",
            message: `User with dni ${dni} is not a ${role}`
        });
    } else
        return undefined;
}

function validateReprimands(reprimands: z.infer<typeof ReprimandSchema>[], users: Map<number, z.infer<typeof UserSchema>>): IssueData | undefined {
    for (const reprimand of reprimands) {
        for (const student of reprimand.students) {
            const issue = checkRole(student.dni, "Student", users);
            if (issue)
                return {...issue, message: issue.message + ` in reprimand with message ${reprimand.message}`};
            if (student.signature) {
                const signature = student.signature;
                const issue = checkRole(signature.signedByDni, "Parent", users);
                if (issue)
                    return {...issue, message: issue.message + ` in reprimand with message ${reprimand.message}`};
                if (!users.get(student.dni)?.profiles.find(p => p.role === "Student")?.parentDnis.includes(signature.signedByDni)) {
                    return {
                        code: "custom",
                        message: `Parent with dni ${student.signature.signedByDni} is not a parent of any of the students in the reprimand with message ${reprimand.message}`
                    }
                }
                if (signature.dateTime < reprimand.date) {
                    return {
                        code: "custom",
                        message: `Signature date is before reprimand date in reprimand with message ${reprimand.message}`
                    }
                }
            }
        }
        const issue = checkRole(reprimand.teacherDni, "Teacher", users);
        if (issue)
            return {...issue, message: issue.message + ` in reprimand with message ${reprimand.message}`};
    }
    return undefined;
}

function validateExams(exams: z.infer<typeof ExamSchema>[], users: Map<number, z.infer<typeof UserSchema>>): IssueData | undefined {
    for (const exam of exams) {
        for (const mark of exam.marks) {
            const issue = checkRole(mark.studentDni, "Student", users);
            if (issue)
                return {...issue, message: issue.message + ` in exam with subject ${exam.subject}`};


            for (const mark of exam.marks) {
                const grade = users.get(mark.studentDni)?.profiles.find(p => p.role === "Student")?.grade as string
                if (grade !== exam.subject[0]) {
                    return {
                        code: "custom",
                        message: `Student with dni ${mark.studentDni} is not in the same grade as the exam with subject ${exam.subject}. Student is in ${grade}`
                    }
                }
            }

            if (mark.signature) {
                const issue = checkRole(mark.signature.signedByDni, "Parent", users);
                if (issue)
                    return {...issue, message: issue.message + ` in exam with subject ${exam.subject}`};
                if (!users.get(mark.studentDni)?.profiles.find(p => p.role === "Student")?.parentDnis.includes(mark.signature.signedByDni)) {
                    return {
                        code: "custom",
                        message: `Parent with dni ${mark.signature.signedByDni} is not a parent of student with dni ${mark.studentDni} in exam with subject ${exam.subject}`
                    }
                }
                if (mark.signature.dateTime < exam.date) {
                    return {
                        code: "custom",
                        message: `Signature date is before exam date in exam with subject ${exam.subject}`
                    }
                }
            }
        }
    }
    return undefined;
}

function validateAssignments(assignments: z.infer<typeof AssignmentSchema>[], users: Map<number, z.infer<typeof UserSchema>>): IssueData | undefined {
    for (const assignment of assignments) {
        for (const submission of assignment.submissions) {
            const issue = checkRole(submission.studentDni, "Student", users);
            if (issue)
                return {...issue, message: issue.message + ` in assignment with title ${assignment.title}`};
            const user = users.get(submission.studentDni);
            if (user) {
                const profile = user.profiles.find(p => p.role === "Student")
                if (profile) {
                    const grade = user.profiles.find(p => p.role === "Student")?.grade;
                    if (grade && grade !== assignment.subject[0]) {
                        return {
                            code: "custom",
                            message: `Student with dni ${submission.studentDni} is not in the same grade as the assignment with title ${assignment.title}`
                        }
                    }
                }
            }
            if (submission.uploadDate < assignment.uploadDate) {
                return {
                    code: "custom",
                    message: `Submission date is before assignment date in assignment with title ${assignment.title}`
                }
            }
        }
    }
    return undefined;
}

function validateReportCards(assignments: z.infer<typeof ReportCardSchema>[], users: Map<number, z.infer<typeof UserSchema>>): IssueData | undefined {
    const usersArray = Array.from(users.values());

    for (const reportCard of assignments) {
        const gradeStudents = usersArray.filter(user => user.profiles.find(p => p.role === "Student")?.grade === reportCard.grade)

        const allStudents = reportCard.firstSemesterMarks.map(m => m.marks.map(m => m.studentDni)).flat()
        allStudents.push(...reportCard.secondSemesterMarks.map(m => m.marks.map(m => m.studentDni)).flat())
        allStudents.push(...reportCard.finalMarks.map(m => m.marks.map(m => m.studentDni)).flat())

        for (const student of allStudents) {
            const issue = checkRole(student, "Student", users);
            if (issue)
                return {
                    ...issue,
                    message: issue.message + ` in report card with year ${reportCard.year} and grade ${reportCard.grade}`
                };
            if (!gradeStudents.map((student) => student.dni).includes(student)) {
                return {
                    code: "custom",
                    message: `Student with dni ${student} is not in grade ${reportCard.grade}, but is in report card with year ${reportCard.year}`
                }
            }
        }

        for (const subject of reportCard.firstSemesterMarks) {
            for (const mark of subject.marks) {
                const issue = checkRole(mark.studentDni, "Student", users);
                if (issue)
                    return {
                        ...issue,
                        message: issue.message + ` in report card with year ${reportCard.year} and grade ${reportCard.grade}`
                    };
            }
        }
        if (reportCard.firstSemesterReleased) {
            const missingSubjects = _subjects.filter(subject => !reportCard.firstSemesterMarks.map(m => m.subject).includes(subject));
            if (missingSubjects.length > 0) {
                return {
                    code: "custom",
                    message: `Missing first semester marks for subjects ${missingSubjects.join(", ")} in report card with year ${reportCard.year} and grade ${reportCard.grade}`
                }
            }
            for (const subjectMark of reportCard.firstSemesterMarks) {
                for (const student of gradeStudents) {
                    if (!subjectMark.marks.map(m => m.studentDni).includes(student.dni))
                        return {
                            code: "custom",
                            message: `Student ${student.dni} in grade ${reportCard.grade} does not have first semester marks for ${subjectMark.subject}, but first semester marks are released, for report card with year ${reportCard.year}`
                        }
                }
            }
        }
        if (reportCard.secondSemesterReleased) {
            const missingSubjectsSecond = _subjects.filter(subject => !reportCard.secondSemesterMarks.map(m => m.subject).includes(subject));
            if (missingSubjectsSecond.length > 0) {
                return {
                    code: "custom",
                    message: `Missing second semester marks for subjects ${missingSubjectsSecond.join(", ")} in report card with year ${reportCard.year} and grade ${reportCard.grade}`
                }
            }

            const missingSubjectsFinal = _subjects.filter(subject => !reportCard.finalMarks.map(m => m.subject).includes(subject));
            if (missingSubjectsFinal.length > 0) {
                return {
                    code: "custom",
                    message: `Missing final marks for subjects ${missingSubjectsFinal.join(", ")} in report card with year ${reportCard.year} and grade ${reportCard.grade}`
                }
            }

            for (const subjectMark of reportCard.secondSemesterMarks) {
                for (const student of gradeStudents) {
                    if (!subjectMark.marks.map(m => m.studentDni).includes(student.dni))
                        return {
                            code: "custom",
                            message: `Student ${student.dni} in grade ${reportCard.grade} does not have second semester marks for ${subjectMark.subject}, but first semester marks are released, for report card with year ${reportCard.year}`
                        }
                }
            }

            for (const subjectMark of reportCard.finalMarks) {
                for (const student of gradeStudents) {
                    if (!subjectMark.marks.map(m => m.studentDni).includes(student.dni))
                        return {
                            code: "custom",
                            message: `Student ${student.dni} in grade ${reportCard.grade} does not have final marks for ${subjectMark.subject}, but first semester marks are released, for report card with year ${reportCard.year}`
                        }
                }
            }
        }
    }
    return undefined
}


function validateAttendance(attendance: z.infer<typeof AttendanceDataSchema>[], users: Map<number, z.infer<typeof UserSchema>>): IssueData | undefined {
    for (const attendanceData of attendance) {
        for (const item of attendanceData.items) {
            const issue = checkRole(item.studentDni, "Student", users);
            if (issue)
                return {
                    ...issue,
                    message: issue.message + ` in attendance data with grade ${attendanceData.grade} and date ${attendanceData.date}`
                };
            if (users.get(item.studentDni)?.profiles.find(p => p.role === "Student")?.grade !== attendanceData.grade) {
                return {
                    code: "custom",
                    message: `Student with dni ${item.studentDni} is not in the same grade as the attendance data with date ${attendanceData.date}`
                }
            }
        }
    }
    return undefined
}

function validateMessages(messages: z.infer<typeof messageSchema>[], users: Map<number, z.infer<typeof UserSchema>>): IssueData | undefined {
    for (const message of messages) {
        const fromIssue = checkRole(message.fromDni, "any", users);
        if (fromIssue)
            return {...fromIssue, message: fromIssue.message + ` in message to ${message.toDni}`};
        const toIssue = checkRole(message.toDni, "any", users);
        if (toIssue)
            return {...toIssue, message: toIssue.message + ` in message from ${message.fromDni}`};
    }
    return undefined
}
