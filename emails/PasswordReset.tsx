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
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
    firstName: string;
    lastName: string;
    resetLink: string;
}

export function ResetPasswordEmail(props: ResetPasswordEmailProps) {
    const {firstName, lastName, resetLink} = Object.keys(props).length > 0 ? props : {firstName: 'John', lastName: 'Doe', resetLink: 'https://example.com'};
    return (<Html>
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
        <Preview>Restablece tu contraseña de AcademiaWeb</Preview>
        <Body style={main}>
            <Container style={container} className="container">
                <Section style={content} className="content">
                    <Heading style={h1}>Restablece tu contraseña</Heading>
                    <Text style={text}>
                        Hola {firstName} {lastName},
                    </Text>
                    <Text style={text}>
                        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en AcademiaWeb. Si no has solicitado este cambio, puedes ignorar este correo.
                    </Text>
                    <Section style={buttonContainer}>
                        <Button style={button} href={resetLink}>
                            Restablecer Contraseña
                        </Button>
                    </Section>
                    <Text style={text}>
                        Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
                    </Text>
                    <Link href={resetLink} style={link}>
                        {resetLink}
                    </Link>
                    <Hr style={hr} />
                    <Text style={footer}>
                        Este es un correo automático, por favor no respondas a este mensaje.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
)};

export default ResetPasswordEmail;

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