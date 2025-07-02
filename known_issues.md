
# Known Issues and Bugs

## HIGH PRIORITY

### ISSUE-001: Mock Data Dependencies
- **Files**: src/pages/Dashboard.tsx, src/data/mockData.ts
- **Problem**: Dashboard still uses mock data instead of Supabase queries
- **Impact**: Data not persistent, inconsistent with real database
- **Fix**: Replace all mock data arrays with proper Supabase queries

### ISSUE-002: Text Alignment Problems  
- **Files**: Multiple form and table components
- **Problem**: Overuse of 'text-center' class in forms, tables, and inputs
- **Impact**: Poor UX, forms look unprofessional
- **Fix**: Use 'text-left' by default, center only KPIs/hero sections

### ISSUE-003: Calendar Meeting Limits
- **Files**: Calendar/meeting management components
- **Problem**: 2-meeting per day limit, duplicate entries, poor validation
- **Impact**: Users cannot schedule multiple meetings, data inconsistency
- **Fix**: Remove artificial limits, add proper validation

## MEDIUM PRIORITY

### ISSUE-004: User Management Incomplete
- **Problem**: No ChairmanPEC user creation, limited admin controls
- **Impact**: Cannot manage users properly
- **Fix**: Add user management interface, role creation

### ISSUE-005: Type Definitions Scattered
- **Files**: Multiple type files
- **Problem**: Interfaces spread across different files
- **Impact**: Maintenance difficulty, type inconsistencies  
- **Fix**: Consolidate in src/types/index.ts

### ISSUE-006: Layout Inconsistencies
- **Problem**: Inconsistent padding, margins, responsive behavior
- **Impact**: Poor mobile experience, visual inconsistencies
- **Fix**: Standardize Tailwind classes, test responsive design
