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

export function randomBetween(min: number, max: number) {
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString()
}

export function saveTestingEmail(email: TestingEmail){
    globalWithTesting.testingEmails.push(email)
}

export function getTestingEmails(){
    return [...globalWithTesting.testingEmails]
}

export function clearTestingEmails(){
    globalWithTesting.testingEmails.length = 0
}

