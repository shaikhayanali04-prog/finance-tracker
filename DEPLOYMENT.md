# Trakify Pro - Deployment Guide 🚀

This document outlines the final, production-ready deployment strategies for the Trakify application. We have built it strictly following the senior architectural requirements.

## 🗂️ Production Folder Structure

```
finance-tracker/
├── frontend/                 # React SPA (Vercel / Netlify Deployable)
│   ├── .env.example          # Template for frontend environment variables
│   ├── package.json
│   ├── tailwind.config.js
│   └── src/                  # Refactored to include Goals, DashboardCharts, etc.
└── backend/
    └── demo/                 # Java Spring Boot REST API
        ├── pom.xml           # Backend dependencies and build specs
        ├── src/main/resources/
        │   ├── application.properties        # Local / Dev config (H2 in memory)
        │   └── application-prod.properties   # Production config (MySQL + secure vars)
        └── src/main/java...
```

---

## 💻 1. Database Setup (Production MySQL)

In production, you will move away from the local H2 database and use **MySQL**. 
1. Create a database called `trakify_db` on your hosting provider (cPanel, Hostinger, RDS, etc.).
2. You do **not** need to manually run migrations. The application uses `spring.jpa.hibernate.ddl-auto=update` which will automatically generate and normalize the tables (`users`, `expenses`, `income`, `savings_goals`, `budgets`) on startup.

---

## ⚙️ 2. Backend Deployment (VPS / Hostinger / cPanel)

### Instructions
1. Navigate into the backend directory:
   ```bash
   cd backend/demo
   ```
2. Build the production `.jar` file using Maven:
   ```bash
   ./mvnw clean package -DskipTests
   ```
3. This creates a file at `target/demo-0.0.1-SNAPSHOT.jar`. Upload this file to your VPS or Hosting environment.
4. Run the JAR file with the `prod` profile, passing in your production variables:

   ```bash
   java -jar -Dspring.profiles.active=prod \
     -DDB_URL=jdbc:mysql://localhost:3306/trakify_db \
     -DDB_USERNAME=your_db_user \
     -DDB_PASSWORD=your_db_pass \
     -DJWT_SECRET=your_32_character_minimum_secure_jwt_secret \
     -DFRONTEND_URL=https://your-frontend-domain.vercel.app \
     -DPORT=8080 \
     demo-0.0.1-SNAPSHOT.jar
   ```

*Note: For Hostinger/cPanel shared hosting, ensure you use their Application Manager for Java apps, or use a Docker container if on VPS.*

---

## 🌐 3. Frontend Deployment (Vercel / Netlify)

Vercel is the recommended hosting for this React SPA.

### Instructions
1. Push your code to a GitHub repository.
2. Go to **Vercel** -> Add New Project -> Import the Repository.
3. Configure the Root Directory to `frontend`.
4. Add the following **Environment Variables** in the Vercel dashboard:
   - `REACT_APP_API_URL` = `https://api.yourdomain.com` *(Point this to wherever you hosted the `.jar` above)*
5. Click **Deploy**. Vercel will automatically run `npm run build` and publish your app globally.

---

## 🔒 Security Best Practices Implemented
- **CORS Restricted**: The `application-prod.properties` injects the specific frontend URL, preventing third-party domain abuse.
- **Environment Driven Configuration**: No secrets (database credentials, JWT secrets) are hardcoded.
- **SQL Injection Safety**: Strict JPA/Hibernate prepared statements used throughout all repositories.
- **Sanitized Entities**: The `users` table keyword conflicts have been patched for production compatibility.
