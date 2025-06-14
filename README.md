# Sales Management Backend

Team Members:
- Johan Reinaldo Jianta - 0806022210005
- Rayhan Alkhafi Ifkanulsyahdan - 0806022210010

## Summary

This project implements Amazon Web Services (AWS) free tier-based backend infrastructure to support the Sales Management application. The infrastructure is designed with scalability, security, deployment automation, and cost savings in mind. The main services used include **Amazon EC2**, **Amazon RDS**, **Amazon S3**, **Amazon CloudFront**, and **GitHub Actions** as part of the CI/CD pipeline.

![Sales Backend Architecture Diagram](https://github.com/user-attachments/assets/a0c654f2-41d6-4e27-bf4c-826799345b78)

## AWS Resource Specifications

### 1) Amazon EC2

- **Instance type**: t2.micro Ubuntu Server 24.04 LTS 64-bit (x86)
- **Key Pair**: ED25519 (pem)
- **Storage**: 1 x 20 GiB gp3
- **Security Group**:

  | Type   | Port | Source       | Task          |
  | ------ | ---- | ------------ | ------------- |
  | SSH    | 22   | IP Developer | Remote access |
  | HHTP   | 80   | 0.0.0.0/0    | Web service   |
  | HTTPS  | 443  | 0.0.0.0/0    | SSL           |
  | Custom | 3000 | 0.0.0.0/0    | ExpressJS     |

### 2) Amazon RDS

- **Instance type**: MySQL
- **Security Group**:

  | Type         | Port | Source        | Task  |
  | ------------ | ---- | ------------- | ----- |
  | MYSQL/Aurora | 3306 | VPC IPv4 CIDR | MySQL |

### 3) Amazon S3

- **Instance type**: General purpose bucket
- **Security**: Block all public access
- **Region**: ap-southeast-1

## Setup Instructions

- Create an instance for each of EC2, RDS, and S3, following the specifications above.
- Create a custom policy that references the ARN of the created S3 bucket and grants these permissions:

  | Access | Action       | Task                |
  | ------ | ------------ | ------------------- |
  | Read   | GetObject    | Fetch files         |
  | Write  | PutObject    | Add or update files |
  | Write  | DeleteObject | Remove files        |

- Create an IAM user, attach the custom policy, then create an access key for accessing the S3 bucket via S3 Client SDK.
- Create .env file with the following variables inside:

  | Variable          | Description                                   |
  | ----------------- | --------------------------------------------- |
  | PORT              | ExpressJS port (adjust to EC2 Security Group) |
  | DATABASE_URL      | Connection URL for Prisma ORM                 |
  | JWT_SECRET        | Secret key for JWT verification               |
  | BUCKET_NAME       | S3 bucket name                                |
  | BUCKET_REGION     | S3 bucket region                              |
  | ACCESS_KEY_ID     | IAM user access key ID                        |
  | SECRET_ACCESS_KEY | IAM user secret access key                    |

- Use ansible to automate setup on EC2:

  - Open ansible inventory and add EC2 as managed node.

    ```
    [aws]
    ec2_node ansible_host=<ec2_host> ansible_user=<ec2_user> ansible_ssh_private_key_file=<path_to_key_pair>
    ```

  - Create a playbook named "cloud_backend_setup.yml".

    ```yaml
    - name: Configure EC2 Node for Deployment Automation
      hosts: ec2_node
      become: yes

      vars:
        env_path: <path_to_env_file>
        remote_project_directory: <project_directory_on_ec2>
        dockerhub_image: <backend_image_on_dockerhub>

      tasks:
        - name: Install prerequisites
          apt:
            name:
              - apt-transport-https
              - ca-certificates
              - curl
              - gnupg
              - software-properties-common
            state: present
            update_cache: yes

        - name: Add Docker GPG key
          apt_key:
            url: https://download.docker.com/linux/ubuntu/gpg
            state: present

        - name: Add Docker repository
          apt_repository:
            repo: "deb https://download.docker.com/linux/ubuntu {{ ansible_lsb.codename }} stable"
            state: present
            update_cache: yes

        - name: Install Docker Engine
          apt:
            name:
              - docker-ce
              - docker-ce-cli
              - containerd.io
            state: present

        - name: Start and enable Docker service
          service:
            name: docker
            state: started
            enabled: yes

        - name: Add user to docker group
          user:
            name: "{{ ansible_user }}"
            groups: docker
            append: yes

        - name: Install Docker Compose plugin
          apt:
            name: docker-compose-plugin
            state: present

        - name: Ensure remote project directory exists
          ansible.builtin.file:
            path: "{{ remote_project_directory }}"
            state: directory
            mode: "0755"

        - name: Copy backend environment file to AWS Node
          ansible.builtin.copy:
            src: "{{ env_path }}"
            dest: "{{ remote_project_directory }}/.env"
            owner: ubuntu
            group: ubuntu
            mode: "0600"

        - name: Create docker-compose.yml in remote project directory
          ansible.builtin.copy:
            dest: "{{ remote_project_directory }}/docker-compose.yml"
            content: |
              services:
                backend:
                  image: "{{ dockerhub_image }}"
                  container_name: sales-backend
                  env_file:
                    - .env
                  ports:
                    - "3000:3000"
                  restart: always
            owner: ubuntu
            group: ubuntu
            mode: "0644"
    ```

  - Run the playbook.

    ```

    ansible-playbook cloud_backend_setup.yml

    ```

## Deployment Instructions

- Generate a Personal Access Token for Docker Hub account with “Read, Write, Delete” permissions.
- Create secrets and variables for GitHub Actions on repository Settings:

  | Name               | Type     | Description                      |
  | ------------------ | -------- | -------------------------------- |
  | EC2_HOST           | Secret   | EC2 public IPv4 address or DNS   |
  | EC2_USER           | Secret   | EC2 username                     |
  | EC2_KEY_PAIR       | Secret   | EC2 key pair for SSH             |
  | DOCKERHUB_TOKEN    | Secret   | Docker Hub Personal Access Token |
  | DOCKERHUB_USERNAME | Variable | Docker Hub username              |
  | DOCKERHUB_IMAGE    | Variable | Backend image name on Docker Hub |

- Push to master branch to trigger the GitHub Actions.

## REST API Documentation

Proyek ini menggunakan Swagger untuk mendokumentasikan REST API yang dikembangkan.

Halaman dokumentasi dari Swagger dapat diakses melalui URL berikut.  
http://ec2-18-139-110-33.ap-southeast-1.compute.amazonaws.com/api-docs
  
Untuk dokumentasi dalam bentuk JSON dapat diakses melalui URL berikut.  
http://ec2-18-139-110-33.ap-southeast-1.compute.amazonaws.com/api-docs.json

## Explanation of Choices

The configuration of this backend project was carefully chosen to align with the goals of scalability, cost efficiency, and deployment automation, especially within the AWS Free Tier.
- **Amazon EC2** (t2.micro) was selected for its eligibility under the Free Tier and sufficient resources for containerized backend services.
- **Amazon RDS** with MySQL was chosen for its managed database capabilities, seamless integration with Prisma ORM, and support for relational queries essential to the system’s structure.
- **Amazon S3**, paired with **CloudFront**, provides secure and efficient storage and distribution of static assets, while public access is disabled to ensure data security.
- **GitHub Actions** enables a fully automated CI/CD pipeline, improving deployment speed and reliability.
- **Ansible-based** automation setup on EC2, simplifies infrastructure management and ensures consistent deployment environments.
