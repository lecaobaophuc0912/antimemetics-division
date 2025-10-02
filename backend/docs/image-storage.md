# PostgreSQL Binary Image Storage Solution

This solution provides multiple approaches for storing images in PostgreSQL, with a focus on binary storage for small images.

## Overview

The system now supports three image storage approaches:

1. **File-based storage** (existing) - Images stored on disk with database references
2. **Binary storage** (new) - Images stored directly in PostgreSQL as `bytea` data
3. **Hybrid approach** - Both file and binary storage with fallback options

## Database Schema Changes

### New Fields Added to Users Table

```sql
ALTER TABLE "users" 
ADD COLUMN "avatarData" bytea,
ADD COLUMN "avatarMimeType" character varying(50),
ADD COLUMN "avatarSize" integer;
```

### Migration

Run the migration to add the new fields:

```bash
npm run migration:run
```

## API Endpoints

### 1. Binary Avatar Upload

**POST** `/auth/avatar-binary`

Uploads and stores an image directly in the database as binary data.

**Features:**
- Automatic image optimization (resize, compress)
- Format conversion to JPEG
- Size validation (max 1MB)
- Dimension limits (300x300px)

**Request:**
```http
POST /auth/avatar-binary
Content-Type: multipart/form-data
Authorization: Bearer <token>

avatar: <image_file>
```

**Response:**
```json
{
  "message": "Avatar updated successfully",
  "size": 45678,
  "mimeType": "image/jpeg",
  "dimensions": {
    "width": 300,
    "height": 200
  }
}
```

### 2. Binary Avatar Retrieval

**GET** `/auth/avatar-binary/:userId`

Retrieves the binary image data directly from the database.

**Response:**
- Binary image data with appropriate headers
- Content-Type, Content-Length, and Cache-Control headers
- 1-year cache for performance

### 3. File-based Avatar Upload (Existing)

**POST** `/auth/avatar`

The existing file-based upload endpoint remains available.

## Image Processing Features

### Automatic Optimization

- **Resizing**: Automatically resizes images to fit within 300x300px
- **Compression**: JPEG compression with 80% quality
- **Format Conversion**: Converts all images to JPEG for consistency
- **Size Validation**: Ensures final size is under 1MB

### Supported Formats

- JPEG
- PNG  
- WebP

## Performance Considerations

### Binary Storage Advantages

- **Faster Retrieval**: No disk I/O required
- **Atomic Operations**: Image data stored with user data
- **Backup Consistency**: Images included in database backups
- **No File System Dependencies**: Works in containerized environments

### Binary Storage Limitations

- **Database Size**: Increases database size
- **Memory Usage**: Images loaded into memory during retrieval
- **Network Transfer**: Binary data transferred over HTTP

### Recommended Use Cases

**Use Binary Storage For:**
- Small images (< 1MB)
- Avatars and thumbnails
- Frequently accessed images
- Applications requiring data consistency

**Use File Storage For:**
- Large images (> 1MB)
- High-resolution photos
- Images with complex processing requirements
- Applications with CDN integration

## Implementation Details

### Image Service

The `ImageService` provides:

```typescript
// Process image for storage
const processedImage = await imageService.processImageForStorage(
  buffer,
  {
    maxWidth: 300,
    maxHeight: 300,
    quality: 80,
    format: 'jpeg',
    maxSizeBytes: 1024 * 1024
  }
);

// Generate thumbnails
const thumbnail = await imageService.generateThumbnail(buffer, 100, 100);

// Convert to base64
const base64 = await imageService.imageToBase64(buffer, mimeType);
```

### Database Storage

Images are stored using PostgreSQL's `bytea` type:

```typescript
@Column({ type: 'bytea', nullable: true })
avatarData: Buffer | null;

@Column({ type: 'varchar', length: 50, nullable: true })
avatarMimeType: string | null;

@Column({ type: 'integer', nullable: true })
avatarSize: number | null;
```

## Security Features

### File Validation

- MIME type validation
- File size limits
- Image format verification
- Malicious file detection

### Access Control

- JWT authentication required
- User ownership validation
- Rate limiting support

## Monitoring and Maintenance

### Database Size Monitoring

Monitor the size of the `avatarData` column:

```sql
SELECT 
  pg_size_pretty(pg_total_relation_size('users')) as total_size,
  pg_size_pretty(pg_column_size(avatarData)) as avatar_data_size
FROM users 
WHERE avatarData IS NOT NULL;
```

### Cleanup Operations

Remove old binary avatars:

```sql
-- Remove avatars older than 30 days
UPDATE users 
SET avatarData = NULL, avatarMimeType = NULL, avatarSize = NULL
WHERE updatedAt < NOW() - INTERVAL '30 days'
AND avatarData IS NOT NULL;
```

## Migration Strategy

### From File Storage to Binary Storage

1. **Backup existing avatars**
2. **Run database migration**
3. **Convert existing files to binary** (optional script)
4. **Update frontend to use new endpoints**

### Rollback Plan

If issues arise:

1. **Keep file storage endpoints active**
2. **Revert database migration**
3. **Restore from backup**

## Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:e2e
```

### Manual Testing

Test image upload and retrieval:

```bash
# Upload image
curl -X POST http://localhost:3000/auth/avatar-binary \
  -H "Authorization: Bearer <token>" \
  -F "avatar=@test-image.jpg"

# Retrieve image
curl http://localhost:3000/auth/avatar-binary/<userId> \
  -o retrieved-image.jpg
```

## Troubleshooting

### Common Issues

1. **Image too large**: Check file size limits
2. **Invalid format**: Ensure supported image types
3. **Memory issues**: Monitor database memory usage
4. **Performance**: Use appropriate caching strategies

### Debug Mode

Enable detailed logging:

```typescript
// In main.ts
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

## Future Enhancements

### Planned Features

- **Image cropping**: User-defined crop areas
- **Multiple sizes**: Generate various thumbnail sizes
- **CDN integration**: Hybrid storage with CDN
- **Image analytics**: Usage tracking and optimization

### Scalability Improvements

- **Database partitioning**: Partition by user or date
- **Compression algorithms**: Advanced image compression
- **Caching layers**: Redis integration for frequently accessed images

## Support

For issues or questions:

1. Check the logs for error details
2. Verify database connectivity
3. Ensure all dependencies are installed
4. Review image file requirements

## License

This solution is part of the Antimemetics Division project.
