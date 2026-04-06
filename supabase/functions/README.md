# Apex Pro — Supabase Edge Functions

This directory contains the AI-powered backend logic for Apex Pro, built with Supabase Edge Functions (Deno) and Anthropic Claude.

## Setup

### 1. Push the database schema
Ensure you have the Supabase CLI installed and linked to your project.
```bash
supabase db push
```

### 2. Set secrets
Configure the required API keys in your Supabase project.
```bash
supabase secrets set ANTHROPIC_API_KEY=your_key_here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

### 3. Deploy all functions
Deploy each function to your Supabase project.
```bash
supabase functions deploy generate-workout
supabase functions deploy generate-diet
supabase functions deploy log-progress
supabase functions deploy fitness-chat
supabase functions deploy get-user-profile
supabase functions deploy update-user-profile
supabase functions deploy get-history
```

---

## API Reference

| Method | Endpoint | Auth | Description | Request Body | Response Shape |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/generate-workout` | JWT | Generates a 6-day PPL workout plan using AI. | `{ fitness_goal, weight_kg, experience_level }` | `{ success, data: { workout_id, plan } }` |
| **POST** | `/generate-diet` | JWT | Generates a 7-day meal plan (Indian-focused). | `{ goal, weight_kg, is_indian_meal_plan? }` | `{ success, data: { diet_plan_id, plan } }` |
| **POST** | `/log-progress` | JWT | Logs weight/stats and generates AI trend analysis. | `{ weight_kg, body_fat_pct?, notes?, photo_url? }` | `{ success, data: { entry_id, ai_insight } }` |
| **POST** | `/fitness-chat` | JWT | Interactive AI coaching & fitness Q&A. | `{ message, conversation_history? }` | `{ success, data: { reply } }` |
| **GET** | `/get-user-profile` | JWT | Returns the user's profile metadata. | `None` | `{ success, data: { profile } }` |
| **PUT** | `/update-user-profile` | JWT | Updates user profile metadata (upsert). | `{ name, age, weight_kg, fitness_goal, experience_level }` | `{ success, data: { profile } }` |
| **GET** | `/get-history` | JWT | Fetches paginated history for user data types. | `Query Params: type, limit` | `{ success, data: { items, count, type, limit } }` |

---

## Error Codes

| Status Code | Meaning | When it occurs |
| :--- | :--- | :--- |
| **200** | Success | Standard successful GET/PUT requests. |
| **201** | Created | Successful resource creation (POST). |
| **400** | Bad Request | Missing required fields or invalid input types. |
| **401** | Unauthorized | Missing, invalid, or expired Bearer token. |
| **404** | Not Found | Requested resource (e.g., profile) does not exist. |
| **500** | Server Error | AI processing failure or database connection issue. |

---

## Development Notes

- **AI Model**: `claude-sonnet-4-20250514`
- **Strict Mode**: TypeScript strict mode is enforced across all functions.
- **Security**: Row-Level Security (RLS) is enabled on all PostgreSQL tables.
- **Auth**: Every endpoint is protected via Supabase JWT (Authorization: Bearer token).
