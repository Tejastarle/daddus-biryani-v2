# Setting up after extracting the project

## 1. Install dependencies

```powershell
npm install
```

The deprecation warnings and the `npm audit` numbers are normal for this Next.js
version and do not stop the site running. **Do not run `npm audit fix --force`** —
it will upgrade Next.js and break the build.

## 2. Create `.env.local`

**This is the step people miss.** `.env.local` holds your secret keys, so it is
deliberately never included in the zip or in git. After extracting the project to
a new folder you have to create it again, or enquiries will not save.

Create a file named exactly `.env.local` in the project root — the same folder as
`package.json` — containing:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=you@example.com
```

Get the first two from Supabase: **Project Settings → API**.

### Windows: make sure the filename is right

File Explorer hides extensions, so a file saved from Notepad often becomes
`.env.local.txt` and Next.js ignores it. Create it from PowerShell instead, run
from the project folder:

```powershell
@'
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=you@example.com
'@ | Out-File -FilePath .\.env.local -Encoding ascii -Force
```

Then check it is there, with no `.txt` on the end:

```powershell
Get-ChildItem -Force .env*
```

## 3. Set up the database

Open supabase.com → your project → **SQL Editor** → **New query**, paste the whole
of `DATABASE_SCHEMA.sql`, and click **Run**. It is safe to run more than once.

Then create your admin login: **Authentication → Users → Add user**, tick
*Auto confirm user*, and put that email in `NEXT_PUBLIC_ADMIN_EMAIL` above.

## 4. Start the site

```powershell
npm run dev
```

The startup output should now include this line:

```
   - Environments: .env.local
```

If that line is missing, the file is in the wrong place or has the wrong name —
go back to step 2.

## 5. When you deploy

`.env.local` is not uploaded. Add the same three variables in your host's settings
(on Vercel: **Project → Settings → Environment Variables**) and redeploy.

---

## Running without the keys

The site no longer crashes if the keys are missing. Every page loads and the menu,
photos and downloads all work; only the database features are unavailable:

- enquiries are not saved to `/admin/leads`
- blog posts do not load

You will see a `[Supabase] ... are not set` warning in the terminal. That warning is
the signal that step 2 has not been done.
