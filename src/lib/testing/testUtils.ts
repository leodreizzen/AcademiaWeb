export type TestingEmail = {
    to: string,
    subject: string,
    from: string,
    cc?: string,
    bcc?: string,
    props: Record<string, any>
}

const globalWithTesting = globalThis as typeof globalThis & {
    testingEmails: TestingEmail[]
};

if(!globalWithTesting.testingEmails){
    globalWithTesting.testingEmails = []
}


export function saveTestingEmail(email: TestingEmail){
    globalWithTesting.testingEmails.push(email)
    console.log(globalWithTesting.testingEmails)
}

export function getTestingEmails(){
    console.log(globalWithTesting.testingEmails)
    return [...globalWithTesting.testingEmails]
}

export function clearTestingEmails(){
    globalWithTesting.testingEmails.length = 0
}
