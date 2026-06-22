from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/story-atlas-source-v1.png"


def crop_cell(atlas: Image.Image, col: int, row: int) -> Image.Image:
    # The generated atlas has clean dividers, but its four rows are intentionally
    # composed at different heights. These bounds exclude the outer frame and
    # every divider pixel from the v1 source atlas.
    columns = [(1, 768), (769, 1535)]
    rows = [(1, 317), (318, 592), (593, 807), (809, 1023)]
    left, right = columns[col]
    top, bottom = rows[row]
    return atlas.crop((left, top, right, bottom))


def fitted_rgba(image: Image.Image, size: int = 96, padding: int = 3) -> Image.Image:
    image = image.convert("RGBA")
    box = image.getchannel("A").getbbox()
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    if not box:
        return canvas
    image = image.crop(box)
    limit = size - 2 * padding
    scale = min(limit / image.width, limit / image.height)
    target = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    image = image.resize(target, Image.Resampling.LANCZOS)
    canvas.alpha_composite(image, ((size - target[0]) // 2, size - padding - target[1]))
    return canvas


def remove_chroma(source: Path, output: Path) -> None:
    codex_home = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex"))
    helper = codex_home / "skills/.system/imagegen/scripts/remove_chroma_key.py"
    subprocess.run([
        sys.executable, str(helper), "--input", str(source), "--out", str(output),
        "--auto-key", "border", "--soft-matte", "--transparent-threshold", "12",
        "--opaque-threshold", "220", "--despill", "--edge-contract", "1",
    ], check=True)


def checkerboard(size: tuple[int, int]) -> Image.Image:
    image = Image.new("RGB", size, "#20242c")
    draw = ImageDraw.Draw(image)
    tile = 12
    for y in range(0, size[1], tile):
        for x in range(0, size[0], tile):
            if (x // tile + y // tile) % 2:
                draw.rectangle((x, y, x + tile - 1, y + tile - 1), fill="#343945")
    return image


def main() -> None:
    atlas = Image.open(SOURCE).convert("RGB")
    if atlas.size != (1536, 1024):
        raise ValueError(f"Unexpected atlas size: {atlas.size}")

    scenes = [
        (0, 0, "mind-demon-final.png"),
        (1, 0, "ending-wu.png"),
        (0, 1, "ending-zhan.png"),
        (1, 1, "ending-mi.png"),
        (0, 2, "midpoint-revelation.png"),
        (1, 2, "lion-camel-despair.png"),
    ]
    for col, row, name in scenes:
        crop_cell(atlas, col, row).save(ROOT / "assets" / name, optimize=True)

    temp_dir = ROOT / "tmp/imagegen"
    temp_dir.mkdir(parents=True, exist_ok=True)
    sixear_source = temp_dir / "sixear-chroma.png"
    sixear_alpha = temp_dir / "sixear-alpha.png"
    shard_source = temp_dir / "heart-shard-chroma.png"
    shard_alpha = temp_dir / "heart-shard-alpha.png"
    crop_cell(atlas, 0, 3).save(sixear_source)
    crop_cell(atlas, 1, 3).save(shard_source)
    remove_chroma(sixear_source, sixear_alpha)
    remove_chroma(shard_source, shard_alpha)

    sixear = Image.open(sixear_alpha).convert("RGBA")
    mid = sixear.width // 2
    sheet = Image.new("RGBA", (192, 96), (0, 0, 0, 0))
    sheet.alpha_composite(fitted_rgba(sixear.crop((0, 0, mid, sixear.height))), (0, 0))
    sheet.alpha_composite(fitted_rgba(sixear.crop((mid, 0, sixear.width, sixear.height))), (96, 0))
    sheet.save(ROOT / "assets/sprites/sixear.png", optimize=True)

    shard = fitted_rgba(Image.open(shard_alpha).convert("RGBA"), padding=5)
    shard.save(ROOT / "assets/items/heart-shard.png", optimize=True)

    if sheet.getchannel("A").getbbox() is None or shard.getchannel("A").getbbox() is None:
        raise RuntimeError("Transparent asset extraction produced an empty image")
    if sheet.getpixel((0, 0))[3] != 0 or shard.getpixel((0, 0))[3] != 0:
        raise RuntimeError("Transparent asset corners are not transparent")

    preview = Image.new("RGB", (768, 480), "#11151d")
    for index, (_, _, name) in enumerate(scenes):
        scene = Image.open(ROOT / "assets" / name).convert("RGB")
        scene.thumbnail((384, 128), Image.Resampling.LANCZOS)
        preview.paste(scene, ((index % 2) * 384, (index // 2) * 128))
    checker = checkerboard((288, 96))
    checker.paste(sheet, (0, 0), sheet)
    checker.paste(shard, (192, 0), shard)
    preview.paste(checker, (240, 384))
    preview.save(ROOT / "assets/story-assets-qa-v1.png", optimize=True)

    for path in (sixear_source, sixear_alpha, shard_source, shard_alpha):
        path.unlink(missing_ok=True)
    try:
        temp_dir.rmdir()
        temp_dir.parent.rmdir()
    except OSError:
        pass


if __name__ == "__main__":
    main()
