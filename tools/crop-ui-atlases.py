from pathlib import Path

import cv2
import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]


def fitted_rgba(image: Image.Image, size: int = 96, padding: int = 3) -> Image.Image:
    alpha = image.getchannel("A")
    box = alpha.getbbox()
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    if not box:
        return canvas
    image = image.crop(box)
    limit = size - padding * 2
    scale = min(limit / image.width, limit / image.height)
    target = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    image = image.resize(target, Image.Resampling.LANCZOS)
    canvas.alpha_composite(image, ((size - target[0]) // 2, size - padding - target[1]))
    return canvas


def isolate_nearest(atlas: Image.Image, centers: list[tuple[float, float]], target: int) -> Image.Image:
    rgba = np.array(atlas)
    alpha = rgba[:, :, 3]
    count, labels, stats, centroids = cv2.connectedComponentsWithStats(
        (alpha > 24).astype(np.uint8), connectivity=8
    )
    mask = np.zeros_like(alpha, dtype=np.uint8)
    for label in range(1, count):
        area = stats[label, cv2.CC_STAT_AREA]
        cx, cy = centroids[label]
        nearest = min(
            range(len(centers)),
            key=lambda index: (cx - centers[index][0]) ** 2 + (cy - centers[index][1]) ** 2,
        )
        if area >= 32 and nearest == target:
            mask[labels == label] = alpha[labels == label]
    rgba[:, :, 3] = mask
    return Image.fromarray(rgba, "RGBA")


def crop_npcs() -> None:
    atlas = Image.open(ROOT / "assets/npc-atlas-transparent-v1.png").convert("RGBA")
    names = ["bajie", "shaseng", "bailong", "taibai", "tangseng", "landgod"]
    centers = [
        ((frame + 0.5) * atlas.width / 6, (row + 0.5) * atlas.height / 2)
        for row in range(2)
        for frame in range(6)
    ]
    out_dir = ROOT / "assets/npcs"
    out_dir.mkdir(parents=True, exist_ok=True)
    for index, name in enumerate(names):
        sheet = Image.new("RGBA", (192, 96), (0, 0, 0, 0))
        for frame in range(2):
            target = (index // 3) * 6 + (index % 3) * 2 + frame
            isolated = isolate_nearest(atlas, centers, target)
            sheet.alpha_composite(fitted_rgba(isolated), (frame * 96, 0))
        sheet.save(out_dir / f"{name}.png", optimize=True)


def crop_items() -> None:
    atlas = Image.open(ROOT / "assets/item-atlas-transparent-v1.png").convert("RGBA")
    names = ["key-yellow", "key-blue", "key-red", "peach", "three-point-blade", "nine-tooth-rake", "dragon-shield", "kasaya"]
    centers = [
        ((col + 0.5) * atlas.width / 4, (row + 0.5) * atlas.height / 2)
        for row in range(2)
        for col in range(4)
    ]
    out_dir = ROOT / "assets/items"
    out_dir.mkdir(parents=True, exist_ok=True)
    for index, name in enumerate(names):
        isolated = isolate_nearest(atlas, centers, index)
        fitted_rgba(isolated, padding=2).save(out_dir / f"{name}.png", optimize=True)


def crop_mirror_and_boss_relics() -> None:
    out_dir = ROOT / "assets/items"
    mirror = Image.open(ROOT / "assets/demon-mirror-transparent-v1.png").convert("RGBA")
    fitted_rgba(mirror, padding=2).save(out_dir / "demon-mirror.png", optimize=True)

    atlas = Image.open(ROOT / "assets/boss-relic-atlas-transparent-v1.png").convert("RGBA")
    names = ["tiger-saber", "blackwind-kasaya", "wind-pearl", "demon-staff", "fire-spear", "scorpion-pipa", "twogas-vase", "golden-eye", "lotus-scripture"]
    centers = [
        ((col + 0.5) * atlas.width / 3, (row + 0.5) * atlas.height / 3)
        for row in range(3)
        for col in range(3)
    ]
    for index, name in enumerate(names):
        fitted_rgba(isolate_nearest(atlas, centers, index), padding=2).save(out_dir / f"{name}.png", optimize=True)


def make_qa_sheet() -> None:
    checker = Image.new("RGB", (96, 96), "#20242c")
    pixels = checker.load()
    for y in range(96):
        for x in range(96):
            if (x // 12 + y // 12) % 2:
                pixels[x, y] = (48, 53, 64)
    npc_names = ["bajie", "shaseng", "bailong", "taibai", "tangseng", "landgod"]
    item_names = ["key-yellow", "key-blue", "key-red", "peach", "three-point-blade", "nine-tooth-rake", "dragon-shield", "kasaya"]
    sheet = Image.new("RGB", (8 * 96, 3 * 96), "#171a20")
    for index, name in enumerate(npc_names):
        sprite = Image.open(ROOT / f"assets/npcs/{name}.png").convert("RGBA")
        for frame in range(2):
            tile = checker.copy()
            tile.paste(sprite.crop((frame * 96, 0, (frame + 1) * 96, 96)), (0, 0), sprite.crop((frame * 96, 0, (frame + 1) * 96, 96)))
            sheet.paste(tile, ((index * 2 + frame) % 8 * 96, (index * 2 + frame) // 8 * 96))
    for index, name in enumerate(item_names):
        icon = Image.open(ROOT / f"assets/items/{name}.png").convert("RGBA")
        tile = checker.copy()
        tile.paste(icon, (0, 0), icon)
        sheet.paste(tile, (index * 96, 2 * 96))
    sheet.save(ROOT / "assets/ui-sprites-qa-v1.png", optimize=True)

    relic_names = ["demon-mirror", "tiger-saber", "blackwind-kasaya", "wind-pearl", "demon-staff", "fire-spear", "scorpion-pipa", "twogas-vase", "golden-eye", "lotus-scripture"]
    relic_sheet = Image.new("RGB", (5 * 96, 2 * 96), "#171a20")
    for index, name in enumerate(relic_names):
        icon = Image.open(ROOT / f"assets/items/{name}.png").convert("RGBA")
        tile = checker.copy()
        tile.paste(icon, (0, 0), icon)
        relic_sheet.paste(tile, ((index % 5) * 96, (index // 5) * 96))
    relic_sheet.save(ROOT / "assets/boss-relics-qa-v1.png", optimize=True)


if __name__ == "__main__":
    crop_npcs()
    crop_items()
    crop_mirror_and_boss_relics()
    make_qa_sheet()
