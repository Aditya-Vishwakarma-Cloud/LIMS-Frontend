# Construction Material Quality LIMS — Frontend Architecture & Development Setup

## Frontend Technology Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 15 (App Router) |
| Language         | TypeScript              |
| Styling          | Tailwind CSS            |
| UI Components    | shadcn/ui               |
| State Management | Zustand                 |
| API Layer        | Axios                   |
| Data Fetching    | TanStack Query          |
| Forms            | React Hook Form         |
| Validation       | Zod                     |
| Authentication   | JWT + RBAC              |
| Charts           | Recharts                |
| Notifications    | Sonner                  |
| Icons            | Lucide React            |
| Tables           | TanStack Table          |

---

# Phase 1 Frontend Goals (MVP)

We will first build:

1. Authentication
2. Dashboard
3. Project Management
4. Sample Management
5. Test Workflow
6. Report Management
7. User Management
8. Role-Based Access Control (RBAC)

---

# Recommended Frontend Architecture

```text
src/
 ├── app/
 │    ├── login/
 │    ├── dashboard/
 │    ├── projects/
 │    ├── samples/
 │    ├── tests/
 │    ├── reports/
 │    ├── users/
 │    └── settings/
 │
 ├── components/
 │    ├── common/
 │    ├── layout/
 │    ├── dashboard/
 │    ├── forms/
 │    ├── tables/
 │    ├── charts/
 │    └── ui/
 │
 ├── services/
 │    ├── api.ts
 │    ├── auth.service.ts
 │    ├── sample.service.ts
 │    ├── project.service.ts
 │    └── report.service.ts
 │
 ├── store/
 │    ├── auth.store.ts
 │    └── ui.store.ts
 │
 ├── hooks/
 │    ├── useAuth.ts
 │    ├── useProjects.ts
 │    └── useSamples.ts
 │
 ├── types/
 │    ├── auth.types.ts
 │    ├── project.types.ts
 │    └── sample.types.ts
 │
 ├── lib/
 │    ├── utils.ts
 │    ├── constants.ts
 │    └── permissions.ts
 │
 └── middleware.ts
```

---

# UI Design Strategy

## Design Philosophy

The LIMS UI should feel:

* Clean
* Professional
* Industrial-grade
* Fast
* Data-focused
* Workflow-oriented

Avoid:

* Over-animation
* Fancy unnecessary UI
* Complex layouts

Focus on:

* Tables
* Status tracking
* Workflow visibility
* Fast data entry
* Operational efficiency

---

# Main Application Layout

```text
-------------------------------------------------
 Sidebar      | Header/Navbar
               ----------------------------------
               | Dashboard Content Area
               |
               |
               |
-------------------------------------------------
```

---

# Sidebar Navigation

## Main Modules

```text
Dashboard
Projects
Samples
Tests
Reports
Users
Equipment
Notifications
Settings
```

---

# Dashboard Features

## Dashboard Widgets

### KPI Cards

* Total Samples
* Pending Tests
* Approved Reports
* Failed Samples
* Active Projects

### Charts

* Test Status Distribution
* Monthly Sample Trends
* Turnaround Time
* Material Quality Trends

### Recent Activity

* Recent samples
* Pending approvals
* Notifications

---

# Authentication System

## Features

* JWT Authentication
* Refresh Token Strategy
* RBAC
* Session Persistence
* Route Protection

---

# Suggested Roles

```text
Admin
Lab Manager
Technician
Quality Engineer
Client Viewer
```

---

# Route Protection Example

| Route      | Access                  |
| ---------- | ----------------------- |
| /dashboard | All authenticated users |
| /users     | Admin only              |
| /tests     | Technician + Manager    |
| /reports   | Engineer + Manager      |

---

# Sample Management Module

## Features

### Sample Registration

Fields:

```text
Sample ID
Project
Material Type
Collection Date
Collected By
Site Location
Batch Number
Priority
Status
```

---

## Sample Status Workflow

```text
Collected
Received
Testing
Review
Approved
Rejected
Completed
```

---

# Test Management Module

## Features

* Assign Tests
* Enter Results
* Upload Attachments
* QA Review
* Approvals
* Retest Management

---

# Report Module

## Features

* Generate PDF Reports
* Download Reports
* QR Verification
* Digital Signature Integration
* Approval Tracking

---

# Equipment Module

## Features

* Equipment Registry
* Calibration Tracking
* Expiry Alerts
* Maintenance Logs

---

# API Integration Strategy

## Base API Structure

```text
/api/v1/auth
/api/v1/projects
/api/v1/samples
/api/v1/tests
/api/v1/reports
```

---

# Axios Setup Strategy

## Centralized API Client

Features:

* JWT interceptor
* Auto refresh token
* Error handling
* Retry strategy
* Request logging

---

# State Management Strategy

## Zustand Usage

Use Zustand only for:

* Authentication state
* Theme/UI state
* Global filters
* User permissions

Avoid storing server data in Zustand.

Use TanStack Query for server state.

---

# Data Fetching Strategy

## TanStack Query

Benefits:

* Caching
* Background refetching
* Retry handling
* Optimistic updates
* Pagination support

---

# Form Strategy

## Use

* React Hook Form
* Zod Validation

Benefits:

* Fast forms
* Better validation
* Clean architecture
* Type-safe validation

---

# Table Strategy

## Use TanStack Table

Important for:

* Large datasets
* Filtering
* Sorting
* Pagination
* Export
* Column visibility

LIMS systems are heavily table-driven.

---

# Notification Strategy

## Use

* Sonner Toasts
* Notification Center

Events:

* Test approved
* Sample rejected
* Calibration expired
* Report generated

---

# Frontend Security Best Practices

## Important Rules

### Never Store

* sensitive secrets
* API keys
* database credentials

inside frontend.

---

## Use

* HTTP-only cookies
* secure JWT strategy
* role validation
* route guards

---

# Recommended Folder Naming Convention

```text
kebab-case for folders
PascalCase for components
camelCase for functions
```

---

# Recommended Environment Structure

## Development

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## Production

```env
NEXT_PUBLIC_API_URL=https://api.company.com/api/v1
```

---

# Docker Strategy For Frontend

## Multi-stage Docker Build

Recommended:

```text
Builder Stage
   ↓
Production Runner Stage
```

Use:

* non-root user
* minimal image
* standalone build

---

# Recommended Frontend Dockerfile Strategy

```dockerfile
# Build stage
FROM node:22-alpine AS builder

# Production stage
FROM node:22-alpine
```

---

# Frontend CI Pipeline

## GitHub Actions Steps

```text
Install
Lint
Type Check
Unit Test
Build
Docker Build
Trivy Scan
Push Image
```

---

# Recommended Initial Screens

## 1. Login Page

Features:

* Email/password
* Remember me
* Forgot password

---

## 2. Dashboard

Features:

* KPI cards
* charts
* recent activity
* pending tasks

---

## 3. Project List

Features:

* create project
* edit project
* status tracking

---

## 4. Sample List

Features:

* searchable table
* filter by status
* barcode/QR support

---

## 5. Test Entry Form

Features:

* dynamic fields
* validation
* approval workflow

---

# Recommended UI Color Strategy

Since this is industrial/construction domain:

Use:

```text
Neutral colors
Gray
Slate
Blue
Amber accents
```

Avoid:

* neon colors
* gaming-style UI
* overly playful design

---

# Suggested Frontend Development Roadmap

## Phase 1

Setup:

```text
Next.js
Tailwind
shadcn/ui
ESLint
Prettier
Husky
Docker
```

---

## Phase 2

Build:

```text
Authentication
Layout
Sidebar
Dashboard
RBAC
```

---

## Phase 3

Build:

```text
Projects Module
Samples Module
Test Module
```

---

## Phase 4

Build:

```text
Reports
Notifications
Audit UI
```

---

## Phase 5

Production Hardening:

```text
Docker optimization
CI/CD
Security scanning
Monitoring
Performance optimization
```

---

# Recommended Initial Package Installation

```bash
npm install axios zustand @tanstack/react-query react-hook-form zod @hookform/resolvers lucide-react recharts sonner
```

---

# Recommended shadcn Components

Install:

```text
button
card
input
dialog
dropdown-menu
table
sheet
form
select
tabs
toast
badge
skeleton
```

---

# Architecture Principle For This Frontend

Always prioritize:

```text
Maintainability
Scalability
Clean UX
Operational efficiency
Security
Fast workflows
Reusable components
```

instead of:

```text
Fancy UI
Complex animations
Unnecessary libraries
Over-engineering
```

---

# Recommended Next Step

Now the best next step is:

## Build Foundation Setup

1. Initialize Next.js project
2. Configure Tailwind
3. Configure shadcn/ui
4. Setup layout architecture
5. Setup authentication flow
6. Create dashboard layout
7. Create reusable table system
8. Setup API layer
9. Setup Docker
10. Setup ESLint + Prettier + Husky

After that:

Build modules one by one.
