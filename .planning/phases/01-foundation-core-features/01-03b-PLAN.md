# Phase 1 - Plan 01-03b: Scene Tagging

---
wave: 4
depends_on: [01-03a]
files_modified:
  - src/components/SceneTagModal/SceneTagModal.tsx
  - src/components/SceneTagModal/TagForm.tsx
  - src/components/SceneTagModal/TimelineTags.tsx
  - src/components/Timeline/SceneTimeline.tsx
  - src/hooks/useSceneTags.ts
  - src/utils/storage.ts
  - src/components/MovieDetail/MovieDetail.tsx
  - package.json
autonomous: true
---

## Objective

Complete Phase 1 with scene tagging functionality including tag form, timeline visualization, and localStorage persistence.

## Overview

This plan adds the scene tagging workflow to the movie detail page. Users can contribute tags specifying timestamp (mm:ss format), phobia type, intensity (1-10), and optional notes. All tags are displayed on a vertical timeline with 30-second aggregation windows showing crowd consensus. Individual tags are also visible in an expandable list with full details.

Tags persist to localStorage with quota monitoring (per RESEARCH.md Pitfall 2). The tagging workflow establishes the foundation for backend integration in Phase 2 (authentication + server persistence). For Phase 1, tags are stored locally and displayed as "contributed by X users" without individual attribution.

This completes all Phase 1 deliverables: browsing, danger scores, detail pages, and tagging.

## Acceptance Criteria

- [ ] Scene tagging modal accessible from detail page
- [ ] Tag form accepts timestamp (mm:ss), phobia selection, intensity (1-10), notes
- [ ] Timeline visualization shows tags chronologically
- [ ] 30-second aggregation window for clustering nearby tags
- [ ] Individual tag details expandable (phobia, intensity, timestamp)
- [ ] Tags persisted to localStorage with size monitoring
- [ ] Empty state when no tags exist
- [ ] Decision made: Use MUI Timeline or custom CSS layout

<task name="update-storage-for-scene-tags" id="task-1">
  <objective>Extend storage utilities to persist scene tags with quota monitoring</objective>
  <acceptance>
    - [ ] src/utils/storage.ts updated with saveSceneTags, loadSceneTags functions
    - [ ] Tags stored by movieId for lookup efficiency
    - [ ] getStorageSize function returns current localStorage usage
    - [ ] Warning logged if storage exceeds 90% of 5MB quota
    - [ ] Graceful degradation on QuotaExceededError
  </acceptance>
  <implementation>
Update src/utils/storage.ts:

**Data structure:**
Store tags as Record<movieId, SceneTag[]> for efficient lookup.

```typescript
interface TagStorage {
  [movieId: string]: SceneTag[];
}

export const saveSceneTags = (movieId: string, tags: SceneTag[]): void => {
  try {
    const existing = loadAllSceneTags();
    existing[movieId] = tags;
    localStorage.setItem('sceneTags', JSON.stringify(existing));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Tags not saved.');
      // TODO: Show UI warning to user
    }
  }
};

export const loadSceneTags = (movieId: string): SceneTag[] => {
  const all = loadAllSceneTags();
  return all[movieId] || [];
};

export const loadAllSceneTags = (): TagStorage => {
  try {
    const data = localStorage.getItem('sceneTags');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const getStorageSize = (): number => {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total; // bytes
};
```

**Quota monitoring:**
5MB = 5,242,880 bytes. Warn at 90% = 4,718,592 bytes.

Call getStorageSize() after saveSceneTags and log warning if > 90%.

Reference RESEARCH.md "Pitfall 2: localStorage Size Exceeded by Scene Tags" for quota awareness and graceful degradation strategy.

**Phase 2 note:**
Add comment that tags will migrate to backend API in Phase 2 (authentication + server persistence). localStorage is temporary for Phase 1.
  </implementation>
</task>

<task name="create-use-scene-tags-hook" id="task-2">
  <objective>Build hook for managing scene tags state and persistence</objective>
  <acceptance>
    - [ ] src/hooks/useSceneTags.ts created
    - [ ] Loads tags for movieId on mount from localStorage
    - [ ] Provides addTag, removeTag, and tags array
    - [ ] Persists changes to localStorage on mutation
    - [ ] Increments count if duplicate tag added (same timestamp + phobia)
  </acceptance>
  <implementation>
Create src/hooks/useSceneTags.ts:

```typescript
interface UseSceneTagsReturn {
  tags: SceneTag[];
  addTag: (tag: Omit<SceneTag, 'count'>) => void;
  removeTag: (index: number) => void;
}

export const useSceneTags = (movieId: string): UseSceneTagsReturn => {
  const [tags, setTags] = useState<SceneTag[]>(() => loadSceneTags(movieId));

  useEffect(() => {
    saveSceneTags(movieId, tags);
  }, [tags, movieId]);

  const addTag = useCallback((newTag: Omit<SceneTag, 'count'>) => {
    setTags(prev => {
      // Check for duplicate (same timestamp + phobiaId within 5-second window)
      const existing = prev.find(
        t => Math.abs(t.timestamp - newTag.timestamp) <= 5 && t.phobiaId === newTag.phobiaId
      );

      if (existing) {
        // Increment count for existing tag
        return prev.map(t =>
          t === existing ? { ...t, count: t.count + 1 } : t
        );
      }

      // Add new tag with count=1
      return [...prev, { ...newTag, count: 1 }];
    });
  }, []);

  const removeTag = useCallback((index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  }, []);

  return { tags, addTag, removeTag };
};
```

**Duplicate handling:**
If tag within 5-second window of existing tag with same phobia, increment count instead of adding duplicate. This aggregates similar contributions.

**Storage:**
Side effect (useEffect) saves tags whenever they change, same pattern as usePhobias.

Reference RESEARCH.md Pattern 2 for state + persistence pattern.
  </implementation>
</task>

<task name="build-tag-form-component" id="task-3">
  <objective>Create form for submitting scene tags with validation</objective>
  <acceptance>
    - [ ] src/components/SceneTagModal/TagForm.tsx created
    - [ ] Inputs: timestamp (text mm:ss), phobia (dropdown), intensity (slider 1-10), notes (textarea)
    - [ ] Validates timestamp format and range before submission
    - [ ] Calls addTag callback on submit
    - [ ] Resets form after successful submission
    - [ ] Shows validation errors inline
  </acceptance>
  <implementation>
Create src/components/SceneTagModal/TagForm.tsx:

**Props:**
```typescript
interface TagFormProps {
  movieRuntime: number; // minutes
  onSubmit: (tag: Omit<SceneTag, 'count'>) => void;
}
```

**State:**
```typescript
const [timestamp, setTimestamp] = useState('');
const [phobiaId, setPhobiaId] = useState('');
const [intensity, setIntensity] = useState(5);
const [notes, setNotes] = useState('');
const [error, setError] = useState('');
```

**Validation:**
```typescript
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  setError('');

  const timestampSeconds = parseTimestamp(timestamp);
  if (!timestampSeconds) {
    setError('Invalid timestamp format. Use mm:ss (e.g., 45:30)');
    return;
  }

  if (!validateTimestamp(timestampSeconds, movieRuntime)) {
    setError(`Timestamp must be between 0 and ${movieRuntime} minutes`);
    return;
  }

  if (!phobiaId) {
    setError('Please select a phobia');
    return;
  }

  onSubmit({
    timestamp: timestampSeconds,
    phobiaId,
    intensity,
    notes,
  });

  // Reset form
  setTimestamp('');
  setPhobiaId('');
  setIntensity(5);
  setNotes('');
};
```

**Inputs:**
- Timestamp: `<input type="text" placeholder="mm:ss" />` (see CONTEXT.md: text input chosen over time picker)
- Phobia: `<select>` dropdown populated from PHOBIAS array
- Intensity: `<input type="range" min="1" max="10" />` with numeric label
- Notes: `<textarea>` optional field

Reference RESEARCH.md "Open Question #3" confirming mm:ss text input, and "Pitfall 4" for validation requirements.

**Accessibility:**
Labels for all inputs, error message announced to screen readers.
  </implementation>
</task>

<task name="build-scene-timeline-component" id="task-4">
  <objective>Create timeline visualization with 30-second aggregation windows</objective>
  <acceptance>
    - [ ] src/components/Timeline/SceneTimeline.tsx created
    - [ ] Displays tags in chronological order (sorted by timestamp)
    - [ ] Aggregates tags within 30-second windows
    - [ ] Shows timestamp, phobia names, user count per window
    - [ ] Color-coded by intensity (traffic-light scale)
    - [ ] Expandable to show individual tag details
    - [ ] Uses Material UI Timeline or custom vertical layout
  </acceptance>
  <implementation>
Create src/components/Timeline/SceneTimeline.tsx:

**Props:**
```typescript
interface SceneTimelineProps {
  tags: SceneTag[];
}
```

**Aggregation logic:**
```typescript
const aggregated = useMemo(() => {
  const grouped: Record<number, AggregatedTag> = {};

  tags.forEach(tag => {
    const bucket = Math.round(tag.timestamp / 30) * 30; // 30-second window
    if (!grouped[bucket]) {
      grouped[bucket] = {
        timestamp: bucket,
        phobias: [],
        maxIntensity: 0,
      };
    }

    const phobia = grouped[bucket].phobias.find(p => p.id === tag.phobiaId);
    if (phobia) {
      phobia.count += tag.count;
    } else {
      grouped[bucket].phobias.push({
        id: tag.phobiaId,
        name: getPhobiaById(tag.phobiaId)?.name || 'Unknown',
        count: tag.count,
      });
    }

    grouped[bucket].maxIntensity = Math.max(grouped[bucket].maxIntensity, tag.intensity);
  });

  return Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
}, [tags]);
```

**Rendering (Material UI Timeline):**
If using MUI Timeline (decision from task-7):

```typescript
import Timeline from '@mui/lab/Timeline';
// ... other imports

<Timeline>
  {aggregated.map(item => (
    <TimelineItem key={item.timestamp}>
      <TimelineSeparator>
        <TimelineDot style={{ backgroundColor: getDangerColor(item.maxIntensity * 10) }} />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <div>{formatTimestamp(item.timestamp)}</div>
        {item.phobias.map(p => (
          <div key={p.id}>{p.name} ({p.count} users)</div>
        ))}
      </TimelineContent>
    </TimelineItem>
  ))}
</Timeline>
```

**Custom layout alternative:**
If not using MUI (decision from task-7), create vertical div layout with CSS:
- Left side: dot + connecting line (border-left)
- Right side: content (timestamp + phobias)

Reference RESEARCH.md "Pattern 5: Timeline Tag Display" for exact aggregation window and Material UI example.

**CONTEXT.md alignment:**
"Timeline view showing tags chronologically" with "30-second aggregation window."
  </implementation>
</task>

<task name="build-timeline-tags-component" id="task-5">
  <objective>Create wrapper component displaying both aggregated timeline and individual tags</objective>
  <acceptance>
    - [ ] src/components/SceneTagModal/TimelineTags.tsx created
    - [ ] Renders SceneTimeline for visual overview
    - [ ] Shows expandable list of individual tags below timeline
    - [ ] Individual tags display: timestamp, phobia, intensity, notes, count
    - [ ] Delete button for each tag (calls removeTag)
    - [ ] Empty state if no tags exist
  </acceptance>
  <implementation>
Create src/components/SceneTagModal/TimelineTags.tsx:

**Props:**
```typescript
interface TimelineTagsProps {
  tags: SceneTag[];
  onRemoveTag: (index: number) => void;
}
```

**Layout:**
```typescript
{tags.length === 0 ? (
  <div className="empty-state">
    <p>No tags yet. Be the first to tag a scene!</p>
  </div>
) : (
  <>
    <SceneTimeline tags={tags} />

    <div className="individual-tags">
      <h3>Individual Tags ({tags.length})</h3>
      {tags.map((tag, idx) => (
        <div key={idx} className="tag-item">
          <span>{formatTimestamp(tag.timestamp)}</span>
          <span>{getPhobiaById(tag.phobiaId)?.name}</span>
          <span>Intensity: {tag.intensity}/10</span>
          {tag.notes && <p>{tag.notes}</p>}
          <span>{tag.count} user(s) tagged this</span>
          <button onClick={() => onRemoveTag(idx)}>Delete</button>
        </div>
      ))}
    </div>
  </>
)}
```

**Expandable detail:**
Use details/summary HTML element or accordion component for collapsing individual tags section.

Reference CONTEXT.md: "Show both aggregated statistics AND individual contributor tags (with expandable detail)."

**Styling:**
Individual tags in list format (not timeline layout). Border/background to distinguish from timeline.
  </implementation>
</task>

<task name="build-scene-tag-modal" id="task-6">
  <objective>Create modal orchestrating tag form and timeline display</objective>
  <acceptance>
    - [ ] src/components/SceneTagModal/SceneTagModal.tsx created
    - [ ] Opens via button on movie detail page
    - [ ] Contains two tabs or sections: "Add Tag" and "View Tags"
    - [ ] Add Tag section renders TagForm
    - [ ] View Tags section renders TimelineTags
    - [ ] Modal closable with X button and Escape key
    - [ ] Focus management for accessibility
  </acceptance>
  <implementation>
Create src/components/SceneTagModal/SceneTagModal.tsx:

**Props:**
```typescript
interface SceneTagModalProps {
  movieId: string;
  movieRuntime: number; // minutes
  isOpen: boolean;
  onClose: () => void;
}
```

**State:**
```typescript
const { tags, addTag, removeTag } = useSceneTags(movieId);
const [activeTab, setActiveTab] = useState<'add' | 'view'>('view');
```

**Layout:**
Use Headless UI Dialog (from Plan 01-02b PhobiaModal pattern):

```typescript
<Dialog open={isOpen} onClose={onClose}>
  <div className="modal-backdrop" />
  <Dialog.Panel>
    <Dialog.Title>Scene Tagging</Dialog.Title>

    <div className="tabs">
      <button onClick={() => setActiveTab('view')}>View Tags</button>
      <button onClick={() => setActiveTab('add')}>Add Tag</button>
    </div>

    {activeTab === 'view' ? (
      <TimelineTags tags={tags} onRemoveTag={removeTag} />
    ) : (
      <TagForm
        movieRuntime={movieRuntime}
        onSubmit={(tag) => {
          addTag(tag);
          setActiveTab('view'); // Switch to view after adding
        }}
      />
    )}

    <button onClick={onClose}>Close</button>
  </Dialog.Panel>
</Dialog>
```

Reference RESEARCH.md "Don't Hand-Roll" for modal accessibility recommendation (Headless UI Dialog).

**CONTEXT.md alignment:**
"Separate modal/drawer for tagging (not inline on movie detail page)."

**Default tab:**
Open to "View Tags" to show existing contributions first; user can switch to "Add Tag" when ready.
  </implementation>
</task>

<task name="integrate-tagging-into-detail-page" id="task-7">
  <objective>Add "Tag Scenes" button and SceneTagModal to MovieDetail component</objective>
  <acceptance>
    - [ ] src/components/MovieDetail/MovieDetail.tsx updated
    - [ ] "Tag Scenes" button opens SceneTagModal
    - [ ] Modal receives movieId and movieRuntime
    - [ ] Modal state managed in MovieDetail
    - [ ] Button positioned after cast section
  </acceptance>
  <implementation>
Update src/components/MovieDetail/MovieDetail.tsx from Plan 01-03a:

Add state and modal:
```typescript
const [isTagModalOpen, setIsTagModalOpen] = useState(false);
```

Add button and modal to JSX:
```typescript
<section className="cast">
  {/* ... existing cast display ... */}
</section>

<button onClick={() => setIsTagModalOpen(true)} className="tag-button">
  Tag Scenes
</button>

<SceneTagModal
  movieId={id!}
  movieRuntime={movie.runtime}
  isOpen={isTagModalOpen}
  onClose={() => setIsTagModalOpen(false)}
/>
```

Import SceneTagModal component at top of file.

**Placement:**
Button appears after overview and cast sections, before closing div. Prominent but not intrusive.

**Styling:**
Large, clear button inviting user contribution. Consider using primary color scheme.
  </implementation>
</task>

<task name="install-mui-timeline" id="task-8">
  <objective>Install Material UI Timeline component for timeline visualization</objective>
  <acceptance>
    - [ ] Decision: USE MUI TIMELINE (recommended - saves ~100 lines)
    - [ ] @mui/material, @mui/lab, @emotion/react, @emotion/styled installed
    - [ ] Package.json updated with MUI dependencies
    - [ ] MUI Timeline used in SceneTimeline component
  </acceptance>
  <implementation>
**Decision:** USE MUI TIMELINE

Install Material UI packages:
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/lab  # Timeline component is in lab package
```

**Rationale:**
- Saves ~100-150 lines of implementation code
- Timeline is critical for user experience (CONTEXT.md emphasis)
- Accessible out of box with keyboard navigation and ARIA
- Responsive design handled automatically
- Professional appearance aligned with modern SaaS apps

**Tradeoff:**
- Adds ~200KB to bundle (acceptable for improved UX and reduced implementation time)
- Opinionated styling (can be customized with MUI theming)

Reference RESEARCH.md "Standard Stack" section "UI Components & Patterns" which recommends MUI Timeline for timelines to avoid reinventing the wheel.

**Implementation:**
SceneTimeline component (task-4) will use MUI Timeline components: Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent.

Alternative: If bundle size is critical concern, implement custom CSS timeline instead. Both approaches are valid per RESEARCH.md.
  </implementation>
</task>

## Must-Haves (Goal-Backward Verification)

Phase goal: Build core phobia-aware browsing + danger scores + tagging framework

This plan must deliver:
- [x] Scene tagging UI (form + validation)
- [x] Timeline visualization (30-second aggregation)
- [x] Individual tag display with expandable details
- [x] localStorage persistence for tags
- [x] Quota monitoring for localStorage
- [x] Empty state handling
- [x] MUI Timeline integrated (decision: USE MUI)
- [ ] Movie detail page (depends on Plan 01-03a - Wave 3)
- [ ] TMDB API integration (depends on Plan 01-01 - Wave 1)

**Phase 1 Complete:**
All acceptance criteria from PROJECT.md Phase 1 are now covered across Plans 01-01, 01-02a, 01-02b, 01-03a, and 01-03b:
- [x] TMDB API integration (01-01)
- [x] Browse popular movies (01-02a)
- [x] Search functionality (01-02b)
- [x] Phobia selection (01-02b)
- [x] Movie detail page (01-03a)
- [x] Personalized danger score (01-01, 01-02a, 01-03a)
- [x] Scene tagging UI (01-03b)
- [x] View individual tags (01-03b)
- [x] Average intensity calculation (01-01 algorithm, 01-03b display)
