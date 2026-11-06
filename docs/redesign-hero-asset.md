# BioAxis Redesign Photography

Reviewed: 2026-11-05. Final hero selection follows the user's preference for a broad, pale-background product photograph. It replaces the rejected orange tip-opening macro; the five approved category thumbnails are unchanged.

## Delivered Assets

Six real photographs are supplied as optimized WebP derivatives. Sources, authors and licenses were verified on Wikimedia Commons before download. Original SHA-1 checksums matched Commons metadata. Originals and final exports were visually inspected with `view_image`; no browser was run.

Paths below are relative to the repository root. Crop coordinates are original-image pixel bounds `[left, top, right, bottom]`, with right and bottom exclusive.

| File | Dimensions | Bytes | Source crop | Subject |
| --- | --- | --- | --- | --- |
| `public/images/redesign/hero-consumables.webp` | 1920 x 1280 | 129754 | `[100,200,3100,2200]` | Blue and white tip boxes, racks and loose tips |
| `public/images/redesign/liquid-handling.webp` | 640 x 480 | 16738 | `[110,260,1926,1622]` | Yellow tips in a white rack |
| `public/images/redesign/cell-culture.webp` | 640 x 480 | 14608 | `[100,0,3420,2490]` | Transparent 12-well culture plate |
| `public/images/redesign/filtration.webp` | 640 x 480 | 11538 | `[150,1070,950,1670]` | Syringe filters from a wider filter-selection photo |
| `public/images/redesign/tubes-storage.webp` | 640 x 480 | 5792 | `[400,1260,1400,2010]` | Two screw-cap microtubes |
| `public/images/redesign/pcr.webp` | 640 x 480 | 9520 | `[0,105,1596,1302]` | PCR tube strips and cap strip |

Total image payload: 187950 bytes, approximately 184 KiB. Machine-readable metadata is supplied in `public/images/redesign/attribution.json`, including source and original-download URLs, exact titles and author names, licenses, original dimensions and SHA-1 checksums, output SHA-256 checksums, crop bounds, suggested alt text, and credit text.

## Hero Selection

The [tip-box source photograph](https://commons.wikimedia.org/wiki/File:Pipette_tips_boxes.jpg), by [Nadine90](https://commons.wikimedia.org/wiki/User:Nadine90), depicts a broad arrangement of blue and white tip boxes, visible racks, and loose tips on a pale backdrop. Commons identifies it as the author's own photograph, taken 2011-01-23 with a Pentax K10D, in cooperation with the Fotoedukacja school of photography. The [reviewed revision](https://commons.wikimedia.org/w/index.php?title=File:Pipette_tips_boxes.jpg&oldid=1280213930) records [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

The light landscape crop removes outer backdrop edges while preserving the broad product forms. The original pale, cool-gray/white photographic background, shadows, packaging and visible manufacturer labels are retained without retouching. It is not a pure-white cutout, and the visible brands do not imply endorsement or a BioAxis supply relationship. The saturated orange close-up has been overwritten and is not delivered as an alternative.

Place this 3:2 image on the right, unframed, with the white text region outside the photograph. Do not stretch it across the left text region or put it inside a decorative media card. Preserve its aspect ratio wherever practical; no artificial negative space or background extension has been added.

## Sources And Credits

Publish these credits with working source and license links, retaining the original titles from the JSON manifest when assembling a full image-credits page. The derivatives are distributed under their respective source licenses, not under the site's default proprietary asset terms.

- Hero: [source photograph](https://commons.wikimedia.org/wiki/File:Pipette_tips_boxes.jpg), [Nadine90](https://commons.wikimedia.org/wiki/User:Nadine90), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). In cooperation with the Fotoedukacja school of photography. Cropped, resized and converted to WebP. Visible brands do not imply endorsement.
- Liquid handling: [source photograph](https://commons.wikimedia.org/wiki/File:Yellow_pipette_tips_box.jpg), [Nadine90](https://commons.wikimedia.org/wiki/User:Nadine90), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). In cooperation with the Fotoedukacja school of photography. Cropped, resized and converted to WebP.
- Cell culture: [source photograph](https://commons.wikimedia.org/wiki/File:12_wells_cell_culture_plate-01.jpg), [Lilly_M](https://commons.wikimedia.org/wiki/User:Lilly_M), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). In cooperation with the Fotoedukacja school of photography. Cropped, resized and converted to WebP.
- Filtration: [source photograph](https://commons.wikimedia.org/wiki/File:LaboratoryFilters.jpg), [Wikiwayman at English Wikipedia](https://en.wikipedia.org/wiki/User:Wikiwayman), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Cropped, resized and converted to WebP.
- Tubes and storage: [source photograph](https://commons.wikimedia.org/wiki/File:Plastic_microtubes-eppendorfs.jpg), [Nadine90](https://commons.wikimedia.org/wiki/User:Nadine90), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). In cooperation with the Fotoedukacja school of photography. Cropped, resized and converted to WebP.
- PCR: [source photograph](https://commons.wikimedia.org/wiki/File:PCR_microtube_stripes.jpg), [Nadine90](https://commons.wikimedia.org/wiki/User:Nadine90), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). In cooperation with the Fotoedukacja school of photography. Cropped, resized and converted to WebP.

CC BY-SA permits commercial reuse subject to attribution and ShareAlike conditions. Retain creator, source and license links, disclose these modifications, and preserve the derivative license when distributing these images. An accessible image-credits page linked from the site is a possible presentation; the repository document or public JSON alone does not verify that website users are being shown appropriate credit. The parent task must implement and verify public-facing attribution.

## Meaning And Limitations

Suggested disclosure: "Reference photographs of consumable types. Not BioAxis inventory. No manufacturer or photographer endorsement implied."

These images do not establish supply availability, manufacturer relationships, sterility, compatibility, regulatory status, validated performance, product specifications or cryogenic suitability. In particular, the tubes image depicts microtubes, not validated cryovials; the PCR image depicts tube strips, not a qPCR-ready system or optical-seal specification. Source filenames and any incidental product markings are provenance, not BioAxis sourcing claims.

The original culture-flask photo and macro PTFE-filter photo were not selected because of prominent manufacturer marks. The filtration export crops out the labeled in-line filter from the wider source; it retains the actual syringe filters and their small material markings. No logos were retouched away. Available photos vary in white balance and transparent-on-white contrast; their original photographic appearance was retained.

Processing was limited to normal rectangular crop, proportional Lanczos downsize, and WebP encoding (quality 86 for hero, 84 for thumbnails, method 6). No generation, generative fill, background replacement, padding, object removal, mirroring, recoloring, contrast adjustment or retouching was performed. Temporary original downloads were removed after verification and conversion; the public source URLs and checksums remain in the manifest.

## Integration Handoff

This is an asset-only delivery. Existing generated images outside `public/images/redesign/` were neither overwritten nor deleted. No application code or category mappings were changed. The parent task must select the following replacements and update their alt text from the manifest:

| Existing category key | New public path |
| --- | --- |
| `liquid-handling` | `/images/redesign/liquid-handling.webp` |
| `cell-culture` | `/images/redesign/cell-culture.webp` |
| `sample-prep-filtration` | `/images/redesign/filtration.webp` |
| `storage-cryopreservation` | `/images/redesign/tubes-storage.webp` |
| `molecular-biology-pcr` | `/images/redesign/pcr.webp` |

No application build, browser session, commit or deployment was run. Existing and concurrent worktree changes were left untouched. Verification here covers the image files and provenance, not rendered website layout or live publication.
