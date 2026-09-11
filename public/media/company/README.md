# Company site media

Drop real photos and videos here. Update paths in `src/content/company/home.en.md` and `home.no.md` (`src` on each media block). Until a file is linked, the page shows a labelled placeholder describing what to shoot and why.

## Folders

| Path | Use |
|------|-----|
| `hero/` | Homepage intro — field/operations atmosphere (image or short loop video) |
| `products/salmoscan/` | Salmoscan product panel (unit in pipe / on treatment vessel) |
| `products/codcam/` | Codcam product panel (cod pen / species-specific install) |
| `products/rivercam/` | Rivercam product panel (river/coastal deployment) |
| `stories/` | Work / customer-story stills or clips |

## Video

Preferred formats: **MP4 (H.264)** or **WebM**. Keep hero loops short (≈10–20s) and reasonably compressed.

Example once a file exists:

```yaml
hero:
  media:
    kind: video
    src: /media/company/hero/operations.mp4
    label: ...
    need: ...
    message: ...
```

Same `src` pattern for products and stories.
