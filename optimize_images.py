import os
import re
from PIL import Image

def optimize_core_assets():
    # 1. Optimize Logo
    logo_path = 'assets/logo.png'
    if os.path.exists(logo_path):
        img = Image.open(logo_path)
        orig_size = os.path.getsize(logo_path)
        w, h = img.size
        # 360px width is plenty for 120px rendered logo at 3x DPR
        new_w = 360
        new_h = round(h * new_w / w)
        img_resized = img.resize((new_w, new_h), Image.LANCZOS)
        img_resized.save('assets/logo.webp', 'WEBP', quality=85, method=6)
        webp_size = os.path.getsize('assets/logo.webp')
        print(f"Logo optimized: {orig_size/1024:.1f} KB -> {webp_size/1024:.1f} KB (saved {(orig_size-webp_size)/1024:.1f} KB)")

    # 2. Optimize Hero Background
    bg_path = 'assets/atlantic.png'
    if os.path.exists(bg_path):
        img_bg = Image.open(bg_path)
        orig_size = os.path.getsize(bg_path)
        w, h = img_bg.size
        new_w = 1200
        new_h = round(h * new_w / w)
        img_bg_resized = img_bg.resize((new_w, new_h), Image.LANCZOS)
        img_bg_resized.convert('RGB').save('assets/atlantic.webp', 'WEBP', quality=68, method=6)
        webp_size = os.path.getsize('assets/atlantic.webp')
        print(f"Hero BG optimized: {orig_size/1024:.1f} KB -> {webp_size/1024:.1f} KB (saved {(orig_size-webp_size)/1024:.1f} KB)")

def optimize_product_images():
    img_dir = "assets/products"
    if not os.path.isdir(img_dir):
        return

    files = os.listdir(img_dir)
    raw = [f for f in files if re.search(r'\.(jpe?g|png)$', f, re.I)]
    
    count = 0
    total_saved = 0
    for fname in raw:
        stem = re.sub(r'\.(jpe?g|png)$', '', fname, flags=re.I)
        thumb_path = os.path.join(img_dir, f"{stem}-thumb.webp")
        full_path = os.path.join(img_dir, f"{stem}-full.webp")
        
        src_path = os.path.join(img_dir, fname)
        orig_size = os.path.getsize(src_path)

        needs_thumb = not os.path.exists(thumb_path)
        needs_full = not os.path.exists(full_path)

        if not needs_thumb and not needs_full:
            continue

        try:
            img = Image.open(src_path).convert("RGB")
        except Exception as e:
            print(f"  Warning: could not open {fname}: {e}")
            continue

        w, h = img.size

        if needs_thumb:
            tw = min(400, w)
            th = round(h * tw / w)
            thumb_img = img.resize((tw, th), Image.LANCZOS)
            thumb_img.save(thumb_path, "WEBP", quality=70, method=6)

        if needs_full:
            fw = min(800, w)
            fh = round(h * fw / w)
            full_img = img.resize((fw, fh), Image.LANCZOS)
            full_img.save(full_path, "WEBP", quality=78, method=6)

        thumb_size = os.path.getsize(thumb_path) if os.path.exists(thumb_path) else 0
        saved = max(0, orig_size - thumb_size)
        total_saved += saved
        count += 1
        print(f"  Processed {fname}: {orig_size/1024:.1f} KB -> thumb: {thumb_size/1024:.1f} KB")

    print(f"Product images: {count} processed, saved {total_saved/1024:.1f} KB.")

if __name__ == "__main__":
    optimize_core_assets()
    optimize_product_images()
