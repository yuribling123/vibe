This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev

```
## Test Background Job Server

```bash
npx inngest-cli@latest dev
```

## Run database studio
npx prisma studio

## update
use ingest to create ai agent instance
use TRPC as the bridge to safe type call backend functions from frontend
use e2b to build template envirornment for container 
```
e2b template build --name vibe-nextjs-test-2 --cmd "/compile_page.sh"
```


React (client)
   ↓
tRPC mutation  → small backend handler
   ↓
inngest.send() → triggers background function
                     ↓
                 AI runs here

### note 
Background jobs let user run slow AI work without blocking the user request.