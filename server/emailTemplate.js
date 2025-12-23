export function createRSVPEmailTemplate(rsvpData) {
  const attendanceText = rsvpData.attendance === 'yes' ? 'Sí asistirá' : 'No asistirá'
  const attendanceColor = rsvpData.attendance === 'yes' ? '#4a7c59' : '#c94a4a'
  const attendanceIcon = rsvpData.attendance === 'yes' ? '✓' : '✗'
  
  const formattedDate = new Date(rsvpData.submittedAt).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Confirmación de Asistencia - RSVP</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f1e8;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f1e8; padding: 20px;">
        <tr>
            <td align="center">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #4a7c59 0%, #6b9c7a 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #f5f1e8; font-size: 28px; font-weight: 300; letter-spacing: 2px;">
                                💐 Nueva Confirmación de Asistencia
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 30px 0; color: #4a7c59; font-size: 18px; font-weight: 600;">
                                Hola,
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                Has recibido una nueva confirmación de asistencia para tu boda.
                            </p>
                            
                            <!-- Información del RSVP -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f9f9f9; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 25px; border-bottom: 2px solid #e8e8e8;">
                                        <table role="presentation" style="width: 100%;">
                                            <tr>
                                                <td style="padding-bottom: 15px;">
                                                    <strong style="color: #4a7c59; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">👤 Nombre Completo</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #333333; font-size: 18px; font-weight: 600;">
                                                    ${rsvpData.name}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="padding: 25px; border-bottom: 2px solid #e8e8e8;">
                                        <table role="presentation" style="width: 100%;">
                                            <tr>
                                                <td style="padding-bottom: 15px;">
                                                    <strong style="color: #4a7c59; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">📧 Email de Contacto</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #333333; font-size: 16px;">
                                                    <a href="mailto:${rsvpData.email}" style="color: #4a7c59; text-decoration: none;">${rsvpData.email}</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="padding: 25px; border-bottom: 2px solid #e8e8e8;">
                                        <table role="presentation" style="width: 100%;">
                                            <tr>
                                                <td style="padding-bottom: 15px;">
                                                    <strong style="color: #4a7c59; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${rsvpData.attendance === 'yes' ? '✅' : '❌'} Confirmación de Asistencia</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span style="display: inline-block; padding: 8px 20px; background-color: ${attendanceColor}; color: #ffffff; border-radius: 20px; font-size: 16px; font-weight: 600;">
                                                        ${attendanceIcon} ${attendanceText}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                ${rsvpData.attendance === 'yes' ? `
                                <tr>
                                    <td style="padding: 25px; border-bottom: 2px solid #e8e8e8;">
                                        <table role="presentation" style="width: 100%;">
                                            <tr>
                                                <td style="padding-bottom: 15px;">
                                                    <strong style="color: #4a7c59; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">👥 Número de Invitados</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #333333; font-size: 24px; font-weight: 700;">
                                                    ${rsvpData.guests} ${rsvpData.guests === '1' ? 'invitado' : 'invitados'}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                ` : ''}
                                
                                ${rsvpData.message ? `
                                <tr>
                                    <td style="padding: 25px;">
                                        <table role="presentation" style="width: 100%;">
                                            <tr>
                                                <td style="padding-bottom: 15px;">
                                                    <strong style="color: #4a7c59; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">💬 Mensaje Adicional</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #333333; font-size: 16px; line-height: 1.6; font-style: italic; padding: 15px; background-color: #ffffff; border-left: 4px solid #4a7c59; border-radius: 4px;">
                                                    "${rsvpData.message}"
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                ` : ''}
                            </table>
                            
                            <!-- Información adicional -->
                            <table role="presentation" style="width: 100%; margin-top: 30px; padding: 20px; background-color: #f5f1e8; border-radius: 8px;">
                                <tr>
                                    <td style="text-align: center;">
                                        <p style="margin: 0; color: #666666; font-size: 14px;">
                                            <strong>📅 Fecha de confirmación:</strong><br>
                                            ${formattedDate}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Esta confirmación ha sido guardada automáticamente en tu sistema de gestión de RSVP.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #4a7c59; padding: 30px; text-align: center;">
                            <p style="margin: 0; color: #f5f1e8; font-size: 14px;">
                                💐 Manuela & Daniel<br>
                                <span style="font-size: 12px; opacity: 0.8;">Sistema de Gestión de RSVP</span>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `
}

