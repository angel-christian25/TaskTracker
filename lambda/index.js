const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();


const emailSecretName = 'nodemailerPass2'; 

exports.handler = async (event) => {
  try {
    console.log('Starting Lambda execution...event',event);

    const { todos } = event;
    console.log("receidved todos",todos);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23);
    tomorrow.setMinutes(39);

    const todayString = today.toISOString().slice(0, 10);
    const tomorrowString = tomorrow.toISOString().slice(0, 10);

    console.log('Today:', todayString);
    console.log('Tomorrow:', tomorrowString);

    console.log('Filtering todos...');

    const todayTasks = todos?.filter(todo => {
      const todoDeadline = todo.deadline.split('T')[0]; 
      return todoDeadline === todayString && todo.is_open;
    });
    
    const closedTodayTasks = todos?.filter(todo => {
      const todoClosedAt = todo.closed_at ? todo.closed_at.split('T')[0] : null; 
      return todoClosedAt === todayString;
    });
    
    const tomorrowTasks = todos?.filter(todo => {
      const todoDeadline = todo.deadline.split('T')[0]; 
      return todoDeadline === tomorrowString && todo.is_open;
    });

    console.log('Filtered todos:');
    console.log('Today Tasks:', todayTasks);
    console.log('Closed Today Tasks:', closedTodayTasks);
    console.log('Tomorrow Tasks:', tomorrowTasks);

    
    const usersEmails = {};
    todos?.forEach(todo => {
      if (!usersEmails[todo.user_email]) {
        usersEmails[todo.user_email] = {
          todayTasks: [],
          closedTodayTasks: [],
          tomorrowTasks: []
        };
      }
      if (todayTasks.some(task => task.id === todo.id)) {
        usersEmails[todo.user_email].todayTasks.push(todo);
      }
      if (closedTodayTasks.some(task => task.id === todo.id)) {
        usersEmails[todo.user_email].closedTodayTasks.push(todo);
      }
      if (tomorrowTasks.some(task => task.id === todo.id)) {
        usersEmails[todo.user_email].tomorrowTasks.push(todo);
      }
    });

    console.log('Filtered todos by user email:', usersEmails);

    for (const userEmail in usersEmails) {
      const emailBody = getEmailBody(usersEmails[userEmail]);

      console.log('Email body:', emailBody);

      await sendEmails(emailBody, userEmail);
      console.log(`Email sent successfully to ${userEmail}`);
    }

    console.log('Emails sent successfully');

    return {
      statusCode: 200,
      body: 'Emails sent successfully',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};

const formatTasks = (tasks) => {
  let formattedTasks = '';
  tasks?.forEach((task) => {
    formattedTasks += `<li>${task.title}</li>`;
  });
  return formattedTasks;
};

const getEmailBody = (tasks) => {
  return `
    <h2>Task Reminder</h2>
    <h3>Unclosed Tasks with Deadline Today:</h3>
    <ul>
      ${formatTasks(tasks.todayTasks)}
    </ul>
    <h3>Tasks Closed Today:</h3>
    <ul>
      ${formatTasks(tasks.closedTodayTasks)}
    </ul>
    <h3>Tasks with Deadline Tomorrow:</h3>
    <ul>
      ${formatTasks(tasks.tomorrowTasks)}
    </ul>
  `;
};

const sendEmails = async (emailBody, userEmail) => {
  try {
    if (!emailBody.trim()) {
      console.log(`No tasks to send for ${userEmail}. Skipping email.`);
      return;
    }
    console.log('Sending email to', userEmail);
    // Retrieve email password from Secrets Manager
    const emailPassword = await getSecretValue(emailSecretName);
    const passwordSecret = JSON.parse(emailPassword);


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'angel.17beitg111@gmail.com',
        pass: passwordSecret.nodemailerPass2
      }
    });

    // Send email
    const mailOptions = {
      from: 'angel.17beitg111@gmail.com', 
      to: userEmail,
      subject: 'Task Reminder', 
      html: emailBody 
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Function to retrieve secret value from Secrets Manager
const getSecretValue = async (secretName) => {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    if ('SecretString' in data) {
      return data.SecretString;
    } else {
      const buff = Buffer.from(data.SecretBinary, 'base64');
      return buff.toString('ascii');
    }
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
};
