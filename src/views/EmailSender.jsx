import React from 'react'

export default function EmailSender() {
  

  const handleClick = () => {
    
    var templateParams = {
      from_name: 'Support ni MangPogs',
      to_name: 'randy organ',
      from_email: 'support@mangpogs.com',
      reply_to: 'sambile.randy@gmail.com',
      message: 'i just want to ask if youre a human.....',
      subject: 'this is subject',
      phone: '123456789'
  };
   
  emailjs.send('service_r49dm8t', 'template_94wh6se', templateParams)
      .then(function(response) {
         console.log('SUCCESS!', response.status, response.text);
      }, function(error) {
         console.log('FAILED...', error);
      });
    }
  
  return (
    <div>
      <form className="test-mailing">
    	<h1>Let's see if it works</h1>
    	<div>
      	<textarea
        	id="test-mailing"
        	name="test-mailing"
        	// onChange={this.handleChange}
        	placeholder="Post some lorem ipsum here"
        	required
        	// value={this.state.feedback}
        	style={{width: '100%', height: '150px'}}
      	/>
    	</div>
    	<input type="button" value="Submit" className="btn btn--submit" onClick={handleClick}   />
  	</form>
    </div>
  )
}
