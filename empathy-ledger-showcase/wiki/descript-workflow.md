---
layout: wiki
title: Descript Workflow Guide
description: Using Descript for story transcription and editing
---

## Platform Overview

### Key Features
- **Automatic Transcription**: AI-powered speech-to-text
- **Text-Based Editing**: Edit audio/video like a document
- **Multitrack Timeline**: Professional editing capabilities
- **Overdub**: Voice synthesis for corrections
- **Screen Recording**: Capture presentations or demos
- **Export Options**: Multiple format support

## Initial Setup

### Account Configuration
1. **Workspace Creation**
   - Name: [Organization] Stories
   - Type: Team workspace
   - Storage: Based on volume needs

2. **Team Structure**
   ```
   Admin (Full access)
   ├── Editors (Edit access)
   ├── Transcribers (Upload/transcribe)
   └── Viewers (Read-only)
   ```

3. **Project Templates**
   - Interview Template
   - Podcast Template
   - Video Story Template
   - Audio-Only Template

### Settings Optimization
```yaml
Transcription Settings:
  Language: English (US)
  Speaker Labels: Enabled
  Filler Word Detection: Enabled
  Auto-save: Every 5 minutes

Export Defaults:
  Audio: MP3, 192kbps
  Video: MP4, 1080p
  Transcript: DOCX with timestamps
```

## Transcription Workflow

### 1. File Upload
**Supported Formats**
- Audio: MP3, WAV, M4A, AAC
- Video: MP4, MOV, AVI, MKV
- Maximum file size: 5GB (Pro plan)

**Naming Convention**
```
YYYY-MM-DD_LastName_FirstName_StoryTitle
Example: 2024-03-15_Smith_Jane_TeamBuilding
```

### 2. Transcription Process
1. **Upload File**
   - Drag and drop or browse
   - Select transcription language
   - Enable speaker detection

2. **Processing Time**
   | File Length | Processing Time |
   |-------------|-----------------|
   | 10 minutes | ~2 minutes |
   | 30 minutes | ~5 minutes |
   | 60 minutes | ~10 minutes |

3. **Initial Review**
   - Check speaker labels
   - Scan for major errors
   - Note unclear sections

### 3. Speaker Identification
```markdown
## Speaker Label Guide
- Interviewer: INT
- Subject: [First Name]
- Multiple Subjects: [First Name 1], [First Name 2]
- Unknown: Speaker 1, Speaker 2
```

## Editing Techniques

### Text-Based Editing
1. **Remove Filler Words**
   - Highlight all "um", "uh", "like"
   - Review context before deleting
   - Use "Ignore all" for consistency

2. **Correct Errors**
   - Right-click incorrect words
   - Select from suggestions
   - Or type correction directly

3. **Structure Content**
   - Add scene markers
   - Insert chapter breaks
   - Create highlights for key quotes

### Timeline Editing
1. **Basic Cuts**
   - Select text to remove
   - Press delete
   - Audio/video automatically adjusts

2. **Rearranging Content**
   - Cut sections (Cmd/Ctrl + X)
   - Place cursor at new location
   - Paste (Cmd/Ctrl + V)

3. **Adding Transitions**
   - Gap between clips: Crossfade
   - Scene changes: Fade to black
   - Audio only: Room tone fill

## Advanced Features

### Overdub Usage
**When to Use**
- Minor word corrections
- Name pronunciations
- Technical term fixes

**Setup Process**
1. Record 10-minute voice sample
2. Submit for training
3. Wait 24 hours for processing
4. Test with sample corrections

### Studio Sound
**Audio Enhancement**
- Remove background noise
- Reduce echo
- Level audio volumes
- Enhance voice clarity

**Settings**
```yaml
Intensity: Medium (default)
Noise Reduction: Enabled
Echo Removal: Auto-detect
Volume Leveling: -16 LUFS
```

## Quality Control

### Accuracy Review
1. **First Pass**
   - Technical accuracy
   - Proper names
   - Specific terminology

2. **Second Pass**
   - Context and meaning
   - Natural flow
   - Grammar and punctuation

3. **Final Pass**
   - Formatting consistency
   - Timestamp accuracy
   - Export readiness

### Common Corrections
| Issue | Solution |
|-------|----------|
| Run-on sentences | Add punctuation |
| Missing words | Type in gaps |
| Wrong homophone | Manual correction |
| Speaker confusion | Relabel speakers |

## Export Workflows

### For Transcription
```markdown
Export Settings:
- Format: DOCX
- Include: Timestamps, Speaker labels
- Layout: Interview style
- Elements: Paragraph breaks at pauses
```

### For Audio
```markdown
Export Settings:
- Format: MP3
- Quality: 192 kbps
- Normalize: -16 LUFS
- Metadata: Include title, date
```

### For Video
```markdown
Export Settings:
- Format: MP4 (H.264)
- Resolution: 1080p
- Frame rate: Match source
- Audio: AAC, 256 kbps
```

## Collaboration Features

### Comment System
- Highlight text for specific feedback
- @mention team members
- Resolve when addressed
- Export comment summary

### Version Control
```
Project_v1_raw
Project_v2_edited
Project_v3_reviewed
Project_v4_final
```

### Share Settings
| Type | Access | Use Case |
|------|--------|----------|
| View-only link | Read transcript | Stakeholder review |
| Comment link | Add feedback | Team collaboration |
| Edit link | Full access | Editor handoff |
| Download link | Export files | Final delivery |

## Integration Workflows

### With Google Drive
1. **Auto-sync Setup**
   - Connect Google account
   - Select sync folder
   - Choose sync frequency

2. **File Organization**
   ```
   /Descript Projects
     /01_Raw Uploads
     /02_In Progress
     /03_Review
     /04_Completed
   ```

### With Slack
- Share project links
- Post completion notifications
- Request reviews
- Track feedback

## Troubleshooting

### Common Issues
1. **Poor Transcription Quality**
   - Check audio quality
   - Re-run with different settings
   - Consider manual service

2. **Sync Problems**
   - Clear cache
   - Re-link account
   - Check permissions

3. **Export Failures**
   - Reduce file size
   - Check disk space
   - Try different format

### Performance Tips
- Close unused projects
- Clear completed exports
- Regular cache cleaning
- Update to latest version

## Best Practices

### Project Management
1. **Naming Consistency**
   - Use templates
   - Include dates
   - Version clearly

2. **Regular Backups**
   - Weekly exports
   - Cloud sync enabled
   - Local copies of finals

3. **Team Communication**
   - Status updates in project
   - Clear handoff notes
   - Defined review stages

### Quality Standards
- 95% accuracy target
- Consistent formatting
- Complete speaker IDs
- Verified timestamps