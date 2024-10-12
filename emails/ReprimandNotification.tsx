import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
} from '@react-email/components';
import * as React from 'react';
import path from "node:path";
import fs from "fs";

interface SanctionNotificationEmailProps {
  recipient: {firstName: string, lastName: string}
    student: {firstName: string, lastName: string}
  sanctionReason: string;
  detailsLink: string;
}

export function SanctionNotificationEmail(props: SanctionNotificationEmailProps) {
  const { student, recipient, detailsLink, sanctionReason } = Object.keys(props).length > 0
      ? props
      : {
        recipient: {firstName: 'Pablo', lastName: 'González'},
        student: {firstName: 'Juan', lastName: 'Pérez'},
        sanctionReason: 'Falta de asistencia. Comportamiento inapropiado en clase.',
        detailsLink: 'https://example.com'
      };
  const sanctionReasonArray = sanctionReason.split('.').filter(paragraph => paragraph.trim() !== '')

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
        <Preview>Notificación de amonestación - AcademiaWeb</Preview>
        <Body style={main}>
          <Container style={container} className="container">
            <Section style={content} className="content">
              <Img
                  src="https://res.cloudinary.com/duafjqwy9/image/upload/v1728699886/triangle_alert_tfjelg.png"
                  width="100"
                  height="100"
                  alt="Ícono de exclamación"
                  style={icon}
              />
              <Heading style={h1}>Notificación de amonestación</Heading>
              <Text style={text}>
                Hola {recipient.firstName} {recipient.lastName},
              </Text>
              <Text style={text}>
                Te informamos que se ha registrado una amonestación para {student.firstName} {student.lastName}.
              </Text>
              <Section style={reasonContainer}>
                <Text style={reasonTitle}>
                  Motivo de la amonestación:
                </Text>
                {sanctionReasonArray.map((paragraph, index) => (
                    <Text key={index} style={reasonText}>
                      {paragraph}.
                    </Text>
                ))}
              </Section>
              <Text style={textBold}>
                Es necesario que firmes esta notificación.
              </Text>
              <Section style={buttonContainer}>
                <Button style={button} href={detailsLink}>
                  Ver Detalles
                </Button>
              </Section>
              <Text style={text}>
                Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
              </Text>
              <Link href={detailsLink} style={link}>
                {detailsLink}
              </Link>
              <Hr style={hr} />
              <Text style={footer}>
                Este es un correo automático, por favor no respondas a este mensaje.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
  );
}
export default SanctionNotificationEmail;

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

const icon = {
  margin: '0 auto',
  marginBottom: '20px',
  display: 'block',
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

const textBold = {
  ...text,
  fontWeight: 'bold',
};

const reasonContainer = {
  backgroundColor: '#2a2a2a',
  borderRadius: '4px',
  padding: '16px',
  margin: '20px 0',
};

const reasonTitle = {
  ...textBold,
  marginBottom: '10px',
  marginTop: '0',
};

const reasonText = {
  ...text,
  marginBottom: '3px',
  lineHeight: '10px'
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px',
  width: '100%',
  maxWidth: '240px',
};

const link = {
  color: '#5F51E8',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const hr = {
  borderColor: '#444444',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};