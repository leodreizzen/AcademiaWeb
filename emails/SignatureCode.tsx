import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import {format} from "date-fns";

type SignatureEmailProps = {
    parent: {firstName: string, lastName: string};
    student: {firstName: string, lastName: string};
    signatureCode: number;
    context: SignatureEmailContext
};

export type SignatureEmailContext = ExamSignatureEmailContext | ReprimandSignatureEmailContext

type ExamSignatureEmailContext = {
    type: "examMark";
    subjectName: string;
    mark: number;
}

type ReprimandSignatureEmailContext = {
    type: "reprimand";
    date: Date;
    sanctionReason: string;
}


const previewProps: SignatureEmailProps = {
    parent: {firstName: 'Pablo', lastName: 'González'},
    student: {firstName: 'Juan', lastName: 'Pérez'},
    context: {
        type: "reprimand",
        sanctionReason: 'Falta de asistencia. Comportamiento inapropiado en clase.\n Solicitamos a los padres que tomen medidas urgentes para corregir el accionar del alumno, que está generando preocupaciones.\n' +
            '\n.',
        date: new Date()
    },
    // context: {type: "examMark", subjectName: 'Matemáticas', mark: 7},
    signatureCode: 1234
}

export function signatureTypeDescription(context: SignatureEmailContext): string {
    return context.type === "examMark" ? "nota de examen" : "amonestación"
}
export default function ExamSignatureEmail(props: SignatureEmailProps) {
    const {
        parent,
        student,
        signatureCode,
        context
    } = Object.keys(props).length > 0 ? props : previewProps
    let info;
    if (context.type === "examMark") {
        info = <>
            <Text style={infoText}>
                <strong>Materia:</strong> {context.subjectName}
            </Text>
            <Text style={infoText}>
                <strong>Nota:</strong> {context.mark}
            </Text>
            <Text style={infoText}>
                <strong>Código de firma:</strong> <span style={codeStyle}>{signatureCode}</span>
            </Text>
        </>
    } else if(context.type === "reprimand"){
        const sanctionReasonArray = context.sanctionReason.split('.').filter(paragraph => paragraph.trim() !== '')
        info = <>
            <Text style={infoText}>
                <strong>Fecha:</strong> {format(context.date, 'dd/MM/yyyy')}
            </Text>
            <Section style={reasonSection}>
                <Text style={reasonTitle}>
                    <strong>
                        Motivo de la amonestación:
                    </strong>
                </Text>
                {sanctionReasonArray.map((paragraph, index) => (
                    <Text key={index} style={reasonText}>
                        {paragraph}.
                    </Text>
                ))}
            </Section>
            <Text style={infoText}>
                <strong>Código de firma:</strong> <span style={codeStyle}>{signatureCode}</span>
            </Text>
        </>
    }

    const typeDescription = signatureTypeDescription(context)

    return (
        <Html>
            <Head>
                <style>{`
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              padding: 10px !important;
            }
            .content {
              width: 100% !important;
            }
          }
        `}</style>
            </Head>
            <Preview>Código para firmar {typeDescription} - AcademiaWeb</Preview>
            <Body style={main}>
                <Container style={container} className="container">
                    <Section style={content} className="content">
                        <Heading style={h1}>Firma de {typeDescription}</Heading>
                        <Text style={text}>
                            Estimado/a {parent.firstName} {parent.lastName},
                        </Text>
                        <Text style={text}>
                            Solicitaste firmar la siguiente {typeDescription} de {student.firstName} {student.lastName}:
                        </Text>
                        <Section style={infoContainer}>
                            {info}
                        </Section>
                        <Text style={text}>
                            Por favor, revisa esta información, e introduce este código en la página de firma para
                            confirmar tu identidad
                        </Text>
                        <Hr style={hr}/>
                        <Text style={footer}>
                            Este es un correo automático, por favor no respondas a este mensaje.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: '#1a1a1a',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
};

const content = {
    width: '100%',
    maxWidth: '560px',
    margin: '0 auto',
};

const h1 = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'normal',
    textAlign: 'center' as const,
    margin: '30px 0',
};

const text = {
    color: '#dddddd',
    fontSize: '14px',
    lineHeight: '24px',
};

const infoContainer = {
    backgroundColor: '#2a2a2a',
    borderRadius: '4px',
    padding: '8px 16px',
    margin: '20px 0',
};

const infoText = {
    ...text,
    margin: '10px 0',
};

const reasonSection = {
    padding: 0,
    margin: 0
}
const reasonText = {
    ...text,
    marginBottom: '3px',
    marginTop: "10px",
    lineHeight: '16px'
}

const reasonTitle = {
    ...text,
    marginBottom: '10px',
    marginTop: '0',
};

const codeStyle = {
    marginLeft: '4px',
    backgroundColor: '#3a3a3a',
    padding: '2px 6px',
    borderRadius: '2px',
    fontFamily: 'monospace',
    letterSpacing: '2px',
    fontSize: "18px",
};

const hr = {
    borderColor: '#444444',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
};