This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

ingest server need to be run in background

First, run the development server:

```bash
npm run dev

```
## Test Background Job Server

```bash
npx inngest-cli@latest dev
```

## Run container template
```
e2b template build --name vibe-nextjs-test-2 --cmd "/compile_page.sh"
```



## Run database studio
npx prisma studio

## update
use ingest's kit for background jobs and ai agent 
use TRPC as the bridge to safe type call backend functions from frontend
use e2b to build container with template envirornment 


React (client)
   ↓
tRPC mutation  → small backend handler
   ↓
inngest.send() → triggers background function
                     ↓
                 AI runs here

### note 
Background jobs let user run slow AI work without blocking the user request.