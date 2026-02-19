FROM node:21-slim

RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /home/user/app

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Create Next.js app
RUN npx --yes create-next-app@15.3.3 . --yes

# Install shadcn
RUN npx --yes shadcn@2.6.3 init --yes -b neutral --force
RUN npx --yes shadcn@2.6.3 add --all --yes

# 🔑 Ensure dependencies are properly installed
RUN npm install