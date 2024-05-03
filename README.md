# TaskTracker - Cloud-Based Task Management Application

TaskTracker is a cloud-based task management application designed to provide users with an efficient way to manage tasks, deadlines, and priorities. Developed by Angel Christian as a term assignment for the course CSCI 5409 Advanced Cloud Computing at Dalhousie University under the supervision of Prof. Robert Hawkey.

## Project Introduction

TaskTracker allows users to create, edit, and delete tasks, set deadlines, and mark tasks as completed. It offers key features such as task management, deadline tracking, user authentication, and responsive design.

### Key Features
- Task Management: Create, edit, and mark tasks as completed.
- Deadline Tracking: Set deadlines for tasks to stay organized.
- User Authentication: Secure user authentication using JWT tokens.
- Responsive Design: Access and manage tasks from various devices.

### Target Users
- Suitable for individuals, teams, and organizations needing a centralized task management platform.
- Users valuing simplicity, ease of use, and accessibility in task management software.

### Performance Targets
- Smooth and seamless user experience with fast loading times.
- Data protection and confidentiality.
- Optimized data storage and retrieval for timely access.
- Real-time visibility into application performance and health.

## Services Used

### Compute
- AWS EC2 for hosting frontend and backend components.
- AWS Lambda for serverless execution of email notification tasks.

### Storage
- AWS RDS (PostgreSQL) for managed relational database service.

### Network
- AWS VPC for creating isolated network environments.
- Public and private subnets for hosting frontend, backend, and database components.

### General
- AWS Secrets Manager for securely storing sensitive information.
- AWS SNS for sending email notifications to admin.

## Delivery Model

TaskTracker follows the Software-as-a-Service (SaaS) delivery model, leveraging various AWS services to provide a scalable, cost-effective, and efficient solution accessible via the internet without the need for users to install or manage infrastructure.

## Deployment Model

The deployment model is a public cloud deployment on AWS, utilizing services like EC2, RDS, Lambda, and SNS. The architecture ensures scalability, security, compliance, cost-efficiency, and ease of management.

## Final Architecture

The architecture comprises several components working together seamlessly, orchestrated through AWS CloudFormation. It includes VPC, subnets, internet gateway, RDS, EC2 instances, security groups, Secrets Manager, Lambda function, and SNS.

## Security Measures

TaskTracker implements various security measures including VPC isolation, JWT-based authentication, Secrets Manager for sensitive data, IAM-based access control, and encryption.

## Future Features Implementation

Planned future features include data visualization and reporting, integration with third-party tools, task analytics and insights, and file attachments for tasks.

## References

- AWS Documentation: [link](https://docs.aws.amazon.com/)
- AWS Academy: [link](https://aws.amazon.com/training/awsacademy/)
- AWS CloudFormation: [link](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/gettingstarted.templatebasics.html)
- Cloud Deployment Calculator: [link](https://openmetal.io/cloud-deployment-calculator/)
- OpenStack Pricing Calculator: [link](https://ubuntu.com/openstack/pricing-calculator/)

