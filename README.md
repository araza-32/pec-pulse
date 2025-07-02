
# PEC Pulse - Pakistan Engineering Council Management System

A comprehensive workbody management system for Pakistan Engineering Council built with React, TypeScript, and Supabase.

## 🚀 Quick Start

Before making any changes to this project, please:

1. **Read the documentation files first:**
   - `/features.md` - Current feature status and roadmap
   - `/known_issues.md` - Active bugs and issues that need attention

2. **Development Setup:**
   ```bash
   npm install
   npm run dev
   ```

3. **Architecture Overview:**
   - Frontend: React + TypeScript + Tailwind CSS
   - Backend: Supabase (PostgreSQL + Auth + Storage)
   - State Management: React Query + Context API
   - UI Components: shadcn/ui

## 📋 Current Status

### ✅ Implemented Features
- Dashboard with real-time workbody overview
- Workbody management (CRUD operations)
- Meeting calendar and scheduling
- Minutes upload and document management
- User authentication and role-based access
- Task force extension functionality
- Reports generation

### 🚧 Known Issues
Please refer to `known_issues.md` for detailed bug reports and fixes needed.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── types/              # TypeScript type definitions
├── integrations/       # External service integrations
└── utils/              # Utility functions
```

## 🔧 Development Guidelines

1. **Text Alignment**: Use `text-left` by default, only center KPIs and hero sections
2. **Responsive Design**: Ensure all components work on mobile devices
3. **TypeScript**: All new code must be properly typed
4. **Consistent Spacing**: Use standardized Tailwind classes (p-4, m-4)
5. **Error Handling**: Always implement proper error states and loading indicators

## 📊 Database Schema

The application uses Supabase with the following main tables:
- `workbodies` - Committee/working group information
- `workbody_members` - Member assignments and roles
- `scheduled_meetings` - Meeting calendar entries
- `meeting_minutes` - Uploaded meeting documents
- `profiles` - User profile information

## 🔑 Environment Setup

Supabase configuration is handled automatically. No manual environment variables needed.

## 🧪 Testing

```bash
npm run build    # Check for build errors
npm run dev      # Start development server
```

## 📝 Contributing

1. Check `known_issues.md` for priority fixes
2. Update `features.md` when adding new functionality
3. Follow the existing code patterns and TypeScript conventions
4. Test responsive design on multiple screen sizes
5. Ensure proper error handling and loading states

## 🔗 Useful Links

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Important**: Always read `features.md` and `known_issues.md` before starting development work.
