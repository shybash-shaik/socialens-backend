export function generateInvitationEmailHTML({
  inviteLink,
  tempPassword,
  authType,
}) {
  return `
    <html>
      <body>
        <h2>You have been invited to SociaLens</h2>
        <p>Please accept your invitation by clicking the link below:</p>
        <p><a href="${inviteLink}">${inviteLink}</a></p>
        ${tempPassword ? `<p>Your temporary password: <strong>${tempPassword}</strong></p>` : ''}
        <p>Authentication type: ${authType}</p>
        <hr />
        <p>Thank you,<br/>The SociaLens Team</p>
      </body>
    </html>
  `;
}
