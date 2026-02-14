const welcomeEmailTemplate = (url, name) => {
  	return `
		<div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 20px;">
        	<h2>Congratulations ${name},</h2>

	        <p>We’re excited to inform you that your account has been successfully verified.</p>

	        <p>You can now start using Project-Management to manage your projects and tasks. Login to get started.</p>

    	    <p>If you didn’t create an account with Project-Management, you can safely ignore this email.</p>

	        <p>Need help? Contact us at 
      		    <a href="mailto:patelp149201@gmail.com">patelp149201@gmail.com</a>
        	</p>

	        <p style="margin-top:30px;">Cheers,<br/>— The Project-Management Team</p>
      	</div>
	`;
};

export default welcomeEmailTemplate;