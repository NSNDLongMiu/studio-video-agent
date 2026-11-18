"""Vẽ nền theo ngữ cảnh cho video dọc, hoàn toàn bằng hình học Pillow."""

import argparse
import math
import random
import re
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


CANVAS = (1080, 1920)
NAVY = (12, 18, 30)
SLATE = (93, 116, 143)
RESAMPLE = Image.Resampling.LANCZOS


def tint(start, end, amount):
    return tuple(round(a + (b - a) * amount) for a, b in zip(start, end))


def rgba_canvas():
    return Image.new("RGBA", CANVAS)


def halo(image, box, color, strength):
    """Chiếu sáng theo một vùng elip mềm, có thể tràn khỏi khung."""
    left, top, right, bottom = box
    # radial_gradient chạm khoảng 180 ở giữa cạnh và 255 ở góc.
    # Đưa alpha về 0 trước cạnh để hộp ánh sáng không tạo đường cắt.
    radial = Image.radial_gradient("L").point(
        [round(strength * max(0, 1 - i / 178) ** 2.4) for i in range(256)]
    )
    alpha = radial.resize((right - left, bottom - top), Image.Resampling.BILINEAR)
    patch = Image.new("RGBA", alpha.size, color)
    patch.putalpha(alpha)
    image.alpha_composite(patch, (left, top))


def floor_grid(draw, horizon, accent, strength):
    vanishing = (485, horizon)
    for x in range(-1200, 2400, 197):
        draw.line([vanishing, (x, 1920)], fill=(*tint(SLATE, accent, .2), strength), width=3)
    for depth in (.24, .31, .40, .52, .67, .86):
        y = round(horizon + depth * (1920 - horizon))
        draw.line([(0, y), (1080, y)], fill=(*SLATE, strength), width=3)


def database(draw, accent, rng):
    def rack(x, y, width, height, facing, opacity):
        slope = round(width * .27)

        def project(u, v):
            px = round(x + u * width)
            py = round(y + u * slope + v * (height - 2 * u * slope))
            return (px if facing > 0 else 1080 - px, py)

        def box(u, v, w, h, color):
            draw.polygon([project(u, v), project(u + w, v), project(u + w, v + h), project(u, v + h)], fill=color)

        face = [project(0, 0), project(1, 0), project(1, 1), project(0, 1)]
        draw.polygon(face, fill=(*tint(NAVY, SLATE, .18), opacity))
        draw.line(face + [face[0]], fill=(*tint(SLATE, accent, .32), opacity), width=3)
        box(.07, .04, .86, .92, (*NAVY, opacity))
        for row in range(11):
            v = .065 + row * .082
            box(.10, v, .79, .064, (*tint(NAVY, SLATE, .32), opacity))
            draw.line([project(.17, v + .02), project(.61, v + .02)], fill=(*SLATE, opacity // 2), width=2)
            for u in (.73, .82):
                px, py = project(u, v + .034)
                radius = max(1, width // 76)
                draw.ellipse((px - radius, py - radius, px + radius, py + radius),
                             fill=(*accent, rng.randrange(opacity // 3, opacity + 1)))

    for facing, offset in ((1, 0), (-1, 100)):
        rack(263, 580 + offset, 165, 683, facing, 94)
        rack(120, 420 + offset, 222, 995, facing, 153)
        rack(-80, 202 + offset, 316, 1360, facing, 215)

    for x, y in ((727, 330), (118, 1220)):
        draw.rounded_rectangle((x, y, x + 220, y + 123), 10, fill=(*NAVY, 168),
                               outline=(*accent, 107), width=2)
        for col in range(1, 5):
            draw.line((x + col * 43, y + 12, x + col * 43, y + 110), fill=(*accent, 57), width=2)
        for row in range(1, 4):
            draw.line((x + 12, y + row * 30, x + 208, y + row * 30), fill=(*accent, 70), width=2)


def panel(draw, box, accent, opacity):
    x, y, right, bottom = box
    draw.rounded_rectangle((x + 12, y + 18, right + 12, bottom + 18), 21, fill=(7, 11, 20, opacity))
    draw.rounded_rectangle(box, 21, fill=(*tint(NAVY, SLATE, .15), opacity),
                           outline=(*tint(SLATE, accent, .32), opacity), width=3)
    draw.line((x + 1, y + 60, right - 1, y + 60), fill=(*SLATE, opacity // 2), width=2)
    for dx in (26, 47, 68):
        draw.ellipse((x + dx - 4, y + 26, x + dx + 4, y + 34), fill=(*accent, opacity // 2))


def code(draw, accent, rng):
    def editor(x, y, width, height, opacity):
        panel(draw, (x, y, x + width, y + height), accent, opacity)
        draw.rectangle((x + 10, y + 73, x + 55, y + height - 15), fill=(*NAVY, opacity))
        for sy in range(y + 92, y + height - 28, 53):
            draw.rounded_rectangle((x + 24, sy, x + 41, sy + 16), 4, outline=(*SLATE, opacity // 2), width=3)
        for row, sy in enumerate(range(y + 100, y + height - 27, 29)):
            indent = (0, 1, 2, 2, 1, 0, 1, 2)[row % 8]
            start = x + 77 + indent * 18
            for chunk in range(rng.randint(1, 3)):
                length = rng.randrange(22, 86)
                stop = min(start + length, x + width - 67)
                if stop <= start:
                    break
                color = tint(SLATE, accent, (.6, .05, .32)[chunk])
                draw.rounded_rectangle((start, sy, stop, sy + 6), 3, fill=(*color, opacity))
                start = stop + 12
            mini = x + width - 42
            draw.line((mini, y + 94 + row * 8, mini + rng.randrange(7, 30), y + 94 + row * 8),
                      fill=(*accent, opacity // 3), width=2)
        draw.rounded_rectangle((x + 77, y + 79, x + 81, y + 94), 2, fill=(*accent, opacity))

    editor(734, 242, 429, 465, 103)
    editor(-9, 388, 398, 586, 211)
    editor(752, 866, 308, 507, 183)
    panel(draw, (-62, 1292, 313, 1555), accent, 143)
    for row in range(5):
        y = 1385 + row * 29
        draw.line((34, y, rng.randrange(114, 278), y), fill=(*accent, 102), width=6)


def security(draw, accent, rng):
    radius = 76
    for side in (-1, 1):
        for row in range(8):
            for col in range(2):
                x = 540 + side * (287 + col * 132 + row % 2 * 66)
                y = 280 + row * 140
                vertices = [(round(x + radius * math.cos(i * math.pi / 3)),
                             round(y + radius * math.sin(i * math.pi / 3))) for i in range(6)]
                draw.polygon(vertices, outline=(*accent, 58), width=2)

    for points in (
        [(40, 467), (173, 357), (303, 508), (237, 693), (48, 761), (136, 927), (288, 1030), (72, 1154)],
        [(1010, 690), (851, 860), (974, 1002), (778, 1084), (889, 1266), (1028, 1381), (746, 1462)],
    ):
        draw.line(points, fill=(*accent, 127), width=4)
        draw.line(points[::2], fill=(*accent, 75), width=2)
        for x, y in points:
            r = rng.randint(7, 13)
            draw.ellipse((x - r * 2, y - r * 2, x + r * 2, y + r * 2), outline=(*accent, 97), width=2)
            draw.ellipse((x - r, y - r, x + r, y + r), fill=(*accent, 178))

    for r, start, end in ((158, 193, 482), (144, 10, 210), (132, 0, 360)):
        draw.arc((883 - r, 521 - r, 883 + r, 521 + r), start, end, fill=(*accent, 119), width=3)
    shield = [(883, 404), (983, 440), (972, 558), (944, 608), (883, 649),
              (822, 608), (794, 558), (783, 440)]
    draw.polygon(shield, fill=(*tint(NAVY, accent, .20), 233), outline=(*accent, 218), width=5)
    draw.arc((853, 466, 913, 533), 180, 360, fill=(*accent, 209), width=8)
    draw.rounded_rectangle((838, 503, 928, 563), 12, fill=(*tint(NAVY, accent, .48), 240),
                           outline=(*accent, 209), width=5)
    draw.line((883, 526, 883, 543), fill=(*accent, 218), width=6)
    draw.line((724, 625, 1080, 593), fill=(*accent, 102), width=3)


def incident(draw, accent, rng):
    panel(draw, (-104, 375, 393, 858), accent, 215)
    for y in range(490, 766, 54):
        draw.line((0, y, 365, y), fill=(*SLATE, 76), width=2)
    for x in range(0, 370, 60):
        draw.line((x, 474, x, 763), fill=(*SLATE, 59), width=2)
    plot = [(0, 694), (66, 668), (118, 692), (155, 589), (205, 629),
            (251, 495), (282, 575), (320, 511), (363, 532)]
    draw.polygon(plot + [(363, 765), (0, 765)], fill=(*tint(NAVY, accent, .45), 133))
    draw.line(plot, fill=(*accent, 230), width=6, joint="curve")
    for x, y in plot[2::2]:
        draw.ellipse((x - 6, y - 6, x + 6, y + 6), fill=(*accent, 237))
    for x in (22, 138, 254):
        draw.rounded_rectangle((x, 788, x + 95, 817), 8, fill=(*accent, 79))

    panel(draw, (749, 393, 1126, 716), accent, 203)
    draw.polygon([(903, 480), (1000, 641), (805, 641)],
                 fill=(*tint(NAVY, accent, .19), 229), outline=(*accent, 229), width=7)
    draw.line([(854, 595), (878, 595), (893, 573), (907, 612), (921, 589), (950, 589)],
              fill=(*accent, 220), width=5, joint="curve")

    panel(draw, (742, 999, 1122, 1353), accent, 151)
    for y in range(1090, 1315, 49):
        draw.rounded_rectangle((771, y, 1068, y + 30), 7, fill=(*tint(NAVY, SLATE, .24), 179))
        draw.ellipse((788, y + 10, 798, y + 20), fill=(*accent, 182))
        draw.line((825, y + 15, rng.randrange(907, 1034), y + 15), fill=(*SLATE, 132), width=5)
    for i in range(11):
        x = 580 + 54 * i
        draw.polygon([(x, 1585), (x + 22, 1585), (x + 69, 1531), (x + 47, 1531)],
                     fill=(*accent, 116))


def office(draw, accent, rng):
    window = (0, 277, 324, 947)
    draw.rounded_rectangle(window, 15, fill=(*tint(NAVY, accent, .35), 207),
                           outline=(*tint(SLATE, accent, .4), 227), width=10)
    for x in range(-10, 310, 28):
        top = rng.randrange(687, 868)
        draw.rectangle((x, top, x + rng.randrange(12, 26), 934), fill=(*tint(NAVY, SLATE, .25), 132))
    draw.line((153, 282, 153, 940), fill=(*tint(SLATE, accent, .44), 209), width=8)
    draw.line((0, 678, 320, 678), fill=(*tint(SLATE, accent, .44), 202), width=8)
    draw.polygon([(0, 950), (326, 950), (389, 982), (0, 982)], fill=(*tint(SLATE, accent, .21), 166))

    for y in (574, 783):
        draw.polygon([(768, y), (1080, y), (1080, y + 31), (793, y + 31)],
                     fill=(*tint(SLATE, accent, .27), 169))
        draw.line((768, y, 1080, y), fill=(*accent, 119), width=3)
        for x in (837, 863, 895, 933, 958, 988):
            height = rng.randrange(52, 103)
            color = tint(SLATE, accent, rng.uniform(.03, .48))
            draw.rounded_rectangle((x, y - height, x + 18, y - 3), 4, fill=(*color, 133))

    desk = [(52, 1516), (852, 1436), (1130, 1553), (778, 1640), (-38, 1615)]
    draw.polygon(desk, fill=(*tint(NAVY, accent, .24), 239), outline=(*tint(SLATE, accent, .48), 222), width=4)
    draw.polygon([(-38, 1615), (778, 1640), (1130, 1553), (1130, 1600), (778, 1690), (-38, 1661)],
                 fill=(*tint(NAVY, accent, .11), 249))
    draw.line((131, 1651, 88, 1920), fill=(*tint(NAVY, SLATE, .35), 193), width=28)
    draw.line((915, 1640, 1022, 1920), fill=(*tint(NAVY, SLATE, .34), 193), width=39)

    screen = [(741, 1212), (1028, 1183), (1035, 1410), (749, 1459)]
    draw.polygon(screen, fill=(*NAVY, 255), outline=(*tint(SLATE, accent, .33), 240), width=7)
    draw.polygon([(755, 1227), (1014, 1200), (1020, 1398), (763, 1440)], fill=(53, 78, 97, 190))
    draw.line((901, 1431, 912, 1484), fill=(*SLATE, 178), width=18)
    draw.polygon([(843, 1490), (942, 1473), (996, 1490), (886, 1514)], fill=(*tint(NAVY, SLATE, .45), 211))

    draw.polygon([(96, 1433), (224, 1428), (201, 1534), (120, 1540)], fill=(*tint(NAVY, accent, .48), 224))
    draw.ellipse((92, 1413, 228, 1453), fill=(*tint(NAVY, accent, .31), 238), outline=(*accent, 131), width=3)
    for x, y in ((57, 1154), (121, 1114), (199, 1124), (251, 1181), (61, 1243), (224, 1264)):
        y += 80
        draw.line((160, 1431, x, y + 26), fill=(87, 117, 94, 211), width=5)
        direction = 1 if x < 160 else -1
        leaf = [(x + direction * 44, y + 74), (x + direction * 6, y + 50),
                (x, y), (x + direction * 41, y + 25)]
        draw.polygon(leaf, fill=(83, 118, 92, rng.randrange(176, 227)))


THEMES = {
    "database": ("Hành lang máy chủ và bảng dữ liệu.", (83, 159, 210), 1220, database),
    "code": ("Cửa sổ trình soạn mã và terminal.", (92, 185, 153), 1420, code),
    "security": ("Mạng kết nối và khiên xác thực.", (160, 136, 226), 1390, security),
    "incident": ("Biểu đồ gián đoạn và bảng cảnh báo.", (237, 117, 89), 1440, incident),
    "office": ("Cửa sổ, bàn làm việc và cây văn phòng.", (223, 170, 115), 1370, office),
}


def safe_area_mask():
    """Giảm alpha ở giữa y≈250–1500, chuyển dần ra rìa, tránh đường ranh."""
    width, height = CANVAS
    horizontal = Image.frombytes("L", (width, 1), bytes(
        round(255 * min(1, max(0, (abs(x - width / 2) - 224) / 164))) for x in range(width)
    )).resize(CANVAS)
    vertical = Image.frombytes("L", (1, height), bytes(
        round(255 * min(1, max(0, (250 - y) / 190, (y - 1500) / 190))) for y in range(height)
    )).resize(CANVAS)
    return ImageChops.lighter(horizontal, vertical).filter(ImageFilter.GaussianBlur(22))


def render_layers(theme, accent, rng):
    _, _, horizon, draw_subject = THEMES[theme]
    far = Image.new("RGBA", CANVAS, NAVY)
    geometry = rgba_canvas()
    draw = ImageDraw.Draw(geometry)
    draw.polygon([(0, 80), (485, 464), (485, horizon), (0, 1610)], fill=(33, 48, 70, 152))
    draw.polygon([(1080, 176), (485, 464), (485, horizon), (1080, 1590)], fill=(41, 49, 72, 100))
    draw.polygon([(0, 1610), (485, horizon), (1080, 1590), (1080, 1920), (0, 1920)], fill=(25, 40, 56, 161))
    far = Image.alpha_composite(far, geometry.filter(ImageFilter.GaussianBlur(30)))
    if theme != "office":
        grid = rgba_canvas()
        floor_grid(ImageDraw.Draw(grid), horizon, accent, 83 if theme == "database" else 29)
        far = Image.alpha_composite(far, grid.filter(ImageFilter.GaussianBlur(5)))
    halo(far, (-922, -929, 1502, 1515), tint(SLATE, accent, .57), 188)
    halo(far, (-410, 880, 1500, 2580), tint(SLATE, accent, .5), 105)
    vignette = Image.radial_gradient("L").resize(CANVAS).point([round(117 * (n / 255) ** 2) for n in range(256)])
    shade = Image.new("RGBA", CANVAS, (5, 8, 17))
    shade.putalpha(vignette)
    far = Image.alpha_composite(far, shade)

    # Hạt một kênh, thay đổi đồng đều ba kênh màu để không lấm tấm sắc độ.
    width, height = CANVAS
    grain = Image.frombytes("L", CANVAS, rng.randbytes(width * height)).point([126 + n // 51 for n in range(256)])
    rgb = far.convert("RGB")
    far = ImageChops.add(rgb, Image.merge("RGB", (grain, grain, grain)), offset=-128).convert("RGBA")

    mid = rgba_canvas()
    draw_subject(ImageDraw.Draw(mid), accent, rng)
    if theme == "office":
        halo(mid, (-160, 148, 431, 1060), accent, 106)
    mid = mid.filter(ImageFilter.GaussianBlur(1.6))
    safe = safe_area_mask()
    mid.putalpha(ImageChops.multiply(mid.getchannel("A"), safe))

    near = rgba_canvas()
    draw = ImageDraw.Draw(near)
    draw.polygon([(0, 0), (60, 0), (19, 1090), (0, 1190)], fill=(8, 12, 23, 170))
    draw.polygon([(1080, 730), (1080, 1920), (957, 1920), (1038, 1080)], fill=(7, 12, 22, 158))
    draw.line((19, 19, 5, 557), fill=(*accent, 123), width=5)
    draw.line((1079, 1078, 1012, 1906), fill=(*accent, 107), width=6)
    for _ in range(38):
        x = rng.choice((rng.randrange(12, 248), rng.randrange(835, 1068)))
        y = rng.randrange(56, 1864)
        r = rng.randrange(2, 13)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(*accent, rng.randrange(22, 90)))
    near = near.filter(ImageFilter.GaussianBlur(6))
    halo(near, (-365, -440, 494, 871), accent, 63)
    halo(near, (770, 1220, 1370, 1990), accent, 47)
    near.putalpha(ImageChops.multiply(near.getchannel("A"), safe))
    return far, mid, near


class VietnameseParser(argparse.ArgumentParser):
    def format_usage(self):
        return super().format_usage().replace("usage:", "Cách dùng:", 1)

    def format_help(self):
        return super().format_help().replace("usage:", "Cách dùng:", 1).replace("\noptions:", "\nTùy chọn:", 1)

    def error(self, message):
        self.exit(2, f"{self.format_usage()}Lỗi tham số. Dùng --help để xem hướng dẫn.\n")


def image_size(text):
    if re.fullmatch(r"[1-9][0-9]{0,4}[xX][1-9][0-9]{0,4}", text):
        width, height = map(int, text.lower().split("x"))
        if width * height <= Image.MAX_IMAGE_PIXELS:
            return width, height
    raise argparse.ArgumentTypeError("Kích thước phải có dạng WIDTHxHEIGHT với số dương.")


def accent_color(text):
    if not re.fullmatch(r"#[0-9a-fA-F]{6}", text):
        raise argparse.ArgumentTypeError("Màu nhấn phải có dạng #RRGGBB.")
    return tuple(int(text[i:i + 2], 16) for i in (1, 3, 5))


def main():
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")
    parser = VietnameseParser(
        description="Vẽ nền Pillow theo chủ đề, không chữ.",
        add_help=False,
        allow_abbrev=False,
    )
    parser.add_argument("-h", "--help", action="help", help="Hiện hướng dẫn và thoát.")
    parser.add_argument("--list-themes", action="store_true", help="Liệt kê chủ đề và thoát.")
    parser.add_argument("--theme", choices=THEMES, help="Chủ đề nền. Bắt buộc khi xuất ảnh.")
    parser.add_argument("--out", type=Path, metavar="THƯ_MỤC", help="Thư mục nhận ảnh. Bắt buộc khi xuất ảnh.")
    parser.add_argument("--seed", type=int, default=1, metavar="N", help="Hạt giống ngẫu nhiên, mặc định 1.")
    parser.add_argument("--size", type=image_size, default=CANVAS, metavar="RỘNGxCAO",
                        help="Kích thước, mặc định 1080x1920.")
    parser.add_argument("--accent", type=accent_color, metavar="#RRGGBB", help="Màu nhấn dạng #RRGGBB.")
    parser.add_argument("--layers", action="store_true", help="Xuất thêm ba lớp PNG RGBA.")
    args = parser.parse_args()
    if args.list_themes:
        for theme, (description, *_) in THEMES.items():
            print(f"{theme} — {description}")
        return
    if args.theme is None or args.out is None:
        parser.error("Cần chọn --theme và --out.")

    accent = args.accent or THEMES[args.theme][1]
    layers = render_layers(args.theme, accent, random.Random(args.seed))
    if args.size != CANVAS:
        layers = tuple(image.resize(args.size, RESAMPLE) for image in layers)
    far, mid, near = layers
    flat = Image.alpha_composite(Image.alpha_composite(far, mid), near).convert("RGB")
    stem = f"{args.theme}_{args.seed}"
    try:
        args.out.mkdir(parents=True, exist_ok=True)
        outputs = [(stem, flat)]
        if args.layers:
            outputs.extend((f"{stem}_{name}", layer) for name, layer in zip(("far", "mid", "near"), layers))
        for name, image in outputs:
            path = args.out / f"{name}.png"
            image.save(path)
            print(path)
    except OSError as error:
        parser.exit(1, f"Không ghi được ảnh: {error}\n")


if __name__ == "__main__":
    main()
