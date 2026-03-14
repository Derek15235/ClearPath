# ClearPath — Adding a New Feature (Interview Cheat Sheet)

Quick reference for adding a small feature end-to-end. Follow these steps in order.

---

## 1. Backend: Database Model

**File:** `backend/app/models/<feature>.py`

```python
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
import uuid
from datetime import datetime, timezone

class ExampleItem(Base):
    __tablename__ = "example_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), index=True)
    title: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
```

> Register the model by importing it in `backend/app/models/__init__.py`.

---

## 2. Backend: Pydantic Schemas

**File:** `backend/app/schemas/<feature>.py`

```python
from pydantic import BaseModel
from datetime import datetime

class ExampleCreate(BaseModel):
    title: str

class ExampleResponse(ExampleCreate):
    id: str
    user_id: str
    created_at: datetime
    model_config = {"from_attributes": True}
```

---

## 3. Backend: API Router

**File:** `backend/app/routers/<feature>.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.example import ExampleItem
from app.schemas.example import ExampleCreate, ExampleResponse

router = APIRouter(prefix="/api/examples", tags=["examples"])

@router.post("/", response_model=ExampleResponse, status_code=201)
async def create_item(
    body: ExampleCreate,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    item = ExampleItem(user_id=user["sub"], title=body.title)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item

@router.get("/", response_model=list[ExampleResponse])
async def list_items(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ExampleItem).where(ExampleItem.user_id == user["sub"])
    )
    return result.scalars().all()
```

> Register the router in `backend/app/main.py`:
> ```python
> from app.routers.example import router as example_router
> app.include_router(example_router)
> ```

---

## 4. Frontend: Types

**File:** `frontend/src/types/<feature>.ts`

```typescript
export type ExampleItem = {
  id: string
  user_id: string
  title: string
  created_at: string
}

export type ExampleCreate = {
  title: string
}
```

---

## 5. Frontend: API Calls

Use the existing `apiFetch` helper in `frontend/src/lib/api.ts`.

```typescript
import { apiFetch } from '../lib/api'
import type { ExampleItem, ExampleCreate } from '../types/example'

// GET
const items = await apiFetch<ExampleItem[]>('/api/examples/')

// POST
const newItem = await apiFetch<ExampleItem>('/api/examples/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'My item' } satisfies ExampleCreate),
})
```

---

## 6. Frontend: Page Component

**File:** `frontend/src/pages/ExamplePage.tsx`

```tsx
import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../lib/api'
import { PageHeader, Card, Button, Skeleton, ErrorState } from '../components/ui'
import type { ExampleItem } from '../types/example'

export default function ExamplePage() {
  const [items, setItems] = useState<ExampleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiFetch<ExampleItem[]>('/api/examples/')
      setItems(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetchItems() }, [fetchItems])

  if (loading) return <Skeleton className="h-64" />
  if (error) return <ErrorState message={error} onRetry={fetchItems} />

  return (
    <>
      <PageHeader title="Examples" description="Your items" />
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} padding="md">
            <p className="text-content">{item.title}</p>
          </Card>
        ))}
      </div>
    </>
  )
}
```

---

## 7. Frontend: Add the Route

**File:** `frontend/src/app/routes.tsx`

```tsx
// Add lazy import at the top
const ExamplePage = lazy(() => import('../pages/ExamplePage'))

// Add inside the children array of the AppLayout route
{ path: 'examples', element: <ExamplePage /> },
```

---

## 8. Frontend: Add Nav Link (if needed)

**File:** `frontend/src/components/layout/TopNavigationBar.tsx`

```tsx
import { ListChecks } from 'lucide-react'  // pick an icon

// Add to the NAV_LINKS array
{ to: '/examples', label: 'Examples', icon: ListChecks },
```

---

## Key Patterns to Remember

| Pattern | How it works |
|---------|-------------|
| **Auth** | Backend: `user = Depends(get_current_user)` extracts user ID from JWT as `user["sub"]` |
| **API client** | Frontend: `apiFetch<T>(path, options)` auto-attaches Bearer token from Supabase session |
| **Styling** | Tailwind CSS with design tokens: `text-content`, `bg-surface`, `border-border` |
| **UI components** | Import from `../components/ui` — Button, Card, Input, Badge, Modal, Skeleton, ErrorState, EmptyState, PageHeader |
| **State** | Zustand for global (auth/onboarding), useState for page-local |
| **Loading states** | Show `<Skeleton />` while fetching, `<ErrorState />` on failure |
| **Class merging** | Use `cn()` from `../lib/cn` to combine Tailwind classes |

## File Checklist (copy this)

- [ ] `backend/app/models/<feature>.py` — SQLAlchemy model
- [ ] `backend/app/models/__init__.py` — import new model
- [ ] `backend/app/schemas/<feature>.py` — Pydantic schemas
- [ ] `backend/app/routers/<feature>.py` — API endpoints
- [ ] `backend/app/main.py` — register router
- [ ] `frontend/src/types/<feature>.ts` — TypeScript types
- [ ] `frontend/src/pages/<Feature>Page.tsx` — page component
- [ ] `frontend/src/app/routes.tsx` — add route
- [ ] `frontend/src/components/layout/TopNavigationBar.tsx` — add nav link (optional)
